import { useState } from 'react'
import StepCard from './StepCard.jsx'
import MarkdownRenderer from './MarkdownRenderer.jsx'
import { PRIMATE_STEPS } from '../pipeline/primateOrchestrator.js'

const PRIMATE_GROUPS = [
  { id: 10, label: 'Research Planning', description: 'Smart Planner generates per-track research plans from the Avalon passport' },
  { id: 11, label: 'Research Tracks', description: '6 parallel research tracks — web search, academic papers, and deep dives' },
  { id: 12, label: 'Evidence Synthesis', description: 'Raw research synthesized into structured evidence packages' },
  { id: 13, label: 'Kill Signal Assessment', description: 'Cross-track evaluation of kill signals from the Avalon passport' },
]

export default function PrimateView({ stepStates, primateResults, onReset }) {
  const [expandedTrack, setExpandedTrack] = useState(null)
  const [showKillDetails, setShowKillDetails] = useState(false)

  const completedCount = PRIMATE_STEPS.filter(s => stepStates[s.id]?.status === 'complete').length
  const totalSteps = PRIMATE_STEPS.length
  const progress = (completedCount / totalSteps) * 100
  const isComplete = completedCount === totalSteps

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100 font-mono tracking-tight">PRIMATE</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isComplete
            ? 'Deep research complete — evidence packages ready'
            : 'Product & Technology deep research in progress...'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-200">Research Progress</h2>
          <span className="text-sm text-gray-400 font-mono">{completedCount}/{totalSteps} steps</span>
        </div>
        <div className="h-1 bg-surface-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step groups */}
      <div className="space-y-8">
        {PRIMATE_GROUPS.map(group => {
          const groupSteps = PRIMATE_STEPS.filter(s => s.group === group.id)
          if (groupSteps.length === 0) return null

          const anyStarted = groupSteps.some(s => {
            const state = stepStates[s.id]
            return state && state.status !== 'waiting'
          })
          if (!anyStarted && group.id > 10) return null

          return (
            <div key={group.id}>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-300">{group.label}</h3>
                <p className="text-xs text-gray-500">{group.description}</p>
              </div>

              {group.id === 11 ? (
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {groupSteps.map(step => (
                    <StepCard key={step.id} stepId={step.id} state={stepStates[step.id]} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-1">
                  {groupSteps.map(step => (
                    <StepCard key={step.id} stepId={step.id} state={stepStates[step.id]} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Results section — shown when complete */}
      {isComplete && primateResults && (
        <div className="mt-10 border-t border-surface-600 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-100">Evidence Packages</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownloadAll(primateResults)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-surface-700 border border-surface-600 text-gray-300 hover:bg-surface-600 hover:text-gray-100 transition-colors"
              >
                Download All
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-accent/20 border border-accent/30 text-accent-light hover:bg-accent/30 transition-colors"
              >
                Return to Passport
              </button>
            </div>
          </div>

          {/* Track evidence cards */}
          <div className="space-y-4">
            {(primateResults.trackSyntheses || []).map(track => (
              <TrackEvidenceCard
                key={track.track_id}
                track={track}
                expanded={expandedTrack === track.track_id}
                onToggle={() => setExpandedTrack(
                  expandedTrack === track.track_id ? null : track.track_id
                )}
              />
            ))}
          </div>

          {/* Kill signal assessment */}
          {primateResults.killSignalAssessment && (
            <div className="mt-8">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowKillDetails(!showKillDetails)}
              >
                <h3 className="text-lg font-semibold text-gray-200">Kill Signal Assessment</h3>
                <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  {showKillDetails ? 'Collapse' : 'Expand'}
                </button>
              </div>

              <KillSignalSummary
                assessment={primateResults.killSignalAssessment}
                showDetails={showKillDetails}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TrackEvidenceCard({ track, expanded, onToggle }) {
  const findingCount = track.findings?.length || 0
  const gapCount = track.evidence_gaps?.length || 0
  const sourceCount = track.sources_consulted || 0

  const killStatuses = (track.kill_signal_evidence || []).map(ks => ks.status)
  const hasWarning = killStatuses.includes('warning') || killStatuses.includes('triggered')

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-700/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${hasWarning ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <div>
            <h4 className="text-sm font-semibold text-gray-200">{track.track_id}: {track.track_name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {findingCount} findings, {sourceCount} sources, {gapCount} gaps
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            track.relevance === 'High' ? 'bg-emerald-500/20 text-emerald-300' :
            track.relevance === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {track.relevance || 'N/A'}
          </span>
          <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-surface-600 p-4 max-h-[600px] overflow-y-auto">
          {/* Findings */}
          {track.findings?.length > 0 && (
            <div className="mb-4">
              <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Key Findings</h5>
              <div className="space-y-3">
                {track.findings.map(f => (
                  <div key={f.id} className="p-3 bg-surface-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">{f.id}</span>
                      <span className="text-sm font-medium text-gray-200">{f.title}</span>
                      <EvidenceBadge weight={f.evidence_weight} />
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{f.content}</p>
                    {f.sources?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {f.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-violet-400 hover:text-violet-300 underline"
                          >
                            {src.name || src.url}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priority question responses */}
          {track.priority_question_responses?.length > 0 && (
            <div className="mb-4">
              <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Priority Question Responses</h5>
              <div className="space-y-2">
                {track.priority_question_responses.map((pq, i) => (
                  <div key={i} className="p-3 bg-surface-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">{pq.question_id}</span>
                      <EvidenceBadge weight={pq.evidence_weight} />
                    </div>
                    <p className="text-xs text-gray-300 font-medium mb-1">{pq.question}</p>
                    <p className="text-xs text-gray-400">{pq.assessment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence gaps */}
          {track.evidence_gaps?.length > 0 && (
            <div className="mb-4">
              <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Evidence Gaps</h5>
              <div className="space-y-2">
                {track.evidence_gaps.map(g => (
                  <div key={g.id} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-300 font-medium">{g.id}: {g.description}</p>
                    {g.suggested_resolution && (
                      <p className="text-xs text-gray-500 mt-1">{g.suggested_resolution}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kill signal evidence */}
          {track.kill_signal_evidence?.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Kill Signal Evidence</h5>
              <div className="space-y-2">
                {track.kill_signal_evidence.map((ks, i) => (
                  <div key={i} className={`p-3 rounded-lg ${
                    ks.status === 'triggered' ? 'bg-red-500/10 border border-red-500/20' :
                    ks.status === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
                    'bg-surface-700/50'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <KillStatusBadge status={ks.status} />
                      <span className="text-xs text-gray-300 font-medium">{ks.signal}</span>
                    </div>
                    <p className="text-xs text-gray-400">{ks.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function KillSignalSummary({ assessment, showDetails }) {
  const summary = assessment.summary || []

  return (
    <div className="mt-3">
      {/* Summary table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-surface-600">
          <thead className="bg-surface-700">
            <tr>
              <th className="px-3 py-2 text-left text-gray-300 font-medium border-b border-surface-600">Kill Signal</th>
              <th className="px-3 py-2 text-left text-gray-300 font-medium border-b border-surface-600">Status</th>
              <th className="px-3 py-2 text-left text-gray-300 font-medium border-b border-surface-600">Evidence</th>
              <th className="px-3 py-2 text-left text-gray-300 font-medium border-b border-surface-600">Primary Track</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((ks, i) => (
              <tr key={i}>
                <td className="px-3 py-2 text-gray-400 border-b border-surface-700 text-xs">{ks.signal}</td>
                <td className="px-3 py-2 border-b border-surface-700">
                  <KillStatusBadge status={ks.status} />
                </td>
                <td className="px-3 py-2 border-b border-surface-700">
                  <EvidenceBadge weight={ks.evidence_weight} />
                </td>
                <td className="px-3 py-2 text-gray-400 border-b border-surface-700 text-xs font-mono">{ks.primary_track}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed assessments */}
      {showDetails && assessment.detailed_assessments?.length > 0 && (
        <div className="mt-4 space-y-4">
          {assessment.detailed_assessments.map((da, i) => (
            <div key={i} className={`p-4 rounded-lg ${
              da.status === 'triggered' ? 'bg-red-500/10 border border-red-500/20' :
              da.status === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
              'bg-surface-800 border border-surface-600'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <KillStatusBadge status={da.status} />
                <span className="text-sm font-medium text-gray-200">{da.signal}</span>
              </div>

              {da.track_evidence?.map((te, j) => (
                <div key={j} className="mb-2">
                  <span className="text-xs font-mono text-gray-500">{te.track_id}:</span>
                  <p className="text-xs text-gray-400 ml-4">{te.assessment}</p>
                </div>
              ))}

              {da.cross_track_synthesis && (
                <div className="mt-2 pt-2 border-t border-surface-600">
                  <p className="text-xs text-gray-300">{da.cross_track_synthesis}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EvidenceBadge({ weight }) {
  const styles = {
    strong: 'bg-emerald-500/20 text-emerald-300',
    moderate: 'bg-blue-500/20 text-blue-300',
    thin: 'bg-amber-500/20 text-amber-300',
    absent: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${styles[weight] || styles.absent}`}>
      {weight || 'N/A'}
    </span>
  )
}

function KillStatusBadge({ status }) {
  const styles = {
    not_triggered: { bg: 'bg-emerald-500/20 text-emerald-300', label: 'Clear' },
    warning: { bg: 'bg-amber-500/20 text-amber-300', label: 'Warning' },
    triggered: { bg: 'bg-red-500/20 text-red-300', label: 'Triggered' },
    insufficient_evidence: { bg: 'bg-gray-500/20 text-gray-400', label: 'Insufficient' },
  }

  const s = styles[status] || styles.insufficient_evidence

  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${s.bg}`}>
      {s.label}
    </span>
  )
}

function handleDownloadAll(primateResults) {
  const parts = []

  parts.push('# Primate Research Output\n\n')

  if (primateResults.plan) {
    parts.push('## Research Plan\n\n')
    parts.push(JSON.stringify(primateResults.plan, null, 2))
    parts.push('\n\n---\n\n')
  }

  for (const track of (primateResults.trackSyntheses || [])) {
    parts.push(`## ${track.track_id}: ${track.track_name}\n\n`)
    parts.push(JSON.stringify(track, null, 2))
    parts.push('\n\n---\n\n')
  }

  if (primateResults.killSignalAssessment) {
    parts.push('## Kill Signal Assessment\n\n')
    parts.push(JSON.stringify(primateResults.killSignalAssessment, null, 2))
  }

  const blob = new Blob([parts.join('')], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `primate-output-${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  URL.revokeObjectURL(url)
}
