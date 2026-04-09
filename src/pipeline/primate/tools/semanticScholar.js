/**
 * Semantic Scholar API client (via /api/semantic-scholar proxy).
 * Free tier: 100 requests per 5 minutes. We space queries with 3s intervals.
 */

const QUERY_DELAY_MS = 3000

async function fetchWithRetry(query, limit, signal, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch('/api/semantic-scholar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit }),
        signal,
      })

      if (response.status === 429) {
        if (attempt < retries) {
          await sleep(5000)
          continue
        }
        throw new Error('Semantic Scholar rate limit exceeded')
      }

      if (!response.ok) {
        if (attempt < retries) {
          await sleep(3000)
          continue
        }
        throw new Error(`Semantic Scholar API error: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      if (err.name === 'AbortError') throw err
      if (attempt === retries) throw err
      await sleep(3000)
    }
  }
}

/**
 * Search for papers matching a query.
 * @param {string} query - Search query
 * @param {object} options
 * @param {number} [options.limit=5] - Max results
 * @param {AbortSignal} [options.signal] - Abort signal
 * @returns {Array<{paperId, title, abstract, year, citationCount, url, authors}>}
 */
export async function searchPapers(query, { limit = 5, signal } = {}) {
  const data = await fetchWithRetry(query, limit, signal)

  if (!data.data || !Array.isArray(data.data)) return []

  return data.data.map(paper => ({
    paperId: paper.paperId,
    title: paper.title || 'Untitled',
    abstract: paper.abstract || '',
    year: paper.year,
    citationCount: paper.citationCount || 0,
    url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
    authors: (paper.authors || []).map(a => a.name).join(', '),
  }))
}

/**
 * Run multiple Semantic Scholar queries with rate-limit spacing.
 * @param {string[]} queries
 * @param {object} options
 * @param {AbortSignal} [options.signal]
 * @returns {Array<{query, results}>}
 */
export async function searchBatch(queries, { signal } = {}) {
  const results = []

  for (let i = 0; i < queries.length; i++) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    try {
      const papers = await searchPapers(queries[i], { signal })
      results.push({ query: queries[i], results: papers, error: null })
    } catch (err) {
      if (err.name === 'AbortError') throw err
      results.push({ query: queries[i], results: [], error: err.message })
    }

    if (i < queries.length - 1) {
      await sleep(QUERY_DELAY_MS)
    }
  }

  return results
}

/**
 * Format Semantic Scholar results for LLM consumption.
 */
export function formatAcademicResults(batchResults) {
  if (!batchResults || batchResults.length === 0) return 'No academic search results.'

  return batchResults.map(batch => {
    const papers = batch.results || []
    if (papers.length === 0) {
      return `### Academic Query: "${batch.query}"\n  No papers found.${batch.error ? ` Error: ${batch.error}` : ''}`
    }

    const paperBlock = papers
      .map((p, i) => {
        const abstract = p.abstract
          ? p.abstract.substring(0, 300) + (p.abstract.length > 300 ? '...' : '')
          : 'No abstract available'
        return `  [${i + 1}] ${p.title} (${p.year || 'n.d.'}, ${p.citationCount} citations)
      Authors: ${p.authors || 'Unknown'}
      URL: ${p.url}
      ${abstract}`
      })
      .join('\n\n')

    return `### Academic Query: "${batch.query}"\n${paperBlock}`
  }).join('\n\n---\n\n')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
