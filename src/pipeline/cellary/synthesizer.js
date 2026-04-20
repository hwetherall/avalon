/**
 * Cellary Synthesizer — per-track evidence packaging + final dossier assembly.
 *
 * synthesizeTrack: turns raw search results for one track into a structured
 *   evidence package (findings + VQ/DQ responses + gaps).
 *
 * assembleDossier: consumes all 6 track packages and produces the FactBank +
 *   Decision Memo. Uses Claude Sonnet 4.6 — faster/cheaper than Opus for
 *   structured synthesis, and this is the phase that most needs speed.
 */

import {
  TRACK_SYNTHESIS_SYSTEM,
  TRACK_SYNTHESIS_USER,
  DOSSIER_SYSTEM,
  DOSSIER_USER,
} from './prompts.js'
import { formatTrackResults } from './trackRunner.js'

export async function synthesizeTrack(trackPlan, trackResults, passport, validationQuestions, decisionQuestions, { signal } = {}) {
  const { webText, academicText, deepDiveText } = formatTrackResults(trackResults)

  const userPrompt = TRACK_SYNTHESIS_USER(
    trackPlan,
    webText,
    academicText,
    deepDiveText,
    passport,
    validationQuestions,
    decisionQuestions,
  )

  const raw = await callSynthesisLLM(
    'openai/gpt-5.4',
    TRACK_SYNTHESIS_SYSTEM,
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

export async function assembleDossier(trackSyntheses, passport, validationQuestions, decisionQuestions, { signal } = {}) {
  const userPrompt = DOSSIER_USER(trackSyntheses, passport, validationQuestions, decisionQuestions)

  const raw = await callSynthesisLLM(
    'anthropic/claude-sonnet-4-6',
    DOSSIER_SYSTEM,
    userPrompt,
    signal,
    { maxTokens: 16384 },
  )

  return extractJSON(raw)
}

async function callSynthesisLLM(model, systemPrompt, userPrompt, signal, { maxTokens = 8192 } = {}) {
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
          max_tokens: maxTokens,
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
        throw new Error(`Cellary LLM error ${status}: ${err.error || err.details || response.statusText}`)
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

  throw new Error('Could not extract valid JSON from Cellary response')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
