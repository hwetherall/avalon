import { useState } from 'react'
import { AGENT_META } from '../pipeline/agents.js'
import MarkdownRenderer from './MarkdownRenderer.jsx'

const STATUS_STYLES = {
  waiting: { dot: 'bg-gray-500', label: 'Waiting', textColor: 'text-gray-500' },
  running: { dot: 'pulse-dot', label: 'Running', textColor: 'text-amber-400' },
  complete: { dot: 'bg-emerald-400', label: 'Complete', textColor: 'text-emerald-400' },
  error: { dot: 'bg-red-400', label: 'Error', textColor: 'text-red-400' },
}

export default function StepCard({ stepId, state }) {
  const [expanded, setExpanded] = useState(false)
  const meta = AGENT_META[stepId]
  const status = state?.status || 'waiting'
  const style = STATUS_STYLES[status]

  const elapsed = state?.timestamp && state?.startTime
    ? ((state.timestamp - state.startTime) / 1000).toFixed(1)
    : null

  return (
    <div className={`step-node ${status}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
            <h4 className="text-sm font-semibold text-gray-200 truncate">{meta.name}</h4>
          </div>
          <p className="text-xs text-gray-500 mb-1">{meta.role}</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-700 text-gray-400 font-mono">
              {meta.model}
            </span>
            <span className={`text-[10px] font-medium ${style.textColor}`}>{style.label}</span>
            {elapsed && status === 'complete' && (
              <span className="text-[10px] text-gray-500 font-mono">{elapsed}s</span>
            )}
          </div>
        </div>

        {(status === 'complete' || status === 'error') && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0 mt-1"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </div>

      {status === 'running' && (
        <p className="text-xs text-gray-500 mt-2 italic">{meta.description}</p>
      )}

      {status === 'error' && state?.error && (
        <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-mono">
          {state.error}
        </div>
      )}

      {expanded && status === 'complete' && state?.output && (
        <div className="mt-3 pt-3 border-t border-surface-600 max-h-96 overflow-y-auto">
          <div className="passport-section text-xs">
            <MarkdownRenderer content={state.output} />
          </div>
        </div>
      )}
    </div>
  )
}
