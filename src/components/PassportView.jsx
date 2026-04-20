import { useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer.jsx'
import ModeLauncher from './ModeLauncher.jsx'

export default function PassportView({ passport, onReset, onLaunchMode }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(passport)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = passport
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([passport], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `avalon-passport-${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-100">Information Passport</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-surface-700 border border-surface-600 text-gray-300 hover:bg-surface-600 hover:text-gray-100 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Markdown'}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-surface-700 border border-surface-600 text-gray-300 hover:bg-surface-600 hover:text-gray-100 transition-colors"
          >
            Download .md
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-accent/20 border border-accent/30 text-accent-light hover:bg-accent/30 transition-colors"
          >
            Run Again
          </button>
        </div>
      </div>

      <div className="bg-surface-800 border border-surface-600 rounded-lg p-6 md:p-8 passport-section">
        <MarkdownRenderer content={passport} />
      </div>

      <ModeLauncher passport={passport} onLaunch={onLaunchMode} />
    </div>
  )
}
