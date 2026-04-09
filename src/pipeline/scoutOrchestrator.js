/**
 * Scout Orchestrator
 *
 * Dispatches parallel scouts for all paths from the Cartographer,
 * with staggered launches, per-scout timeouts, per-scout retry,
 * and graceful degradation when individual scouts fail.
 */

import { parseCartographerPaths } from './cartographerParser.js'
import { runScout } from './scout.js'

const SCOUT_TIMEOUT_MS = 120_000
const SCOUT_STAGGER_MS = 1500  // Delay between scout launches to avoid rate limits
const SCOUT_CONCURRENCY = 6

/**
 * Run a single scout with an abort-based timeout.
 */
async function runScoutWithTimeout(pathBrief, onPhase, timeoutMs = SCOUT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const result = await runScout(pathBrief, {
      signal: controller.signal,
      onPhase,
    })
    clearTimeout(timer)
    return result
  } catch (err) {
    clearTimeout(timer)
    if (err.name === 'AbortError') {
      return {
        field_report: null,
        error: `Scout timed out after ${timeoutMs / 1000} seconds`,
        timed_out: true,
      }
    }
    throw err
  }
}

/**
 * Run a single scout with one retry on failure.
 */
async function runScoutWithRetry(pathBrief, onPhase) {
  try {
    return await runScoutWithTimeout(pathBrief, onPhase)
  } catch (firstErr) {
    console.warn(`Scout ${pathBrief.pathId} failed (${firstErr.message}), retrying...`)
    onPhase('planning', { message: 'Retrying after error...' })
    // Wait before retry to let rate limits clear
    await sleep(3000)
    try {
      return await runScoutWithTimeout(pathBrief, onPhase)
    } catch (retryErr) {
      return {
        field_report: null,
        error: `Failed after retry: ${retryErr.message}`,
        queries_run: 0,
        deep_dive_triggered: false,
      }
    }
  }
}

/**
 * Run all scouts with staggered parallel launches.
 *
 * @param {string} cartographerOutput  Raw markdown from the Cartographer
 * @param {string} ventureName         Venture name for search context
 * @param {function} onScoutUpdate     Callback: (pathId, update) for per-scout UI updates
 * @returns {object[]} Array of { pathId, pathName, status, fieldReport, error, queriesRun }
 */
export async function runAllScouts(cartographerOutput, ventureName, onScoutUpdate) {
  const paths = parseCartographerPaths(cartographerOutput)

  if (paths.length === 0) {
    throw new Error('Cartographer output contained no parseable paths. The parser could not find "Path N:" blocks in the output.')
  }

  console.log(`Scout orchestrator: parsed ${paths.length} paths from Cartographer output`)
  for (const p of paths) {
    console.log(`  ${p.id}: ${p.name} (thesis: ${p.thesis ? p.thesis.substring(0, 60) + '...' : 'EMPTY'})`)
  }

  const notify = onScoutUpdate || (() => {})

  // Build path briefs with venture name
  const pathBriefs = paths.map(path => ({
    pathId: path.id,
    pathName: path.name || `Path ${path.id}`,
    thesis: path.thesis || 'No thesis extracted',
    coreBet: path.coreBet || 'No core bet extracted',
    evidenceFor: path.evidenceFor || 'Not available',
    evidenceAgainst: path.evidenceAgainst || 'Not available',
    investigationQuestions: path.investigationQuestions || 'No investigation questions extracted',
    pathType: path.pathType || 'Unknown',
    ventureName,
  }))

  // Initialize all scouts as queued
  for (const brief of pathBriefs) {
    notify(brief.pathId, { status: 'queued', pathName: brief.pathName })
  }

  // Launch scouts with staggered starts to avoid rate limiting
  const scoutPromises = pathBriefs.map((brief, index) => {
    const onPhase = (phase, detail) => {
      notify(brief.pathId, {
        status: 'running',
        phase,
        pathName: brief.pathName,
        ...detail,
      })
    }

    // Stagger launch: each scout starts SCOUT_STAGGER_MS after the previous
    return sleep(index * SCOUT_STAGGER_MS).then(() => {
      notify(brief.pathId, { status: 'running', phase: 'starting', pathName: brief.pathName })
      return runScoutWithRetry(brief, onPhase)
    })
      .then(result => {
        const succeeded = result.field_report != null
        notify(brief.pathId, {
          status: succeeded ? 'complete' : 'error',
          pathName: brief.pathName,
          fieldReport: result.field_report,
          queriesRun: result.queries_run || 0,
          deepDive: result.deep_dive_triggered,
          error: result.error || null,
        })
        return { ...result, pathId: brief.pathId, pathName: brief.pathName }
      })
      .catch(err => {
        // This shouldn't happen since runScoutWithRetry catches errors,
        // but just in case
        notify(brief.pathId, {
          status: 'error',
          pathName: brief.pathName,
          error: err.message,
        })
        return {
          field_report: null,
          error: err.message,
          queries_run: 0,
          deep_dive_triggered: false,
          pathId: brief.pathId,
          pathName: brief.pathName,
        }
      })
  })

  // Process in concurrency batches
  const allResults = []
  for (let i = 0; i < scoutPromises.length; i += SCOUT_CONCURRENCY) {
    const batch = scoutPromises.slice(i, i + SCOUT_CONCURRENCY)
    const batchResults = await Promise.all(batch)
    allResults.push(...batchResults)
  }

  // Build final results
  const results = allResults.map(result => ({
    pathId: result.pathId,
    pathName: result.pathName,
    status: result.field_report ? 'complete' : 'error',
    fieldReport: result.field_report || null,
    queriesRun: result.queries_run || 0,
    error: result.error || null,
  }))

  const successCount = results.filter(r => r.fieldReport !== null).length
  console.log(`Scout phase complete: ${successCount}/${results.length} scouts succeeded`)

  // Log failures
  for (const r of results) {
    if (!r.fieldReport) {
      console.warn(`  ${r.pathId} (${r.pathName}) failed: ${r.error}`)
    }
  }

  // Don't throw on partial failure — return what we have.
  // The orchestrator decides whether to continue.
  return results
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
