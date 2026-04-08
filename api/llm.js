export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' })
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://avalon.innovera.com',
        'X-Title': 'Avalon',
      },
      body: JSON.stringify(req.body),
    })

    if (!response.ok) {
      const errorData = await response.text()
      return res.status(response.status).json({
        error: `OpenRouter API error: ${response.status}`,
        details: errorData,
      })
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to reach OpenRouter', details: err.message })
  }
}
