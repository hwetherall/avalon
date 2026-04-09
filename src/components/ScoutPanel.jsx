import { useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer.jsx'

const PHASE_LABELS = {
  queued: 'Queued',
  starting: 'Starting...',
  planning: 'Planning queries',
  searching: 'Searching',
  deep_dive: 'Deep dive',
  synthesizing: 'Synthesizing',
  complete: 'Complete',
  error: 'Failed',
}

const PHASE_COLORS = {
  queued: 'text-gray-500',
  starting: 'text-amber-400',
  planning: 'text-amber-400',
  searching: 'text-blue-400',
  deep_dive: 'text-purple-400',
  synthesizing: 'text-cyan-400',
  complete: 'text-emerald-400',
  error: 'text-red-400',
}

const DOT_STYLES = {
  queued: 'bg-gray-500',
  starting: 'pulse-dot',
  planning: 'pulse-dot',
  searching: 'pulse-dot',
  deep_dive: 'pulse-dot',
  synthesizing: 'pulse-dot',
  complete: 'bg-emerald-400',
  error: 'bg-red-400',
}

export default function ScoutPanel({ scoutStates, onRerunScout, rerunningScoutPathId }) {
  if (!scoutStates || Object.keys(scoutStates).length === 0) {
    return null
  }

  const entries = Object.entries(scoutStates).sort(([a], [b]) => {
    const numA = parseInt(a.replace('P', ''))
    const numB = parseInt(b.replace('P', ''))
    return numA - numB
  })

  const completedCount = entries.filter(([, s]) => s.status === 'complete').length
  const totalCount = entries.length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400 font-mono">
          {completedCount}/{totalCount} paths scouted
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {entries.map(([pathId, state]) => (
          <ScoutCard
            key={pathId}
            pathId={pathId}
            state={state}
            onRerunScout={onRerunScout}
            rerunningScoutPathId={rerunningScoutPathId}
          />
        ))}
      </div>
    </div>
  )
}

function ScoutCard({ pathId, state, onRerunScout, rerunningScoutPathId }) {
  const [expanded, setExpanded] = useState(false)
  const phase = state.status === 'complete' ? 'complete'
    : state.status === 'error' ? 'error'
    : state.phase || 'queued'
  const phaseLabel = PHASE_LABELS[phase] || phase
  const phaseColor = PHASE_COLORS[phase] || 'text-gray-400'
  const dotStyle = DOT_STYLES[phase] || 'bg-gray-500'

  const isRunning = state.status === 'running'
  const isComplete = state.status === 'complete'
  const isError = state.status === 'error'

  return (
    <div className={`step-node ${isRunning ? 'running' : isComplete ? 'complete' : isError ? 'error' : 'waiting'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${dotStyle}`} />
            <h4 className="text-xs font-semibold text-gray-200 truncate">
              {pathId}: {state.pathName || 'Unknown'}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-medium ${phaseColor}`}>{phaseLabel}</span>
            {state.queriesRun > 0 && (
              <span className="text-[10px] text-gray-500 font-mono">
                {state.queriesRun} queries
              </span>
            )}
            {state.deepDive && (
              <span className="text-[10px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-300">
                deep dive
              </span>
            )}
          </div>
        </div>

        {(isComplete || isError) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0 mt-1"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </div>

      {isRunning && state.message && (
        <p className="text-[10px] text-gray-500 mt-1 italic">{state.message}</p>
      )}

      {isError && (
        <div className="mt-2 p-1.5 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-300 font-mono space-y-2">
          <p>{state.error || 'Scout did not return a field report (no error details).'}</p>
          {onRerunScout && (
            <button
              type="button"
              onClick={() => onRerunScout(pathId)}
              disabled={rerunningScoutPathId === pathId || isRunning}
              className="px-2 py-1 rounded text-[10px] font-medium bg-surface-700 border border-surface-500 text-gray-200 hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {rerunningScoutPathId === pathId ? 'Rerunning…' : 'Rerun scout'}
            </button>
          )}
        </div>
      )}

      {expanded && isComplete && state.fieldReport && (
        <div className="mt-2 pt-2 border-t border-surface-600 max-h-72 overflow-y-auto">
          <FieldReportPreview report={state.fieldReport} />
        </div>
      )}
    </div>
  )
}

function FieldReportPreview({ report }) {
  const WEIGHT_COLORS = {
    strong: 'text-emerald-400',
    moderate: 'text-amber-400',
    thin: 'text-orange-400',
    absent: 'text-red-400',
  }

  return (
    <div className="space-y-2 text-[10px]">
      <p className="text-gray-300">{report.executive_summary}</p>

      <div className="p-1.5 rounded bg-surface-700">
        <span className="text-gray-400 font-medium">Core Bet: </span>
        <span className={WEIGHT_COLORS[report.core_bet_assessment?.evidence_weight] || 'text-gray-400'}>
          [{report.core_bet_assessment?.evidence_weight}]
        </span>
        <span className="text-gray-300"> {report.core_bet_assessment?.finding}</span>
      </div>

      {report.investigation_findings?.map((f, i) => (
        <div key={i} className="p-1.5 rounded bg-surface-700">
          <div className="text-gray-400 font-medium mb-0.5">{f.question}</div>
          <span className={WEIGHT_COLORS[f.evidence_weight] || 'text-gray-400'}>
            [{f.evidence_weight}]
          </span>
          {f.supports_path === true && <span className="text-emerald-400"> supports</span>}
          {f.supports_path === false && <span className="text-red-400"> challenges</span>}
          {f.supports_path === null && <span className="text-gray-500"> ambiguous</span>}
          <span className="text-gray-300"> {f.finding}</span>
        </div>
      ))}

      {report.red_flags?.length > 0 && (
        <div className="p-1.5 rounded bg-red-500/10 border border-red-500/20">
          <span className="text-red-400 font-medium">Red Flags:</span>
          <ul className="list-disc list-inside text-red-300 mt-0.5">
            {report.red_flags.map((flag, i) => <li key={i}>{flag}</li>)}
          </ul>
        </div>
      )}

      {report.surprises?.length > 0 && (
        <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20">
          <span className="text-cyan-400 font-medium">Surprises:</span>
          <ul className="list-disc list-inside text-cyan-300 mt-0.5">
            {report.surprises.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
