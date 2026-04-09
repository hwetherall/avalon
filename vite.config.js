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
          // ── /api/llm — OpenRouter proxy ──
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

          // ── /api/semantic-scholar — Semantic Scholar proxy ──
          server.middlewares.use('/api/semantic-scholar', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += chunk
            }

            try {
              const parsed = JSON.parse(body)
              const { query, limit = 5 } = parsed

              if (!query) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'query is required' }))
                return
              }

              const params = new URLSearchParams({
                query,
                limit: String(limit),
                fields: 'paperId,title,abstract,year,citationCount,url,authors',
              })

              const upstream = await fetch(
                `https://api.semanticscholar.org/graph/v1/paper/search?${params}`,
                { headers: { 'Accept': 'application/json' } },
              )

              const data = await upstream.text()
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = upstream.status
              res.end(data)
            } catch (err) {
              res.statusCode = 502
              res.end(JSON.stringify({ error: 'Failed to reach Semantic Scholar', details: err.message }))
            }
          })

          // ── /api/search-batch — Parallel multi-query Tavily proxy ──
          // (registered before /api/search to avoid prefix-match conflicts)
          server.middlewares.use('/api/search-batch', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            const tavilyKey = env.TAVILY_API_KEY
            if (!tavilyKey) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'TAVILY_API_KEY not set in .env.local' }))
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += chunk
            }

            try {
              const parsed = JSON.parse(body)
              const { queries, max_results = 3, search_depth = 'basic' } = parsed

              const results = await Promise.allSettled(
                queries.map(query =>
                  fetch('https://api.tavily.com/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      api_key: tavilyKey,
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

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ searches: output }))
            } catch (err) {
              res.statusCode = 502
              res.end(JSON.stringify({ error: 'Failed to reach Tavily', details: err.message }))
            }
          })

          // ── /api/search — Single Tavily search proxy ──
          server.middlewares.use('/api/search', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            const tavilyKey = env.TAVILY_API_KEY
            if (!tavilyKey) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'TAVILY_API_KEY not set in .env.local' }))
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += chunk
            }

            try {
              const parsed = JSON.parse(body)
              const upstream = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  api_key: tavilyKey,
                  query: parsed.query,
                  max_results: parsed.max_results || 3,
                  search_depth: parsed.search_depth || 'basic',
                  include_answer: false,
                  include_raw_content: false,
                }),
              })

              const data = await upstream.text()
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = upstream.status
              res.end(data)
            } catch (err) {
              res.statusCode = 502
              res.end(JSON.stringify({ error: 'Failed to reach Tavily', details: err.message }))
            }
          })
        },
      },
    ],
  }
})
