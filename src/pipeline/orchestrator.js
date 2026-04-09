import { callLLM } from './openrouter.js'
import { buildPrompt } from './prompts.js'
import { runAllScouts } from './scoutOrchestrator.js'
import { parseCartographerPaths } from './cartographerParser.js'
import { runWarTable } from './warTable.js'
import { runFocusedDebate } from './debate.js'
import { runV2Assembly } from './assemblyV2.js'

// ── Step definitions for UI rendering ──
// Pre-selection steps (groups 1–3) run automatically.
// Post-selection steps (groups 4–5) run after user picks a path.

export const PRE_SELECTION_STEPS = [
  { id: '1a', label: 'Demand Val × Market Research', model: 'gpt-5.4 mini', group: 1 },
  { id: '1b', label: 'Demand Val × Competitor Analysis', model: 'gpt-5.4 mini', group: 1 },
  { id: '1c', label: 'Market Research × Competitor Analysis', model: 'gpt-5.4 mini', group: 1 },
  { id: '1.5a', label: 'Path Cartographer', model: 'Opus 4.6', group: 2 },
  { id: '2.scout', label: 'Scouts', model: 'gpt-5.4 + Tavily', group: 2.5 },
  { id: '3a', label: 'War Table', model: 'Opus 4.6', group: 3 },
]

export const POST_SELECTION_STEPS = [
  { id: '3b-i', label: 'Focused Bull', model: 'Opus 4.6', group: 4 },
  { id: '3b-ii', label: 'Focused Bear', model: 'Gemini 3.1', group: 4 },
  { id: '3b-iii', label: 'Focused Rebuttal', model: 'Opus 4.6', group: 4 },
  { id: '3b-iv', label: 'Focused Synthesizer', model: 'Opus 4.6', group: 4 },
  { id: '3c', label: 'V2 Assembly', model: 'Opus 4.6', group: 5 },
]

export const STEPS = [...PRE_SELECTION_STEPS, ...POST_SELECTION_STEPS]

// ══════════════════════════════════════════════════════════════════════════════
// Phase 1: Pre-Selection (automated)
// Steps 1 → 1.5 → 2 → 3a
// Returns all intermediate state needed for user selection + post-selection.
// ══════════════════════════════════════════════════════════════════════════════

/**
 * @param {function} [onScoutContextReady]  Called before scouts with { cartographerOutput, ventureName }
 * @param {object} [scoutGate]
 * @param {function} [scoutGate.onAfterScouts]  Called after scout results are final for this pass (before War Table)
 * @param {function} [scoutGate.waitForWarTableIfIncomplete]  If any scout lacks a field report, awaited before War Table runs
 * @param {function} [scoutGate.getLatestScoutResults]  After the wait, returns updated scout results (e.g. after user reruns)
 */
export async function runPreSelection(
  demval,
  marketResearch,
  competitorAnalysis,
  userContext,
  onStep,
  onScoutContextReady,
  scoutGate = {},
) {
  const { onAfterScouts, waitForWarTableIfIncomplete, getLatestScoutResults } = scoutGate
  const emit = (stepId, status, output = null, error = null, extra = null) => {
    onStep(stepId, { status, output, error, timestamp: Date.now(), ...extra })
  }

  const callAgent = async (agentId, inputs) => {
    const { system, user } = buildPrompt(agentId, inputs)
    const result = await callLLM(agentId, system, user)
    return result.content
  }

  // ── STEP 1: Pairwise Tensions (parallel) ──
  emit('1a', 'running')
  emit('1b', 'running')
  emit('1c', 'running')

  let tension_dm, tension_dc, tension_mc
  try {
    ;[tension_dm, tension_dc, tension_mc] = await Promise.all([
      callAgent('tension_dm', { chapterA: demval, chapterB: marketResearch, userContext })
        .then(r => { emit('1a', 'complete', r); return r })
        .catch(e => { emit('1a', 'error', null, e.message); throw e }),
      callAgent('tension_dc', { chapterA: demval, chapterB: competitorAnalysis, userContext })
        .then(r => { emit('1b', 'complete', r); return r })
        .catch(e => { emit('1b', 'error', null, e.message); throw e }),
      callAgent('tension_mc', { chapterA: marketResearch, chapterB: competitorAnalysis, userContext })
        .then(r => { emit('1c', 'complete', r); return r })
        .catch(e => { emit('1c', 'error', null, e.message); throw e }),
    ])
  } catch (e) {
    throw new Error(`Step 1 failed: ${e.message}`)
  }

  const tensions = { tension_dm, tension_dc, tension_mc }

  // ── STEP 1.5: Path Cartographer (sequential, blocking) ──
  emit('1.5a', 'running')
  let cartographerOutput
  try {
    cartographerOutput = await callAgent('cartographer', {
      demval, marketResearch, competitorAnalysis, tensions, userContext,
    })
    emit('1.5a', 'complete', cartographerOutput)
  } catch (e) {
    emit('1.5a', 'error', null, e.message)
    throw new Error(`Step 1.5 failed: ${e.message}`)
  }

  // Parse Cartographer output into structured paths
  const parsedPaths = parseCartographerPaths(cartographerOutput)
  if (parsedPaths.length === 0) {
    throw new Error('Cartographer produced no parseable paths. Cannot proceed to scouts.')
  }

  // ── STEP 2: Scouts (parallel research loops) ──
  emit('2.scout', 'running')
  let scoutResults = []
  try {
    const ventureName = userContext?.match(/venture[:\s]+(.+)/i)?.[1]?.trim()
      || cartographerOutput?.match(/venture[:\s]+(.+)/i)?.[1]?.trim()
      || 'Venture'

    if (typeof onScoutContextReady === 'function') {
      onScoutContextReady({ cartographerOutput, ventureName })
    }

    scoutResults = await runAllScouts(cartographerOutput, ventureName, (pathId, update) => {
      emit('2.scout', 'running', null, null, { scouts: { [pathId]: update } })
    })

    const successCount = scoutResults.filter(r => r.fieldReport).length
    const totalCount = scoutResults.length

    const scoutSummary = scoutResults
      .filter(r => r.fieldReport)
      .map(r => `### ${r.pathId}: ${r.pathName}\n${r.fieldReport.executive_summary}`)
      .join('\n\n')

    const statusNote = successCount < totalCount
      ? `\n\n*${successCount}/${totalCount} scouts completed successfully.*`
      : ''

    emit('2.scout', 'complete', (scoutSummary || 'No scout reports produced.') + statusNote)
  } catch (e) {
    emit('2.scout', 'error', null, e.message)
    // Scouts failing is non-fatal — War Table handles missing data
    console.warn('Scout phase failed, continuing with War Table:', e.message)
    scoutResults = parsedPaths.map(p => ({
      pathId: p.id,
      pathName: p.name,
      fieldReport: null,
      error: `Scout phase error: ${e.message}`,
    }))
  }

  const chapters = { demval, marketResearch, competitorAnalysis }

  if (typeof onAfterScouts === 'function') {
    onAfterScouts({
      tensions,
      cartographerOutput,
      parsedPaths,
      scoutResults,
      chapters,
      userContext,
    })
  }

  const allScoutsSucceeded = scoutResults.length > 0 && scoutResults.every(r => r.fieldReport != null)

  if (!allScoutsSucceeded) {
    if (typeof waitForWarTableIfIncomplete !== 'function') {
      throw new Error(
        'Not all scouts produced field reports. Wire waitForWarTableIfIncomplete (or fix scouts) before the War Table.',
      )
    }
    emit('3a', 'waiting', 'Not all scouts completed successfully. Use the panel below to rerun failed paths or continue to the War Table with partial evidence.')
    await waitForWarTableIfIncomplete()
  }

  if (typeof getLatestScoutResults === 'function') {
    const latest = getLatestScoutResults()
    if (latest && latest.length > 0) {
      scoutResults = latest
    }
  }

  // ── STEP 3a: War Table (sequential) ──
  emit('3a', 'running')
  let warTableOutput
  try {
    warTableOutput = await runWarTable(cartographerOutput, scoutResults, chapters, userContext)
    // Display a human-readable summary of the ranking
    const rankingSummary = (warTableOutput.ranking || [])
      .map(r => `#${r.rank} ${r.path_name} — ${r.elevator_pitch}`)
      .join('\n')
    const recSummary = warTableOutput.innovera_recommendation
      ? `\n\n**Innovera Recommends:** ${warTableOutput.innovera_recommendation.recommended_path_name}`
      : ''
    emit('3a', 'complete', rankingSummary + recSummary)
  } catch (e) {
    emit('3a', 'error', null, e.message)
    throw new Error(`War Table failed: ${e.message}`)
  }

  // Return all state needed for user selection + post-selection
  return {
    tensions,
    cartographerOutput,
    parsedPaths,
    scoutResults,
    warTableOutput,
    chapters: { demval, marketResearch, competitorAnalysis },
    userContext,
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Phase 2: Post-Selection (triggered by user)
// Steps 3b (debate) → 3c (assembly)
// ══════════════════════════════════════════════════════════════════════════════

export async function runPostSelection(preSelectionState, selectedPathId, overrideRationale, onStep) {
  const emit = (stepId, status, output = null, error = null) => {
    onStep(stepId, { status, output, error, timestamp: Date.now() })
  }

  const {
    tensions,
    cartographerOutput,
    parsedPaths,
    scoutResults,
    warTableOutput,
    chapters,
    userContext,
  } = preSelectionState

  // Find the chosen path + its field report
  const selectedPath = parsedPaths.find(p => p.id === selectedPathId)
  if (!selectedPath) {
    throw new Error(`Selected path ${selectedPathId} not found in parsed paths.`)
  }

  const scoutResult = scoutResults.find(r => r.pathId === selectedPathId)
  const fieldReport = scoutResult?.fieldReport || null

  // ── STEP 3b: Focused Adversarial Debate (4 sequential calls) ──
  const debateResult = await runFocusedDebate({
    selectedPath,
    fieldReport,
    warTableOutput,
    allPaths: parsedPaths,
    chapters,
    tensions,
    userContext,
    overrideRationale,
    onStep: emit,
  })

  // ── STEP 3c: V2 Assembly ──
  emit('3c', 'running')
  let passport
  try {
    passport = await runV2Assembly({
      synthOutput: debateResult.synthesizer,
      warTableOutput,
      fieldReport,
      cartographerOutput,
      chapters,
      userContext,
    })
    emit('3c', 'complete', passport)
  } catch (e) {
    emit('3c', 'error', null, e.message)
    throw new Error(`V2 Assembly failed: ${e.message}`)
  }

  return passport
}
