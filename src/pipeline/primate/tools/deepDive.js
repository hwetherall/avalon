/**
 * Deep Dive — iterative search + synthesize loop.
 * Replaces GPT Researcher with the same pattern: plan queries -> search ->
 * synthesize -> follow up -> final synthesis.
 */

import { DEEP_DIVE_PLANNER_SYSTEM, DEEP_DIVE_SYNTHESIS_SYSTEM } from '../prompts.js'

/**
 * Run a deep dive research session on a single topic.
 *
 * @param {string} topic - Research question / topic description
 * @param {object} options
 * @param {AbortSignal} [options.signal]
 * @param {function} [options.onPhase] - Progress callback: (phase, detail)
 * @returns {{ synthesis: string, queriesRun: number, sourcesFound: number }}
 */
export async function runDeepDive(topic, { signal, onPhase } = {}) {
  const notify = onPhase || (() => {})

  // Phase 1: Generate initial queries from the topic
  notify('planning', { message: 'Planning deep dive queries...' })
  const initialQueries = await planDeepDiveQueries(topic, null, signal)

  // Phase 2: Execute initial searches (advanced depth for deep dives)
  notify('searching', { message: `Running ${initialQueries.length} deep searches...` })
  const initialResults = await executeSearches(initialQueries, 'advanced', signal)

  // Phase 3: Generate follow-up queries based on gaps
  notify('analyzing', { message: 'Identifying follow-up questions...' })
  const followUpQueries = await planDeepDiveQueries(topic, initialResults, signal)

  // Phase 4: Execute follow-up searches
  let followUpResults = []
  if (followUpQueries.length > 0) {
    notify('searching', { message: `Running ${followUpQueries.length} follow-up searches...` })
    followUpResults = await executeSearches(followUpQueries.slice(0, 3), 'advanced', signal)
  }

  // Phase 5: Final synthesis
  notify('synthesizing', { message: 'Synthesizing deep dive findings...' })
  const allResults = [...initialResults, ...followUpResults]
  const synthesis = await synthesizeDeepDive(topic, allResults, signal)

  const totalSources = allResults.reduce(
    (sum, s) => sum + (s.results?.length || 0), 0,
  )

  return {
    synthesis,
    queriesRun: initialQueries.length + followUpQueries.length,
    sourcesFound: totalSources,
  }
}

async function planDeepDiveQueries(topic, existingResults, signal) {
  const context = existingResults
    ? `\n\nExisting results (find gaps):\n${formatSearchResultsCompact(existingResults)}`
    : ''

  const userPrompt = `Research topic: ${topic}${context}\n\nGenerate 3-5 targeted search queries as a JSON array.`

  const raw = await callLLM(
    'openai/gpt-5.4-mini',
    DEEP_DIVE_PLANNER_SYSTEM,
    userPrompt,
    signal,
  )

  try {
    const queries = extractJSON(raw)
    if (Array.isArray(queries)) return queries.filter(q => typeof q === 'string').slice(0, 5)
  } catch { /* fall through */ }

  return [topic]
}

async function synthesizeDeepDive(topic, allResults, signal) {
  const userPrompt = `## Research Topic
${topic}

## All Search Results
${formatSearchResults(allResults)}

Synthesize all findings into a comprehensive research summary. Cite sources with URLs.`

  return await callLLM(
    'openai/gpt-5.4',
    DEEP_DIVE_SYNTHESIS_SYSTEM,
    userPrompt,
    signal,
  )
}

// ── Helpers (mirror scout.js patterns) ──

async function callLLM(model, systemPrompt, userPrompt, signal) {
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
          max_tokens: 4096,
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
        throw new Error(`Deep dive LLM error ${status}: ${err.error || err.details || response.statusText}`)
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

async function executeSearches(queries, searchDepth, signal) {
  const maxRetries = 2
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('/api/search-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queries,
          max_results: 5,
          search_depth: searchDepth,
        }),
        signal,
      })

      if (!response.ok) {
        if (attempt < maxRetries && [429, 502, 503].includes(response.status)) {
          await sleep(2000 * Math.pow(2, attempt))
          continue
        }
        throw new Error(`Search batch failed: ${response.status}`)
      }

      const data = await response.json()
      return data.searches || []
    } catch (err) {
      if (err.name === 'AbortError') throw err
      if (attempt < maxRetries) {
        await sleep(2000 * Math.pow(2, attempt))
        continue
      }
      throw err
    }
  }
  return []
}

function formatSearchResults(allSearches) {
  if (!allSearches || allSearches.length === 0) return 'No search results available.'

  return allSearches.map(search => {
    const resultBlock = (search.results || [])
      .map((r, i) => `  [${i + 1}] ${r.title}\n      URL: ${r.url}\n      ${r.content}`)
      .join('\n\n')

    return `### Query: "${search.query}"\n${resultBlock || '  No results found.'}`
  }).join('\n\n---\n\n')
}

function formatSearchResultsCompact(allSearches) {
  if (!allSearches || allSearches.length === 0) return 'None'
  return allSearches
    .map(s => `"${s.query}": ${(s.results || []).length} results`)
    .join(', ')
}

function extractJSON(raw) {
  let cleaned = raw.replace(/```json?\s*/g, '').replace(/```/g, '').trim()
  try { return JSON.parse(cleaned) } catch { /* continue */ }

  const arrMatch = cleaned.match(/(\[[\s\S]*\])\s*$/)
  if (arrMatch) {
    try { return JSON.parse(arrMatch[1]) } catch { /* continue */ }
  }

  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1')
  try { return JSON.parse(cleaned) } catch { /* continue */ }

  throw new Error('Could not extract valid JSON from LLM response')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
