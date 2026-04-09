import { useState, useRef } from 'react'

const CHAPTERS = [
  { key: 'demval', label: 'Demand Validation', placeholder: 'Paste Demand Validation chapter markdown here...' },
  { key: 'marketResearch', label: 'Market Research', placeholder: 'Paste Market Research chapter markdown here...' },
  { key: 'competitorAnalysis', label: 'Competitor Analysis', placeholder: 'Paste Competitor Analysis chapter markdown here...' },
]

const CONTEXT_FIELDS = [
  {
    key: 'question',
    label: 'Question we are trying to solve',
    placeholder: 'What is the core strategic question? Include key supporting questions and constraints...',
    rows: 5,
  },
  {
    key: 'success',
    label: 'How do you measure success',
    placeholder: 'Primary and secondary success criteria, trade-off guidance, target metrics...',
    rows: 4,
  },
  {
    key: 'audience',
    label: 'Who will this analysis be presented to',
    placeholder: 'e.g., C-Levels and Business Managers, Future Business Division at Samsung Electronics',
    rows: 2,
  },
  {
    key: 'background',
    label: 'Anything else we should know before starting the analysis?',
    placeholder: 'Additional background, internal capabilities, client-stated assumptions, key context...',
    rows: 5,
  },
  {
    key: 'instructions',
    label: 'Project Instructions',
    placeholder: 'Prioritized questions, blocking questions that must be answered, specific focus areas...',
    rows: 5,
  },
]

const MIN_LENGTH = 500
const MAX_TOTAL = 500000

export default function InputPanel({ onSubmit, onDemo, onPreload, disabled }) {
  const [chapters, setChapters] = useState({ demval: '', marketResearch: '', competitorAnalysis: '' })
  const [contextFields, setContextFields] = useState({ question: '', success: '', audience: '', background: '', instructions: '' })
  const [contextExpanded, setContextExpanded] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRefs = useRef({})

  const stripHtml = (text) => {
    if (text.trimStart().startsWith('<!DOCTYPE') || text.trimStart().startsWith('<html')) {
      return text.replace(/<[^>]*>/g, '').trim()
    }
    return text
  }

  const updateChapter = (key, value) => {
    const cleaned = stripHtml(value)
    setChapters(prev => ({ ...prev, [key]: cleaned }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }))
  }

  const handleFile = async (key, file) => {
    if (!file) return
    const text = await file.text()
    updateChapter(key, text)
  }

  const updateContextField = (key, value) => {
    setContextFields(prev => ({ ...prev, [key]: value }))
  }

  const buildUserContext = () => {
    const sections = []
    if (contextFields.question.trim()) sections.push(`## Question we are trying to solve:\n\n${contextFields.question.trim()}`)
    if (contextFields.success.trim()) sections.push(`## How do you measure success:\n\n${contextFields.success.trim()}`)
    if (contextFields.audience.trim()) sections.push(`## Who will this analysis be presented to:\n\n${contextFields.audience.trim()}`)
    if (contextFields.background.trim()) sections.push(`## Anything else we should know before starting the analysis?\n\n${contextFields.background.trim()}`)
    if (contextFields.instructions.trim()) sections.push(`## Project Instructions:\n\n${contextFields.instructions.trim()}`)
    return sections.length > 0 ? sections.join('\n\n') : null
  }

  const validate = () => {
    const newErrors = {}
    for (const { key, label } of CHAPTERS) {
      if (!chapters[key].trim()) {
        newErrors[key] = `${label} is required`
      } else if (chapters[key].trim().length < MIN_LENGTH) {
        newErrors[key] = `${label} must be at least ${MIN_LENGTH} characters`
      }
    }

    const contextStr = buildUserContext() || ''
    const totalLen = Object.values(chapters).join('').length + contextStr.length
    if (totalLen > MAX_TOTAL) {
      newErrors._global = `Combined input exceeds ${MAX_TOTAL.toLocaleString()} characters. Outputs may be truncated.`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).filter(k => k !== '_global').length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({
      demval: chapters.demval,
      marketResearch: chapters.marketResearch,
      competitorAnalysis: chapters.competitorAnalysis,
      userContext: buildUserContext(),
    })
  }

  const handlePreload = async () => {
    const { PRELOAD_CHAPTERS, PRELOAD_CONTEXT } = await import('../demo/preloadData.js')
    setChapters({
      demval: PRELOAD_CHAPTERS.demval,
      marketResearch: PRELOAD_CHAPTERS.marketResearch,
      competitorAnalysis: PRELOAD_CHAPTERS.competitorAnalysis,
    })
    setContextFields({
      question: PRELOAD_CONTEXT.question,
      success: PRELOAD_CONTEXT.success,
      audience: PRELOAD_CONTEXT.audience,
      background: PRELOAD_CONTEXT.background,
      instructions: PRELOAD_CONTEXT.instructions,
    })
    setContextExpanded(true)
    setErrors({})
    if (onPreload) onPreload()
  }

  const allFilled = CHAPTERS.every(({ key }) => chapters[key].trim().length >= MIN_LENGTH)

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-100 font-mono tracking-tight">AVALON</h1>
        <p className="text-gray-400 mt-2 text-sm">Adversarial Synthesis Engine — Opportunity Validation Bundle</p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            onClick={handlePreload}
            disabled={disabled}
            className="px-4 py-1.5 text-xs font-medium rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            PreLoad — Samsung LEO Case Inputs
          </button>
          <button
            onClick={onDemo}
            disabled={disabled}
            className="px-4 py-1.5 text-xs font-medium rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Demo — Samsung LEO Satellite Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {CHAPTERS.map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">{label}</label>
              <span className="text-xs text-gray-500 font-mono">
                {chapters[key].length > 0 ? `${chapters[key].length.toLocaleString()} chars` : ''}
              </span>
            </div>
            <textarea
              className={`flex-1 min-h-[280px] bg-surface-800 border rounded-lg p-3 text-sm text-gray-200 font-mono resize-y placeholder-gray-600 focus:outline-none focus:ring-1 transition-colors ${
                errors[key] ? 'border-red-500/60 focus:ring-red-500/40' : 'border-surface-600 focus:ring-accent/40 focus:border-accent/40'
              }`}
              placeholder={placeholder}
              value={chapters[key]}
              onChange={e => updateChapter(key, e.target.value)}
              disabled={disabled}
            />
            <div className="flex items-center justify-between mt-2">
              <input
                ref={el => fileRefs.current[key] = el}
                type="file"
                accept=".md,.txt,.markdown"
                className="hidden"
                onChange={e => handleFile(key, e.target.files[0])}
              />
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => fileRefs.current[key]?.click()}
                disabled={disabled}
              >
                or upload .md file
              </button>
              {errors[key] && <span className="text-xs text-red-400">{errors[key]}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setContextExpanded(!contextExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-gray-100 transition-colors mb-3"
        >
          <span className={`text-xs transition-transform ${contextExpanded ? 'rotate-90' : ''}`}>&#9654;</span>
          Additional Context
          <span className="text-gray-500 font-normal">(optional)</span>
          {Object.values(contextFields).some(v => v.trim()) && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent-light font-mono">
              {Object.values(contextFields).filter(v => v.trim()).length}/{CONTEXT_FIELDS.length} filled
            </span>
          )}
        </button>

        {contextExpanded && (
          <div className="space-y-4 pl-4 border-l border-surface-600">
            {CONTEXT_FIELDS.map(({ key, label, placeholder, rows }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
                <textarea
                  className="w-full bg-surface-800 border border-surface-600 rounded-lg p-3 text-sm text-gray-200 font-mono resize-y placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors"
                  rows={rows}
                  placeholder={placeholder}
                  value={contextFields[key]}
                  onChange={e => updateContextField(key, e.target.value)}
                  disabled={disabled}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {errors._global && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
          {errors._global}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={disabled || !allFilled}
          className={`px-8 py-3 rounded-lg font-semibold text-sm tracking-wide transition-all ${
            disabled || !allFilled
              ? 'bg-surface-700 text-gray-500 cursor-not-allowed'
              : 'bg-accent hover:bg-accent-light text-white shadow-lg shadow-accent/20 hover:shadow-accent/30'
          }`}
        >
          {disabled ? 'Pipeline Running...' : 'Generate Passport'}
        </button>
      </div>
    </div>
  )
}
