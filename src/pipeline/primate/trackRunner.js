/**
 * Track Runner — executes a single research track's planned queries.
 *
 * For each track, runs:
 *   1. Tavily web searches (3-8 queries)
 *   2. Semantic Scholar academic searches (2-4 queries, tracks 1/2/5/6)
 *   3. Deep dive sessions (1-2 topics)
 *
 * Returns raw results for downstream synthesis.
 */

import { searchBatch as searchAcademic, formatAcademicResults } from './tools/semanticScholar.js'
import { runDeepDive } from './tools/deepDive.js'

const ACADEMIC_TRACKS = new Set(['T1', 'T2', 'T5', 'T6'])

/**
 * Execute a single track's research plan.
 *
 * @param {object} trackPlan - Plan from Smart Planner for this track
 * @param {object} options
 * @param {AbortSignal} [options.signal]
 * @param {function} [options.onProgress] - (phase, detail) callback
 * @returns {{ tavilyResults, academicResults, deepDiveResults, queriesRun, sourcesFound }}
 */
export async function runTrack(trackPlan, { signal, onProgress } = {}) {
  const notify = onProgress || (() => {})
  const trackId = trackPlan.track_id
  let totalQueries = 0
  let totalSources = 0

  // ── Phase 1: Tavily web searches ──
  const tavilyQueries = trackPlan.tavily_queries || []
  let tavilyResults = []

  if (tavilyQueries.length > 0) {
    notify('searching', {
      message: `Running ${tavilyQueries.length} web searches...`,
      queriesRun: 0,
    })

    tavilyResults = await executeSearchBatch(tavilyQueries, 'basic', signal)
    totalQueries += tavilyQueries.length
    totalSources += tavilyResults.reduce(
      (sum, s) => sum + (s.results?.length || 0), 0,
    )
  }

  // ── Phase 2: Semantic Scholar (only for tracks with academic profiles) ──
  const scholarQueries = trackPlan.semantic_scholar_queries || []
  let academicResults = []

  if (ACADEMIC_TRACKS.has(trackId) && scholarQueries.length > 0) {
    notify('academic', {
      message: `Searching ${scholarQueries.length} academic queries...`,
      queriesRun: totalQueries,
    })

    academicResults = await searchAcademic(scholarQueries, { signal })
    totalQueries += scholarQueries.length
    totalSources += academicResults.reduce(
      (sum, s) => sum + (s.results?.length || 0), 0,
    )
  }

  // ── Phase 3: Deep dives (iterative research loops) ──
  const deepDiveTopics = trackPlan.deep_dive_topics || []
  const deepDiveResults = []

  for (let i = 0; i < Math.min(deepDiveTopics.length, 2); i++) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    notify('deep_dive', {
      message: `Deep dive ${i + 1}/${Math.min(deepDiveTopics.length, 2)}: ${deepDiveTopics[i].substring(0, 60)}...`,
      queriesRun: totalQueries,
    })

    try {
      const result = await runDeepDive(deepDiveTopics[i], {
        signal,
        onPhase: (phase, detail) => {
          notify('deep_dive', {
            message: `Deep dive ${i + 1}: ${detail.message}`,
            queriesRun: totalQueries,
          })
        },
      })
      deepDiveResults.push({
        topic: deepDiveTopics[i],
        synthesis: result.synthesis,
        queriesRun: result.queriesRun,
        sourcesFound: result.sourcesFound,
      })
      totalQueries += result.queriesRun
      totalSources += result.sourcesFound
    } catch (err) {
      if (err.name === 'AbortError') throw err
      console.warn(`Deep dive failed for track ${trackId}:`, err.message)
      deepDiveResults.push({
        topic: deepDiveTopics[i],
        synthesis: `Deep dive failed: ${err.message}`,
        queriesRun: 0,
        sourcesFound: 0,
      })
    }
  }

  return {
    trackId,
    tavilyResults,
    academicResults,
    deepDiveResults,
    queriesRun: totalQueries,
    sourcesFound: totalSources,
  }
}

/**
 * Format all track results into text blocks for the synthesis prompt.
 */
export function formatTrackResults(trackResults) {
  const webText = formatWebResults(trackResults.tavilyResults)
  const academicText = formatAcademicResults(trackResults.academicResults)
  const deepDiveText = formatDeepDiveResults(trackResults.deepDiveResults)
  return { webText, academicText, deepDiveText }
}

function formatWebResults(searches) {
  if (!searches || searches.length === 0) return 'No web search results.'

  return searches.map(search => {
    const resultBlock = (search.results || [])
      .map((r, i) => `  [${i + 1}] ${r.title}\n      URL: ${r.url}\n      ${r.content}`)
      .join('\n\n')

    return `### Query: "${search.query}"\n${resultBlock || '  No results found.'}`
  }).join('\n\n---\n\n')
}

function formatDeepDiveResults(deepDives) {
  if (!deepDives || deepDives.length === 0) return 'No deep dive results.'

  return deepDives.map((dd, i) =>
    `### Deep Dive ${i + 1}: ${dd.topic}\n\n${dd.synthesis}`
  ).join('\n\n---\n\n')
}

// ── Search helper (mirrors scout.js) ──

async function executeSearchBatch(queries, searchDepth, signal) {
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
