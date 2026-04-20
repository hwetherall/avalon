/**
 * Scout Research Loop
 *
 * Runs a single scout for one strategic path:
 *   Phase A: Query Planning  (1 LLM call — gpt-5.4-mini)
 *   Phase B: Search Execution (4–6 Tavily calls, parallel)
 *   Phase C: Deep Dive        (conditional — 0–2 Tavily calls)
 *   Phase D: Synthesis         (1 LLM call — gpt-5.4)
 */

import { SCOUT_PLANNER_PROMPT, SCOUT_SYNTHESIS_PROMPT } from './prompts.js'

// ── LLM helper (uses existing /api/llm proxy → OpenRouter) ──

async function callScoutLLM(model, systemPrompt, userPrompt, signal) {
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
          const delay = baseDelay * Math.pow(2, attempt)
          console.warn(`Scout LLM ${status}, retrying in ${delay}ms (attempt ${attempt + 1})`)
          await sleep(delay)
          continue
        }
        const err = await response.json().catch(() => ({}))
        throw new Error(`Scout LLM error ${status}: ${err.error || err.details || response.statusText}`)
      }

      const data = await response.json()
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Unexpected response format from OpenRouter')
      }
      return data.choices[0].message.content
    } catch (err) {
      if (err.name === 'AbortError') throw err
      if (attempt < maxRetries && (err.message.includes('Failed to fetch') || err.message.includes('network'))) {
        const delay = baseDelay * Math.pow(2, attempt)
        console.warn(`Scout LLM network error, retrying in ${delay}ms`)
        await sleep(delay)
        continue
      }
      if (attempt === maxRetries) throw err
    }
  }
}

// ── Search helper with retry ──

async function executeSearches(queries, searchDepth = 'basic', signal) {
  const maxRetries = 2

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('/api/search-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queries,
          max_results: 3,
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

// ── Format search results for the synthesis prompt ──

function formatSearchResults(allSearches) {
  if (!allSearches || allSearches.length === 0) return 'No search results available.'

  return allSearches.map(search => {
    const resultBlock = (search.results || [])
      .map((r, i) => `  [${i + 1}] ${r.title}\n      URL: ${r.url}\n      ${r.content}`)
      .join('\n\n')

    return `### Query: "${search.query}"\n${resultBlock || '  No results found.'}`
  }).join('\n\n---\n\n')
}

// ── JSON extraction — handles various LLM output quirks ──

function extractJSON(raw) {
  // Strip markdown fences
  let cleaned = raw.replace(/```json?\s*/g, '').replace(/```/g, '').trim()

  // Try parsing as-is
  try { return JSON.parse(cleaned) } catch { /* continue */ }

  // Try extracting just the JSON object/array
  const objMatch = cleaned.match(/(\{[\s\S]*\})\s*$/)
  if (objMatch) {
    try { return JSON.parse(objMatch[1]) } catch { /* continue */ }
  }

  const arrMatch = cleaned.match(/(\[[\s\S]*\])\s*$/)
  if (arrMatch) {
    try { return JSON.parse(arrMatch[1]) } catch { /* continue */ }
  }

  // Try fixing common issues: trailing commas
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1')
  try { return JSON.parse(cleaned) } catch { /* continue */ }

  throw new Error('Could not extract valid JSON from LLM response')
}

// ── Phase A: Query Planning ──

async function planQueries(pathBrief, signal) {
  const userPrompt = `## Venture
${pathBrief.ventureName}

## Path Thesis
${pathBrief.thesis}

## Core Bet
${pathBrief.coreBet}

## Investigation Questions
${pathBrief.investigationQuestions}

Generate 4-6 search queries as a JSON array.`

  const raw = await callScoutLLM(
    'openai/gpt-5.4-mini',
    SCOUT_PLANNER_PROMPT,
    userPrompt,
    signal,
  )

  const queries = extractJSON(raw)

  if (!Array.isArray(queries) || queries.length === 0) {
    throw new Error('Query planning returned empty or invalid array')
  }

  // Ensure all entries are strings
  return queries.filter(q => typeof q === 'string').slice(0, 6)
}

// ── Phase D: Synthesis (also handles Phase C deep-dive decision) ──

async function synthesize(pathBrief, searchResults, signal) {
  const userPrompt = `## Venture
${pathBrief.ventureName}

## Path Being Investigated
**ID:** ${pathBrief.pathId}
**Name:** ${pathBrief.pathName}
**Thesis:** ${pathBrief.thesis}
**Core Bet:** ${pathBrief.coreBet}
**Path Type:** ${pathBrief.pathType}

## Investigation Questions
${pathBrief.investigationQuestions}

## Key Evidence From Upstream Chapters (for context, not for citation)
**For:** ${pathBrief.evidenceFor}
**Against:** ${pathBrief.evidenceAgainst}

## Search Results
${formatSearchResults(searchResults)}

Produce the field report as specified. Remember: report what you found, do not evaluate the path.`

  const raw = await callScoutLLM(
    'openai/gpt-5.4',
    SCOUT_SYNTHESIS_PROMPT,
    userPrompt,
    signal,
  )

  try {
    return extractJSON(raw)
  } catch (parseErr) {
    // Retry once with repair instruction
    console.warn('Scout synthesis JSON parse failed, attempting repair...')
    const cleaned = raw.replace(/```json?\s*/g, '').replace(/```/g, '').trim()
    const repairPrompt = `The following text was supposed to be valid JSON but failed to parse. Fix the JSON and return ONLY the corrected JSON object, nothing else:\n\n${cleaned.substring(0, 6000)}`
    const repaired = await callScoutLLM(
      'openai/gpt-5.4-mini',
      'You are a JSON repair tool. Return only valid JSON. No explanation, no markdown fences.',
      repairPrompt,
      signal,
    )
    return extractJSON(repaired)
  }
}

// ── Main Scout Loop ──

/**
 * Run a single scout for one path.
 *
 * @param {object} pathBrief  Structured path object from cartographerParser
 * @param {object} options
 * @param {AbortSignal} options.signal  Abort signal for timeout
 * @param {function}    options.onPhase Callback: (phase, detail) for UI updates
 * @returns {object} { field_report, queries_run }
 */
export async function runScout(pathBrief, { signal, onPhase } = {}) {
  const notify = onPhase || (() => {})

  // Phase A: Plan queries
  notify('planning', { message: 'Generating search queries...' })
  const queries = await planQueries(pathBrief, signal)

  // Phase B: Execute initial searches
  notify('searching', { message: `Running ${queries.length} searches...`, queriesTotal: queries.length })
  const initialResults = await executeSearches(queries, 'basic', signal)

  // Phase D (attempt 1): Synthesize — may request deep dive
  notify('synthesizing', { message: 'Analyzing search results...', queriesRun: queries.length })
  const firstPass = await synthesize(pathBrief, initialResults, signal)

  if (firstPass.deep_dive_needed && firstPass.follow_up_queries?.length > 0) {
    // Phase C: Deep dive with advanced search
    const followUpQueries = firstPass.follow_up_queries.slice(0, 2)
    notify('deep_dive', { message: `Deep dive: ${followUpQueries.length} follow-up queries...`, queriesRun: queries.length + followUpQueries.length })
    const followUpResults = await executeSearches(followUpQueries, 'advanced', signal)

    // Phase D (attempt 2): Synthesize with expanded results
    notify('synthesizing', { message: 'Synthesizing with expanded evidence...', queriesRun: queries.length + followUpQueries.length })
    const finalReport = await synthesize(pathBrief, [...initialResults, ...followUpResults], signal)

    if (!finalReport.field_report) {
      throw new Error('Deep-dive synthesis returned no field_report')
    }

    return {
      field_report: finalReport.field_report,
      queries_run: queries.length + followUpQueries.length,
      deep_dive_triggered: true,
    }
  }

  if (firstPass.deep_dive_needed) {
    // LLM asked for a deep dive but gave no follow-up queries — can't proceed.
    throw new Error('Synthesis requested deep dive but returned no follow_up_queries')
  }

  if (!firstPass.field_report) {
    throw new Error('Synthesis returned no field_report')
  }

  return {
    field_report: firstPass.field_report,
    queries_run: queries.length,
    deep_dive_triggered: false,
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
