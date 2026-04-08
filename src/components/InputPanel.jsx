import { useState, useRef } from 'react'

const CHAPTERS = [
  { key: 'demval', label: 'Demand Validation', placeholder: 'Paste Demand Validation chapter markdown here...' },
  { key: 'marketResearch', label: 'Market Research', placeholder: 'Paste Market Research chapter markdown here...' },
  { key: 'competitorAnalysis', label: 'Competitor Analysis', placeholder: 'Paste Competitor Analysis chapter markdown here...' },
]

const MIN_LENGTH = 500
const MAX_TOTAL = 500000

export default function InputPanel({ onSubmit, disabled }) {
  const [chapters, setChapters] = useState({ demval: '', marketResearch: '', competitorAnalysis: '' })
  const [userContext, setUserContext] = useState('')
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

  const validate = () => {
    const newErrors = {}
    for (const { key, label } of CHAPTERS) {
      if (!chapters[key].trim()) {
        newErrors[key] = `${label} is required`
      } else if (chapters[key].trim().length < MIN_LENGTH) {
        newErrors[key] = `${label} must be at least ${MIN_LENGTH} characters`
      }
    }

    const totalLen = Object.values(chapters).join('').length + userContext.length
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
      userContext: userContext.trim() || null,
    })
  }

  const allFilled = CHAPTERS.every(({ key }) => chapters[key].trim().length >= MIN_LENGTH)

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-100 font-mono tracking-tight">AVALON</h1>
        <p className="text-gray-400 mt-2 text-sm">Adversarial Synthesis Engine — Opportunity Validation Bundle</p>
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
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Additional Context <span className="text-gray-500">(optional)</span>
        </label>
        <textarea
          className="w-full h-24 bg-surface-800 border border-surface-600 rounded-lg p-3 text-sm text-gray-200 font-mono resize-y placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors"
          placeholder="Any additional context for the synthesis (e.g., specific focus areas, constraints, client preferences)..."
          value={userContext}
          onChange={e => setUserContext(e.target.value)}
          disabled={disabled}
        />
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
