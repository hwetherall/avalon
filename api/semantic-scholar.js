export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { query, limit = 5 } = req.body

  if (!query) {
    return res.status(400).json({ error: 'query is required' })
  }

  const params = new URLSearchParams({
    query,
    limit: String(limit),
    fields: 'paperId,title,abstract,year,citationCount,url,authors',
  })

  try {
    const upstream = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?${params}`,
      { headers: { 'Accept': 'application/json' } },
    )

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: `Semantic Scholar API error: ${upstream.status}`,
      })
    }

    const data = await upstream.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(502).json({
      error: 'Failed to reach Semantic Scholar',
      details: err.message,
    })
  }
}
