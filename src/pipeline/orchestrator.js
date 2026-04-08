import { callLLM } from './openrouter.js'
import { buildPrompt } from './prompts.js'

export const STEPS = [
  { id: '1a', label: 'Demand Val × Market Research', model: 'Opus 4.6', group: 1 },
  { id: '1b', label: 'Demand Val × Competitor Analysis', model: 'Opus 4.6', group: 1 },
  { id: '1c', label: 'Market Research × Competitor Analysis', model: 'Opus 4.6', group: 1 },
  { id: '2a', label: 'Bull Thesis', model: 'Opus 4.6', group: 2 },
  { id: '2b', label: 'Bear Attack', model: 'Gemini 3.1', group: 2 },
  { id: '2c', label: 'Bull Rebuttal', model: 'Opus 4.6', group: 2 },
  { id: '2d', label: 'Synthesizer', model: 'Opus 4.6', group: 2 },
  { id: '2e', label: 'Creative Alternative', model: 'Gemini 3.1', group: 2 },
  { id: '3a', label: 'Final Assembly', model: 'Opus 4.6', group: 3 },
]

export async function runPipeline(demval, marketResearch, competitorAnalysis, userContext, onStep) {
  const emit = (stepId, status, output = null, error = null) => {
    onStep(stepId, { status, output, error, timestamp: Date.now() })
  }

  // ── STEP 1: Pairwise Tensions (parallel) ──
  emit('1a', 'running')
  emit('1b', 'running')
  emit('1c', 'running')

  const callAgent = async (agentId, inputs) => {
    const { system, user } = buildPrompt(agentId, inputs)
    const result = await callLLM(agentId, system, user)
    return result.content
  }

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

  // ── STEP 2a: Bull Thesis (sequential) ──
  emit('2a', 'running')
  let bullThesis
  try {
    bullThesis = await callAgent('bull', {
      demval, marketResearch, competitorAnalysis, tensions, userContext,
    })
    emit('2a', 'complete', bullThesis)
  } catch (e) {
    emit('2a', 'error', null, e.message)
    throw new Error(`Step 2a failed: ${e.message}`)
  }

  // ── STEP 2b: Bear Attack (sequential) ──
  emit('2b', 'running')
  let bearAttack
  try {
    bearAttack = await callAgent('bear', {
      demval, marketResearch, competitorAnalysis, tensions, bullThesis, userContext,
    })
    emit('2b', 'complete', bearAttack)
  } catch (e) {
    emit('2b', 'error', null, e.message)
    throw new Error(`Step 2b failed: ${e.message}`)
  }

  // ── STEP 2c: Bull Rebuttal (sequential) ──
  emit('2c', 'running')
  let rebuttal
  try {
    rebuttal = await callAgent('rebuttal', {
      demval, marketResearch, competitorAnalysis, tensions, bullThesis, bearAttack, userContext,
    })
    emit('2c', 'complete', rebuttal)
  } catch (e) {
    emit('2c', 'error', null, e.message)
    throw new Error(`Step 2c failed: ${e.message}`)
  }

  // ── STEP 2d + 2e: Synthesizer + Creative (parallel) ──
  emit('2d', 'running')
  emit('2e', 'running')

  let synthOutput, creativeOutput
  try {
    ;[synthOutput, creativeOutput] = await Promise.all([
      callAgent('synthesizer', {
        demval, marketResearch, competitorAnalysis, tensions, bullThesis, bearAttack, rebuttal, userContext,
      })
        .then(r => { emit('2d', 'complete', r); return r })
        .catch(e => { emit('2d', 'error', null, e.message); throw e }),
      callAgent('creative', {
        demval, marketResearch, competitorAnalysis, tensions, bullThesis, bearAttack, rebuttal, userContext,
      })
        .then(r => { emit('2e', 'complete', r); return r })
        .catch(e => { emit('2e', 'error', null, e.message); throw e }),
    ])
  } catch (e) {
    throw new Error(`Step 2d/2e failed: ${e.message}`)
  }

  // ── STEP 3: Final Assembly (sequential) ──
  emit('3a', 'running')
  let passport
  try {
    passport = await callAgent('assembly', {
      demval, marketResearch, competitorAnalysis, synthOutput, creativeOutput, userContext,
    })
    emit('3a', 'complete', passport)
  } catch (e) {
    emit('3a', 'error', null, e.message)
    throw new Error(`Step 3 failed: ${e.message}`)
  }

  return passport
}
