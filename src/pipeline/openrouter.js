const MODEL_MAP = {
  tension_dm:          'openai/gpt-5.4-mini',
  tension_dc:          'openai/gpt-5.4-mini',
  tension_mc:          'openai/gpt-5.4-mini',
  cartographer:        'anthropic/claude-opus-4.6',
  scout_planner:       'openai/gpt-5.4-mini',
  scout_synth:         'openai/gpt-5.4',
  war_table:           'anthropic/claude-opus-4.6',
  focused_bull:        'anthropic/claude-opus-4.6',
  focused_bear:        'google/gemini-3.1-pro-preview',
  focused_rebuttal:    'anthropic/claude-opus-4.6',
  focused_synthesizer: 'anthropic/claude-opus-4.6',
  assembly_v2:         'anthropic/claude-opus-4.6',
}

const FALLBACK_MODEL = 'anthropic/claude-opus-4.6'

const GEMINI_AGENTS = new Set(['focused_bear'])

export async function callLLM(agentId, systemPrompt, userPrompt, { maxTokens = 8192, onRetry } = {}) {
  const model = MODEL_MAP[agentId]
  const maxRetries = 2
  const baseDelay = 2000

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const currentModel = attempt > 0 && GEMINI_AGENTS.has(agentId) ? FALLBACK_MODEL : model

    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: currentModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: maxTokens,
        }),
      })

      if (!response.ok) {
        const status = response.status
        if (attempt < maxRetries && (status === 429 || status === 503 || status === 502)) {
          const delay = baseDelay * Math.pow(2, attempt)
          if (onRetry) onRetry(attempt + 1, delay, status)
          await sleep(delay)
          continue
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `API error ${status}: ${errorData.error || errorData.details || response.statusText}`
        )
      }

      const data = await response.json()

      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error('Unexpected response format from OpenRouter')
      }

      return {
        content: data.choices[0].message.content,
        model: currentModel,
        usage: data.usage || null,
      }
    } catch (err) {
      if (attempt < maxRetries && err.message.includes('Failed to fetch')) {
        const delay = baseDelay * Math.pow(2, attempt)
        if (onRetry) onRetry(attempt + 1, delay, 'network')
        await sleep(delay)
        continue
      }
      if (attempt === maxRetries) {
        throw err
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export { MODEL_MAP }
