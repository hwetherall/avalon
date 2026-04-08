import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'api-proxy',
        configureServer(server) {
          server.middlewares.use('/api/llm', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            const apiKey = env.OPENROUTER_API_KEY
            if (!apiKey) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY not set in .env.local' }))
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += chunk
            }

            try {
              const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                  'HTTP-Referer': 'https://avalon.innovera.com',
                  'X-Title': 'Avalon',
                },
                body,
              })

              const data = await upstream.text()
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = upstream.status
              res.end(data)
            } catch (err) {
              res.statusCode = 502
              res.end(JSON.stringify({ error: 'Failed to reach OpenRouter', details: err.message }))
            }
          })
        },
      },
    ],
  }
})
