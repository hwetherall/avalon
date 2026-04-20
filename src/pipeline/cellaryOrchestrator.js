/**
 * Cellary Orchestrator — top-level pipeline for the wine & private-club
 * decision dossier.
 *
 * Flow: Smart Vintner → 6 parallel tracks → 6 parallel syntheses → Dossier
 *       (FactBank + Decision Memo).
 */

import { runSmartVintner } from './cellary/planner.js'
import { runTrack } from './cellary/trackRunner.js'
import { synthesizeTrack, assembleDossier } from './cellary/synthesizer.js'
import { VALIDATION_QUESTIONS, DECISION_QUESTIONS } from './cellary/questionBanks.js'

export const CELLARY_STEPS = [
  { id: 'ce-plan',  label: 'Smart Vintner',               model: 'Opus 4.6',         group: 20 },
  { id: 'ce-t1',    label: 'CT1: Market Sizing',          model: 'gpt-5.4 + Tavily', group: 21 },
  { id: 'ce-t2',    label: 'CT2: Client Pain & Behavior', model: 'gpt-5.4 + Tavily', group: 21 },
  { id: 'ce-t3',    label: 'CT3: Pricing & WTP',          model: 'gpt-5.4 + Tavily', group: 21 },
  { id: 'ce-t4',    label: 'CT4: Adjacent Markets',       model: 'gpt-5.4 + Tavily', group: 21 },
  { id: 'ce-t5',    label: 'CT5: Ops & Unit Economics',   model: 'gpt-5.4 + Tavily', group: 21 },
  { id: 'ce-t6',    label: 'CT6: Tech & Competitors',     model: 'gpt-5.4 + Tavily', group: 21 },
  { id: 'ce-synth', label: 'Evidence Synthesis',          model: 'gpt-5.4',          group: 22 },
  { id: 'ce-doss',  label: 'Dossier Assembly',            model: 'Sonnet 4.6',       group: 23 },
]

const TRACK_STEP_MAP = {
  CT1: 'ce-t1',
  CT2: 'ce-t2',
  CT3: 'ce-t3',
  CT4: 'ce-t4',
  CT5: 'ce-t5',
  CT6: 'ce-t6',
}

const TRACK_TIMEOUT_MS = 10 * 60 * 1000

/**
 * Run the full Cellary pipeline.
 *
 * @param {object} params
 * @param {string} params.passport - Full Avalon Information Passport markdown
 * @param {string} params.ventureBrief - User context / venture brief
 * @param {Array}  [params.validationQuestions] - Override default VQs
 * @param {Array}  [params.decisionQuestions] - Override default DQs
 * @param {function} params.onStep - (stepId, { status, output, error, ...extra }) callback
 * @returns {{ plan, trackSyntheses, dossier, validationQuestions, decisionQuestions }}
 */
export async function runCellary({
  passport,
  ventureBrief,
  validationQuestions = VALIDATION_QUESTIONS,
  decisionQuestions = DECISION_QUESTIONS,
  onStep,
}) {
  const emit = (stepId, status, output = null, error = null, extra = null) => {
    onStep(stepId, { status, output, error, timestamp: Date.now(), ...extra })
  }

  // ── Step 1: Smart Vintner (Planner) ──
  emit('ce-plan', 'running')
  let plan
  try {
    plan = await runSmartVintner(passport, ventureBrief, validationQuestions, decisionQuestions)

    const planSummary = plan.tracks
      .map(t => `**${t.track_id}** ${t.track_name} — ${t.relevance} relevance`)
      .join('\n')
    emit('ce-plan', 'complete', `Research plan for ${plan.venture_name || 'venture'}:\n\n${planSummary}`)
  } catch (err) {
    emit('ce-plan', 'error', null, err.message)
    throw new Error(`Smart Vintner failed: ${err.message}`)
  }

  // ── Step 2: Execute 6 tracks in parallel ──
  for (const trackId of Object.keys(TRACK_STEP_MAP)) {
    emit(TRACK_STEP_MAP[trackId], 'running')
  }

  const trackResults = await Promise.allSettled(
    plan.tracks.map(trackPlan => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), TRACK_TIMEOUT_MS)

      return runTrack(trackPlan, {
        signal: controller.signal,
        onProgress: (phase, detail) => {
          const stepId = TRACK_STEP_MAP[trackPlan.track_id]
          if (stepId) {
            emit(stepId, 'running', detail.message, null, {
              trackProgress: { phase, ...detail },
            })
          }
        },
      }).finally(() => clearTimeout(timeout))
    })
  )

  const resolvedTrackResults = []
  for (let i = 0; i < plan.tracks.length; i++) {
    const trackPlan = plan.tracks[i]
    const stepId = TRACK_STEP_MAP[trackPlan.track_id]
    const result = trackResults[i]

    if (result.status === 'fulfilled') {
      const r = result.value
      emit(stepId, 'complete', `${r.queriesRun} queries, ${r.sourcesFound} sources`)
      resolvedTrackResults.push({ trackPlan, results: r })
    } else {
      emit(stepId, 'error', null, result.reason?.message || 'Track execution failed')
      resolvedTrackResults.push({
        trackPlan,
        results: {
          trackId: trackPlan.track_id,
          tavilyResults: [],
          academicResults: [],
          deepDiveResults: [],
          queriesRun: 0,
          sourcesFound: 0,
        },
      })
    }
  }

  // ── Step 3: Per-track synthesis (parallel) ──
  emit('ce-synth', 'running')
  const synthResults = await Promise.allSettled(
    resolvedTrackResults.map(({ trackPlan, results }) =>
      synthesizeTrack(trackPlan, results, passport, validationQuestions, decisionQuestions)
    )
  )

  const trackSyntheses = []
  let synthErrors = 0
  for (let i = 0; i < synthResults.length; i++) {
    const result = synthResults[i]
    if (result.status === 'fulfilled') {
      trackSyntheses.push(result.value)
    } else {
      synthErrors++
      const trackPlan = resolvedTrackResults[i].trackPlan
      trackSyntheses.push({
        track_id: trackPlan.track_id,
        track_name: trackPlan.track_name,
        relevance: 'Low',
        findings: [],
        validation_question_responses: [],
        decision_question_inputs: [],
        evidence_gaps: [{
          id: 'G1',
          description: `Synthesis failed: ${result.reason?.message}`,
          affected_questions: [],
          suggested_resolution: 'Rerun this track',
        }],
        sources_consulted: 0,
        queries_executed: 0,
      })
    }
  }

  const synthSummary = trackSyntheses
    .map(t => `**${t.track_id}**: ${t.findings?.length || 0} findings, ${t.sources_consulted || 0} sources`)
    .join('\n')
  emit('ce-synth', 'complete',
    `Synthesis complete${synthErrors > 0 ? ` (${synthErrors} tracks had errors)` : ''}:\n\n${synthSummary}`)

  // ── Step 4: Dossier Assembly (FactBank + Decision Memo) ──
  emit('ce-doss', 'running')
  let dossier
  try {
    dossier = await assembleDossier(trackSyntheses, passport, validationQuestions, decisionQuestions)
    const factCount = (dossier.factbank || []).length
    const memoCount = (dossier.decision_memo || []).length
    emit('ce-doss', 'complete', `Dossier complete: ${factCount} FactBank entries, ${memoCount} Decision Memo entries.`)
  } catch (err) {
    emit('ce-doss', 'error', null, err.message)
    dossier = {
      venture_name: plan.venture_name,
      synthesis_notes: `Dossier assembly failed: ${err.message}`,
      factbank: [],
      decision_memo: [],
      error: err.message,
    }
  }

  return {
    plan,
    trackSyntheses,
    dossier,
    validationQuestions,
    decisionQuestions,
  }
}
