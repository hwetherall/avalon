export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'TAVILY_API_KEY not configured' })
  }

  const { queries, max_results = 3, search_depth = 'basic' } = req.body

  const results = await Promise.allSettled(
    queries.map(query =>
      fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          max_results,
          search_depth,
          include_answer: false,
          include_raw_content: false,
        }),
      }).then(r => r.json())
    )
  )

  const output = results.map((r, i) => ({
    query: queries[i],
    status: r.status,
    results: r.status === 'fulfilled' ? r.value.results || [] : [],
    error: r.status === 'rejected' ? r.reason?.message : null,
  }))

  res.status(200).json({ searches: output })
}
