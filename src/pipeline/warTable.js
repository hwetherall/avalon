import { callLLM } from './openrouter.js'
import { buildPrompt } from './prompts.js'

/**
 * Run the War Table agent (Step 3a).
 * Reads all scout field reports side by side and produces a ranked comparison.
 *
 * @param {string} cartographerOutput - Raw markdown from the Cartographer
 * @param {Array} scoutResults - Array of { pathId, pathName, fieldReport, error }
 * @param {{ demval, marketResearch, competitorAnalysis }} chapters
 * @param {string|null} userContext
 * @returns {Object} Parsed War Table JSON output
 */
export async function runWarTable(cartographerOutput, scoutResults, chapters, userContext) {
  const { system, user } = buildPrompt('war_table', {
    cartographerOutput,
    scoutResults,
    demval: chapters.demval,
    marketResearch: chapters.marketResearch,
    competitorAnalysis: chapters.competitorAnalysis,
    userContext,
  })

  const result = await callLLM('war_table', system, user)
  return parseWarTableJSON(result.content)
}

/**
 * Parse the War Table's JSON output, handling common LLM formatting issues.
 */
function parseWarTableJSON(raw) {
  // Strip markdown code fences if present
  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    // Try to extract JSON from surrounding text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch {
        // fall through
      }
    }
    throw new Error(`War Table produced invalid JSON: ${e.message}\n\nRaw output (first 500 chars):\n${raw.substring(0, 500)}`)
  }
}
