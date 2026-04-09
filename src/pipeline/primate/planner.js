/**
 * Smart Planner — single frontier-model call that reads the Avalon passport
 * and generates a custom research plan for each of the 6 tracks.
 */

import { SMART_PLANNER_SYSTEM, SMART_PLANNER_USER } from './prompts.js'

/**
 * Generate per-track research plans from the Avalon passport.
 *
 * @param {string} passport - Full Avalon Information Passport markdown
 * @param {string} ventureBrief - Original venture description
 * @param {object} [options]
 * @param {AbortSignal} [options.signal]
 * @returns {object} Parsed research plan with .tracks array
 */
export async function runSmartPlanner(passport, ventureBrief, { signal } = {}) {
  const userPrompt = SMART_PLANNER_USER(passport, ventureBrief)

  const raw = await callPlannerLLM(
    'anthropic/claude-opus-4.6',
    SMART_PLANNER_SYSTEM,
    userPrompt,
    signal,
  )

  const plan = extractJSON(raw)

  if (!plan.tracks || !Array.isArray(plan.tracks) || plan.tracks.length === 0) {
    throw new Error('Smart Planner returned no tracks')
  }

  const expectedIds = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6']
  for (const id of expectedIds) {
    if (!plan.tracks.find(t => t.track_id === id)) {
      plan.tracks.push({
        track_id: id,
        track_name: `Track ${id.slice(1)} (auto-generated)`,
        relevance: 'Low',
        relevance_reason: 'Smart Planner did not generate a plan for this track',
        tavily_queries: [],
        semantic_scholar_queries: [],
        deep_dive_topics: [],
        key_terms: [],
        priority_questions: [],
        kill_signals: [],
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
        throw new Error(`Smart Planner LLM error ${status}: ${err.error || err.details || response.statusText}`)
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

  throw new Error('Smart Planner returned invalid JSON. Cannot proceed without research plans.')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
