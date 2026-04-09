import { callLLM } from './openrouter.js'
import { buildPrompt } from './prompts.js'

/**
 * Run the V2 Assembly agent (Step 3c).
 * Produces the V2 Information Passport with path context and scout evidence.
 *
 * @param {Object} params
 * @param {string} params.synthOutput - Focused Synthesizer's output
 * @param {Object} params.warTableOutput - Full War Table JSON
 * @param {Object} params.fieldReport - Scout field report for the chosen path
 * @param {string} params.cartographerOutput - Raw Cartographer markdown
 * @param {{ demval, marketResearch, competitorAnalysis }} params.chapters
 * @param {string|null} params.userContext
 * @returns {string} V2 Information Passport (markdown)
 */
export async function runV2Assembly({
  synthOutput,
  warTableOutput,
  fieldReport,
  cartographerOutput,
  chapters,
  userContext,
}) {
  const { system, user } = buildPrompt('assembly_v2', {
    synthOutput,
    warTableOutput,
    fieldReport,
    cartographerOutput,
    demval: chapters.demval,
    marketResearch: chapters.marketResearch,
    competitorAnalysis: chapters.competitorAnalysis,
    userContext,
  })

  const result = await callLLM('assembly_v2', system, user)
  return result.content
}
