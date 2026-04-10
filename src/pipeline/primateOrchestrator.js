/**
 * Primate Orchestrator — top-level pipeline for P&T deep research.
 *
 * Flow: Smart Planner → 6 parallel tracks → 6 parallel syntheses → kill signal check
 */

import { runSmartPlanner } from './primate/planner.js'
import { runTrack } from './primate/trackRunner.js'
import { synthesizeTrack, assessKillSignals } from './primate/synthesizer.js'

// ── Step definitions for UI rendering ──

export const PRIMATE_STEPS = [
  { id: 'pr-plan', label: 'Smart Planner', model: 'Opus 4.6', group: 10 },
  { id: 'pr-t1', label: 'T1: Tech State-of-the-Art', model: 'gpt-5.4 + Tavily', group: 11 },
  { id: 'pr-t2', label: 'T2: Reference Architecture', model: 'gpt-5.4 + Tavily', group: 11 },
  { id: 'pr-t3', label: 'T3: Component & Dependency', model: 'gpt-5.4 + Tavily', group: 11 },
  { id: 'pr-t4', label: 'T4: Regulatory & Standards', model: 'gpt-5.4 + Tavily', group: 11 },
  { id: 'pr-t5', label: 'T5: Patent & IP Landscape', model: 'gpt-5.4 + Tavily', group: 11 },
  { id: 'pr-t6', label: 'T6: Talent & Capability', model: 'gpt-5.4 + Tavily', group: 11 },
  { id: 'pr-synth', label: 'Evidence Synthesis', model: 'gpt-5.4', group: 12 },
  { id: 'pr-kill', label: 'Kill Signal Assessment', model: 'Opus 4.6', group: 13 },
]

const TRACK_STEP_MAP = {
  T1: 'pr-t1',
  T2: 'pr-t2',
  T3: 'pr-t3',
  T4: 'pr-t4',
  T5: 'pr-t5',
  T6: 'pr-t6',
}

const TRACK_TIMEOUT_MS = 10 * 60 * 1000 // 10 minutes per track

/**
 * Run the full Primate pipeline.
 *
 * @param {object} params
 * @param {string} params.passport - Full Avalon Information Passport markdown
 * @param {string} params.ventureBrief - User context / venture brief
 * @param {function} params.onStep - (stepId, { status, output, error, ...extra }) callback
 * @returns {{ plan, trackSyntheses, killSignalAssessment }}
 */
export async function runPrimate({ passport, ventureBrief, onStep }) {
  const emit = (stepId, status, output = null, error = null, extra = null) => {
    onStep(stepId, { status, output, error, timestamp: Date.now(), ...extra })
  }

  // ── Step 1: Smart Planner ──
  emit('pr-plan', 'running')
  let plan
  try {
    plan = await runSmartPlanner(passport, ventureBrief)

    const planSummary = plan.tracks
      .map(t => `**${t.track_id}** ${t.track_name} — ${t.relevance} relevance`)
      .join('\n')
    emit('pr-plan', 'complete', `Research plan generated for ${plan.venture_name || 'venture'}:\n\n${planSummary}`)
  } catch (err) {
    emit('pr-plan', 'error', null, err.message)
    throw new Error(`Smart Planner failed: ${err.message}`)
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
  emit('pr-synth', 'running')
  const synthResults = await Promise.allSettled(
    resolvedTrackResults.map(({ trackPlan, results }) =>
      synthesizeTrack(trackPlan, results, passport, { lowDataMode: false })
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
        findings: [],
        priority_question_responses: [],
        evidence_gaps: [{ id: 'G1', description: `Synthesis failed: ${result.reason?.message}`, affected_questions: [], suggested_resolution: 'Rerun this track' }],
        kill_signal_evidence: [],
        sources_consulted: 0,
        queries_executed: 0,
      })
    }
  }

  const synthSummary = trackSyntheses
    .map(t => `**${t.track_id}**: ${t.findings?.length || 0} findings, ${t.sources_consulted || 0} sources`)
    .join('\n')
  emit('pr-synth', synthErrors > 0 ? 'complete' : 'complete',
    `Synthesis complete${synthErrors > 0 ? ` (${synthErrors} tracks had errors)` : ''}:\n\n${synthSummary}`)

  // ── Step 4: Kill signal assessment ──
  emit('pr-kill', 'running')
  let killSignalAssessment
  try {
    killSignalAssessment = await assessKillSignals(trackSyntheses, passport)

    const killSummary = (killSignalAssessment.summary || [])
      .map(ks => `**${ks.status.toUpperCase()}**: ${ks.signal}`)
      .join('\n')
    emit('pr-kill', 'complete', killSummary || 'No kill signals evaluated.')
  } catch (err) {
    emit('pr-kill', 'error', null, err.message)
    killSignalAssessment = {
      venture_name: plan.venture_name,
      kill_signals_evaluated: 0,
      summary: [],
      detailed_assessments: [],
      error: err.message,
    }
  }

  return {
    plan,
    trackSyntheses,
    killSignalAssessment,
  }
}
