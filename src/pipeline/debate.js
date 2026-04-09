import { callLLM } from './openrouter.js'
import { buildPrompt } from './prompts.js'

/**
 * Run the focused adversarial debate (Step 3b).
 * Sequential: Bull → Bear → Rebuttal → Synthesizer, all focused on the chosen path.
 *
 * @param {Object} params
 * @param {Object} params.selectedPath - Parsed path object from Cartographer
 * @param {Object} params.fieldReport - Scout field report for the chosen path
 * @param {Object} params.warTableOutput - Full War Table JSON
 * @param {Array} params.allPaths - All parsed paths from Cartographer
 * @param {{ demval, marketResearch, competitorAnalysis }} params.chapters
 * @param {Object} params.tensions - { tension_dm, tension_dc, tension_mc }
 * @param {string|null} params.userContext
 * @param {string|null} params.overrideRationale
 * @param {Function} params.onStep - Callback (stepId, { status, output, error })
 * @returns {{ bull, bear, rebuttal, synthesizer }} Raw text outputs from each agent
 */
export async function runFocusedDebate({
  selectedPath,
  fieldReport,
  warTableOutput,
  allPaths,
  chapters,
  tensions,
  userContext,
  overrideRationale,
  onStep,
}) {
  const emit = (stepId, status, output = null, error = null) => {
    onStep(stepId, { status, output, error, timestamp: Date.now() })
  }

  const callAgent = async (agentId, inputs) => {
    const { system, user } = buildPrompt(agentId, inputs)
    const result = await callLLM(agentId, system, user)
    return result.content
  }

  // ── 3b-i: Focused Bull ──
  emit('3b-i', 'running')
  let bullOutput
  try {
    bullOutput = await callAgent('focused_bull', {
      selectedPath,
      fieldReport,
      warTableOutput,
      demval: chapters.demval,
      marketResearch: chapters.marketResearch,
      competitorAnalysis: chapters.competitorAnalysis,
      tensions,
      userContext,
      overrideRationale,
      otherPaths: allPaths,
    })
    emit('3b-i', 'complete', bullOutput)
  } catch (e) {
    emit('3b-i', 'error', null, e.message)
    throw new Error(`Focused Bull failed: ${e.message}`)
  }

  // ── 3b-ii: Focused Bear ──
  emit('3b-ii', 'running')
  let bearOutput
  try {
    bearOutput = await callAgent('focused_bear', {
      bullOutput,
      fieldReport,
      otherPaths: allPaths,
      warTableOutput,
      demval: chapters.demval,
      marketResearch: chapters.marketResearch,
      competitorAnalysis: chapters.competitorAnalysis,
      tensions,
      userContext,
    })
    emit('3b-ii', 'complete', bearOutput)
  } catch (e) {
    emit('3b-ii', 'error', null, e.message)
    throw new Error(`Focused Bear failed: ${e.message}`)
  }

  // ── 3b-iii: Focused Rebuttal ──
  emit('3b-iii', 'running')
  let rebuttalOutput
  try {
    rebuttalOutput = await callAgent('focused_rebuttal', {
      bullOutput,
      bearOutput,
      fieldReport,
      demval: chapters.demval,
      marketResearch: chapters.marketResearch,
      competitorAnalysis: chapters.competitorAnalysis,
      tensions,
      userContext,
    })
    emit('3b-iii', 'complete', rebuttalOutput)
  } catch (e) {
    emit('3b-iii', 'error', null, e.message)
    throw new Error(`Focused Rebuttal failed: ${e.message}`)
  }

  // ── 3b-iv: Focused Synthesizer ──
  emit('3b-iv', 'running')
  let synthesizerOutput
  try {
    synthesizerOutput = await callAgent('focused_synthesizer', {
      bullOutput,
      bearOutput,
      rebuttalOutput,
      fieldReport,
      selectedPath,
      warTableOutput,
      demval: chapters.demval,
      marketResearch: chapters.marketResearch,
      competitorAnalysis: chapters.competitorAnalysis,
      tensions,
      userContext,
    })
    emit('3b-iv', 'complete', synthesizerOutput)
  } catch (e) {
    emit('3b-iv', 'error', null, e.message)
    throw new Error(`Focused Synthesizer failed: ${e.message}`)
  }

  return { bull: bullOutput, bear: bearOutput, rebuttal: rebuttalOutput, synthesizer: synthesizerOutput }
}
