/**
 * Primate Synthesizer — per-track evidence packaging + cross-track kill signal assessment.
 */

import {
  TRACK_SYNTHESIS_SYSTEM,
  TRACK_SYNTHESIS_USER,
  LDM_SYNTHESIS_INSTRUCTION,
  KILL_SIGNAL_SYSTEM,
  KILL_SIGNAL_USER,
} from './prompts.js'
import { formatTrackResults } from './trackRunner.js'

/**
 * Synthesize a single track's raw results into a structured evidence package.
 *
 * @param {object} trackPlan - Plan from Smart Planner
 * @param {object} trackResults - Raw results from trackRunner
 * @param {string} passport - Full Avalon passport
 * @param {object} [options]
 * @param {boolean} [options.lowDataMode=false]
 * @param {AbortSignal} [options.signal]
 * @returns {object} Parsed evidence package JSON
 */
export async function synthesizeTrack(trackPlan, trackResults, passport, { lowDataMode = false, signal } = {}) {
  const { webText, academicText, deepDiveText } = formatTrackResults(trackResults)

  const systemPrompt = lowDataMode
    ? TRACK_SYNTHESIS_SYSTEM + '\n\n' + LDM_SYNTHESIS_INSTRUCTION
    : TRACK_SYNTHESIS_SYSTEM

  const userPrompt = TRACK_SYNTHESIS_USER(trackPlan, webText, academicText, deepDiveText, passport)

  const raw = await callSynthesisLLM(
    'openai/gpt-5.4',
    systemPrompt,
    userPrompt,
    signal,
  )

  const parsed = extractJSON(raw)

  parsed.track_id = parsed.track_id || trackPlan.track_id
  parsed.track_name = parsed.track_name || trackPlan.track_name
  parsed.queries_executed = trackResults.queriesRun || 0
  parsed.sources_consulted = trackResults.sourcesFound || 0

  return parsed
}

/**
 * Run the cross-track kill signal assessment.
 *
 * @param {Array<object>} trackSyntheses - All 6 synthesized evidence packages
 * @param {string} passport - Full Avalon passport
 * @param {object} [options]
 * @param {AbortSignal} [options.signal]
 * @returns {object} Kill signal assessment JSON
 */
export async function assessKillSignals(trackSyntheses, passport, { signal } = {}) {
  const userPrompt = KILL_SIGNAL_USER(trackSyntheses, passport)

  const raw = await callSynthesisLLM(
    'anthropic/claude-opus-4.6',
    KILL_SIGNAL_SYSTEM,
    userPrompt,
    signal,
  )

  return extractJSON(raw)
}

/**
 * Build a mapping index from KQ/DQ/IQ/PQ questions to the findings that feed them.
 * This is the critical connector between Primate's track-level findings and
 * the downstream MAAP pipeline's 42 analytical questions.
 *
 * @param {Array<object>} trackSyntheses - All 6 synthesized evidence packages
 * @returns {object} { questionIndex, unmappedFindings }
 */
export function buildQuestionMapping(trackSyntheses) {
  const index = {} // { "KQ3": [{ track_id, finding_id, title, evidence_weight, source_types }] }
  const unmapped = []

  for (const track of trackSyntheses) {
    for (const finding of (track.findings || [])) {
      const questions = finding.feeds_questions || []
      if (questions.length === 0) {
        unmapped.push({
          track_id: track.track_id,
          finding_id: finding.id,
          title: finding.title,
        })
        continue
      }

      const sourceTypes = [...new Set((finding.sources || []).map(s => s.source_type).filter(Boolean))]

      for (const q of questions) {
        if (!index[q]) index[q] = []
        index[q].push({
          track_id: track.track_id,
          finding_id: finding.id,
          title: finding.title,
          evidence_weight: finding.evidence_weight,
          source_types: sourceTypes.length > 0 ? sourceTypes : ['web'],
        })
      }
    }
  }

  // Sort question keys: KQ first, then DQ, then IQ, then PQ
  const sortKey = (q) => {
    const m = q.match(/^(KQ|DQ|IQ|PQ)-?(\d+)/)
    if (!m) return [4, 0, q]
    const typeOrder = { KQ: 0, DQ: 1, IQ: 2, PQ: 3 }
    return [typeOrder[m[1]] ?? 4, parseInt(m[2], 10)]
  }

  const sortedIndex = {}
  for (const key of Object.keys(index).sort((a, b) => {
    const [aType, aNum] = sortKey(a)
    const [bType, bNum] = sortKey(b)
    return aType - bType || aNum - bNum
  })) {
    sortedIndex[key] = index[key]
  }

  return { questionIndex: sortedIndex, unmappedFindings: unmapped }
}

// ── LLM helper ──

async function callSynthesisLLM(model, systemPrompt, userPrompt, signal) {
  const maxRetries = 2
  const baseDelay = 3000

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 8192,
        }),
        signal,
      })

      if (!response.ok) {
        const status = response.status
        if (attempt < maxRetries && [429, 502, 503, 500].includes(status)) {
          await sleep(baseDelay * Math.pow(2, attempt))
          continue
        }
        const err = await response.json().catch(() => ({}))
        throw new Error(`Synthesis LLM error ${status}: ${err.error || err.details || response.statusText}`)
      }

      const data = await response.json()
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Unexpected response format from OpenRouter')
      }
      return data.choices[0].message.content
    } catch (err) {
      if (err.name === 'AbortError') throw err
      if (attempt === maxRetries) throw err
      await sleep(baseDelay * Math.pow(2, attempt))
    }
  }
}

function extractJSON(raw) {
  let cleaned = raw.replace(/```json?\s*/g, '').replace(/```/g, '').trim()
  try { return JSON.parse(cleaned) } catch { /* continue */ }

  const objMatch = cleaned.match(/(\{[\s\S]*\})\s*$/)
  if (objMatch) {
    try { return JSON.parse(objMatch[1]) } catch { /* continue */ }
  }

  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1')
  try { return JSON.parse(cleaned) } catch { /* continue */ }

  throw new Error('Could not extract valid JSON from synthesis response')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
