/**
 * Smart Vintner — Cellary's planner. Reads the Avalon passport plus the
 * validation/decision question banks and produces a targeted research plan
 * for each of the 6 Cellary tracks.
 */

import { SMART_VINTNER_SYSTEM, SMART_VINTNER_USER, TRACK_IDS } from './prompts.js'

export async function runSmartVintner(passport, ventureBrief, validationQuestions, decisionQuestions, { signal } = {}) {
  const userPrompt = SMART_VINTNER_USER(passport, ventureBrief, validationQuestions, decisionQuestions)

  const raw = await callPlannerLLM(
    'anthropic/claude-opus-4.6',
    SMART_VINTNER_SYSTEM,
    userPrompt,
    signal,
  )

  const plan = extractJSON(raw)

  if (!plan.tracks || !Array.isArray(plan.tracks) || plan.tracks.length === 0) {
    throw new Error('Smart Vintner returned no tracks')
  }

  // Backfill any missing track so downstream code never crashes on a gap.
  for (const id of TRACK_IDS) {
    if (!plan.tracks.find(t => t.track_id === id)) {
      plan.tracks.push({
        track_id: id,
        track_name: `${id} (auto-generated)`,
        relevance: 'Low',
        relevance_reason: 'Smart Vintner did not generate a plan for this track',
        feeds_validation_questions: [],
        feeds_decision_questions: [],
        tavily_queries: [],
        semantic_scholar_queries: [],
        deep_dive_topics: [],
        key_terms: [],
      })
    }
  }

  return plan
}

async function callPlannerLLM(model, systemPrompt, userPrompt, signal) {
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
        throw new Error(`Smart Vintner LLM error ${status}: ${err.error || err.details || response.statusText}`)
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

  throw new Error('Smart Vintner returned invalid JSON. Cannot proceed without research plans.')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
