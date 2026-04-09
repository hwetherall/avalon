import demvalRaw from '../../examples/avv-dv.md?raw'
import marketResearchRaw from '../../examples/avv-mr.md?raw'
import competitorAnalysisRaw from '../../examples/avv-ca.md?raw'
import contextRaw from '../../example-context.md?raw'

function parseContext(raw) {
  const sections = {
    question: '',
    success: '',
    audience: '',
    background: '',
    instructions: '',
  }

  const markers = [
    { key: 'question', heading: '## Question we are trying to solve' },
    { key: 'success', heading: '## How do you measure success' },
    { key: 'audience', heading: '## Who will this analysis be presented to' },
    { key: 'background', heading: '## Anything else we should know before starting the analysis' },
    { key: 'instructions', heading: '## Project Instructions' },
  ]

  const lines = raw.split('\n')

  for (let i = 0; i < markers.length; i++) {
    const { key, heading } = markers[i]
    const startIdx = lines.findIndex(l => l.startsWith(heading))
    if (startIdx === -1) continue

    const nextHeadingIdx = markers
      .slice(i + 1)
      .reduce((found, m) => {
        const idx = lines.findIndex((l, j) => j > startIdx && l.startsWith(m.heading))
        return idx !== -1 && (found === -1 || idx < found) ? idx : found
      }, -1)

    const end = nextHeadingIdx !== -1 ? nextHeadingIdx : lines.length
    const body = lines.slice(startIdx + 1, end).join('\n').trim()
    sections[key] = body
  }

  return sections
}

export const PRELOAD_CHAPTERS = {
  demval: demvalRaw,
  marketResearch: marketResearchRaw,
  competitorAnalysis: competitorAnalysisRaw,
}

export const PRELOAD_CONTEXT = parseContext(contextRaw)
