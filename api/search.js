export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'TAVILY_API_KEY not configured' })
  }

  const { query, max_results = 3, search_depth = 'basic' } = req.body

  try {
    const response = await fetch('https://api.tavily.com/search', {
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
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach Tavily', details: err.message })
  }
}
