import { useState, useRef, useMemo } from 'react'
import StepCard from './StepCard.jsx'
import { CELLARY_STEPS } from '../pipeline/cellaryOrchestrator.js'

const CELLARY_GROUPS = [
  { id: 20, label: 'Research Planning', description: 'Smart Vintner generates per-track research plans from the Avalon passport and the venture\'s validation + decision questions' },
  { id: 21, label: 'Research Tracks', description: '6 parallel wine-industry tracks — market sizing, client pain, pricing, adjacent markets, ops economics, tech & competitors' },
  { id: 22, label: 'Evidence Synthesis', description: 'Raw research synthesized into per-track evidence packages' },
  { id: 23, label: 'Dossier Assembly', description: 'FactBank answers validation questions; Decision Memo produces recommendations (Sonnet 4.6)' },
]

const CONFIDENCE_STYLES = {
  High:   'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Low:    'bg-red-500/20 text-red-300 border-red-500/40',
}

export default function CellaryView({ stepStates, cellaryResults, onReset }) {
  const [activeTab, setActiveTab] = useState('factbank')
  const [expandedMemoId, setExpandedMemoId] = useState(null)
  const [expandedTrack, setExpandedTrack] = useState(null)
  const [factBankFilter, setFactBankFilter] = useState('all')
  const factBankRowRefs = useRef({})

  const completedCount = CELLARY_STEPS.filter(s => stepStates[s.id]?.status === 'complete').length
  const totalSteps = CELLARY_STEPS.length
  const progress = (completedCount / totalSteps) * 100
  const isComplete = completedCount === totalSteps

  const dossier = cellaryResults?.dossier

  const scrollToFact = (factId) => {
    setActiveTab('factbank')
    setTimeout(() => {
      const node = factBankRowRefs.current[factId]
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' })
        node.classList.add('ring-2', 'ring-amber-400')
        setTimeout(() => node.classList.remove('ring-2', 'ring-amber-400'), 1500)
      }
    }, 50)
  }

  const filteredFactBank = useMemo(() => {
    const entries = dossier?.factbank || []
    if (factBankFilter === 'all') return entries
    return entries.filter(e => (e.confidence || '').toLowerCase() === factBankFilter)
  }, [dossier, factBankFilter])

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-amber-100 font-mono tracking-tight">CELLARY</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isComplete
            ? 'Decision dossier complete — FactBank and Decision Memo ready'
            : 'Wine & private-club decision dossier in progress...'}
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
            className="h-full bg-amber-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step groups */}
      <div className="space-y-8">
        {CELLARY_GROUPS.map(group => {
          const groupSteps = CELLARY_STEPS.filter(s => s.group === group.id)
          if (groupSteps.length === 0) return null

          const anyStarted = groupSteps.some(s => {
            const state = stepStates[s.id]
            return state && state.status !== 'waiting'
          })
          if (!anyStarted && group.id > 20) return null

          return (
            <div key={group.id}>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-300">{group.label}</h3>
                <p className="text-xs text-gray-500">{group.description}</p>
              </div>

              {group.id === 21 ? (
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

      {/* Results section */}
      {isComplete && cellaryResults && (
        <div className="mt-10 border-t border-surface-600 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-amber-100">Decision Dossier</h2>
              {dossier?.synthesis_notes && (
                <p className="text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">{dossier.synthesis_notes}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownloadAll(cellaryResults)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-surface-700 border border-surface-600 text-gray-300 hover:bg-surface-600 hover:text-gray-100 transition-colors"
              >
                Download Dossier (.md)
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-amber-600/20 border border-amber-600/40 text-amber-200 hover:bg-amber-600/30 transition-colors"
              >
                Return to Passport
              </button>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-2 border-b border-surface-600 mb-4">
            <TabButton active={activeTab === 'factbank'} onClick={() => setActiveTab('factbank')}>
              FactBank <span className="text-gray-500 ml-1">({dossier?.factbank?.length || 0})</span>
            </TabButton>
            <TabButton active={activeTab === 'memo'} onClick={() => setActiveTab('memo')}>
              Decision Memo <span className="text-gray-500 ml-1">({dossier?.decision_memo?.length || 0})</span>
            </TabButton>
            <TabButton active={activeTab === 'tracks'} onClick={() => setActiveTab('tracks')}>
              Tracks <span className="text-gray-500 ml-1">({cellaryResults.trackSyntheses?.length || 0})</span>
            </TabButton>
          </div>

          {/* FactBank tab */}
          {activeTab === 'factbank' && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className="text-gray-400">Filter by confidence:</span>
                {['all', 'high', 'medium', 'low'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setFactBankFilter(lvl)}
                    className={`px-2 py-1 rounded capitalize ${
                      factBankFilter === lvl
                        ? 'bg-amber-600/30 text-amber-200 border border-amber-600/40'
                        : 'bg-surface-700 text-gray-400 border border-surface-600 hover:bg-surface-600'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto rounded-lg border border-surface-600">
                <table className="min-w-full text-sm">
                  <thead className="bg-surface-700">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-300 font-medium border-b border-surface-600 w-16">ID</th>
                      <th className="px-3 py-2 text-left text-gray-300 font-medium border-b border-surface-600">Question</th>
                      <th className="px-3 py-2 text-left text-gray-300 font-medium border-b border-surface-600">Answer</th>
                      <th className="px-3 py-2 text-left text-gray-300 font-medium border-b border-surface-600 w-24">Confidence</th>
                      <th className="px-3 py-2 text-left text-gray-300 font-medium border-b border-surface-600 w-56">Sources</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFactBank.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-gray-500 text-xs">
                          No FactBank entries at this filter level.
                        </td>
                      </tr>
                    )}
                    {filteredFactBank.map(entry => (
                      <tr
                        key={entry.id}
                        ref={el => { if (el) factBankRowRefs.current[entry.id] = el }}
                        className="align-top border-b border-surface-700 transition-shadow"
                      >
                        <td className="px-3 py-2 text-xs font-mono text-gray-400">{entry.id}</td>
                        <td className="px-3 py-2 text-xs text-gray-300 max-w-[220px]">{entry.question}</td>
                        <td className="px-3 py-2 text-xs text-gray-300">
                          <p className="leading-relaxed">{entry.answer}</p>
                          {entry.gaps && (
                            <p className="mt-1 text-[11px] text-amber-300/80 italic">Gap: {entry.gaps}</p>
                          )}
                          {entry.contributing_tracks?.length > 0 && (
                            <p className="mt-1 text-[10px] text-gray-500 font-mono">
                              via {entry.contributing_tracks.join(', ')}
                            </p>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <ConfidencePill level={entry.confidence} />
                        </td>
                        <td className="px-3 py-2">
                          {entry.sources?.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {entry.sources.map((src, i) => (
                                <a
                                  key={i}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-amber-400 hover:text-amber-300 underline break-words"
                                  title={src.url}
                                >
                                  {truncate(src.name || src.url, 40)}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-500 italic">No sources cited</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Decision Memo tab */}
          {activeTab === 'memo' && (
            <div className="space-y-3">
              {(dossier?.decision_memo || []).length === 0 && (
                <div className="p-6 text-center text-gray-500 text-sm bg-surface-800 rounded-lg border border-surface-600">
                  Decision Memo is empty.
                </div>
              )}
              {(dossier?.decision_memo || []).map(entry => (
                <DecisionMemoCard
                  key={entry.id}
                  entry={entry}
                  expanded={expandedMemoId === entry.id}
                  onToggle={() => setExpandedMemoId(expandedMemoId === entry.id ? null : entry.id)}
                  onFactClick={scrollToFact}
                />
              ))}
            </div>
          )}

          {/* Tracks tab */}
          {activeTab === 'tracks' && (
            <div className="space-y-3">
              {(cellaryResults.trackSyntheses || []).map(track => (
                <TrackEvidenceCard
                  key={track.track_id}
                  track={track}
                  expanded={expandedTrack === track.track_id}
                  onToggle={() => setExpandedTrack(expandedTrack === track.track_id ? null : track.track_id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active
          ? 'border-amber-500 text-amber-200'
          : 'border-transparent text-gray-400 hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

function ConfidencePill({ level }) {
  const style = CONFIDENCE_STYLES[level] || 'bg-gray-500/20 text-gray-400 border-gray-500/40'
  return (
    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium border ${style}`}>
      {level || 'N/A'}
    </span>
  )
}

function DecisionMemoCard({ entry, expanded, onToggle, onFactClick }) {
  return (
    <div className="bg-surface-800 border border-surface-600 rounded-lg overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-surface-700/40 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          <span className="text-xs font-mono text-gray-500 mt-0.5">{entry.id}</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-100 mb-1">{entry.question}</h4>
            <p className="text-sm text-amber-100/90 leading-relaxed">{entry.recommendation}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ConfidencePill level={entry.confidence} />
            <span className="text-xs text-gray-500">{expanded ? '▾' : '▸'}</span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-surface-600 p-4 space-y-4 bg-surface-800/50">
          {entry.supporting_evidence?.length > 0 && (
            <MemoSection title="Supporting Evidence" accent="emerald">
              {entry.supporting_evidence.map((ev, i) => (
                <EvidenceRow key={i} evidence={ev} onFactClick={onFactClick} />
              ))}
            </MemoSection>
          )}

          {entry.counter_evidence?.length > 0 && (
            <MemoSection title="Counter Evidence" accent="red">
              {entry.counter_evidence.map((ev, i) => (
                <EvidenceRow key={i} evidence={ev} onFactClick={onFactClick} />
              ))}
            </MemoSection>
          )}

          {entry.assumptions?.length > 0 && (
            <MemoSection title="Key Assumptions" accent="blue">
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                {entry.assumptions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </MemoSection>
          )}

          {entry.what_would_change_our_mind && (
            <MemoSection title="What Would Change Our Mind" accent="amber">
              <p className="text-xs text-amber-100/90 leading-relaxed italic">
                {entry.what_would_change_our_mind}
              </p>
            </MemoSection>
          )}

          {entry.kill_signals?.length > 0 && (
            <MemoSection title="Kill Signals" accent="red">
              <ul className="list-disc list-inside text-xs text-red-200 space-y-1">
                {entry.kill_signals.map((ks, i) => <li key={i}>{ks}</li>)}
              </ul>
            </MemoSection>
          )}
        </div>
      )}
    </div>
  )
}

function MemoSection({ title, accent, children }) {
  const accentClass = {
    emerald: 'text-emerald-300',
    red:     'text-red-300',
    blue:    'text-blue-300',
    amber:   'text-amber-300',
  }[accent] || 'text-gray-300'

  return (
    <div>
      <h5 className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${accentClass}`}>{title}</h5>
      {children}
    </div>
  )
}

function EvidenceRow({ evidence, onFactClick }) {
  return (
    <div className="mb-2 last:mb-0">
      <p className="text-xs text-gray-300 leading-relaxed">{evidence.claim}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {(evidence.fact_refs || []).map(ref => (
          <button
            key={ref}
            onClick={(e) => { e.stopPropagation(); onFactClick(ref) }}
            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-600/15 text-amber-300 border border-amber-600/30 hover:bg-amber-600/25 transition-colors"
            title={`Jump to ${ref} in the FactBank`}
          >
            {ref}
          </button>
        ))}
        {(evidence.sources || []).map((src, i) => (
          <a
            key={`src-${i}`}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-[10px] text-gray-400 hover:text-gray-200 underline"
            title={src.url}
          >
            {truncate(src.name || src.url, 28)}
          </a>
        ))}
      </div>
    </div>
  )
}

function TrackEvidenceCard({ track, expanded, onToggle }) {
  const findingCount = track.findings?.length || 0
  const gapCount = track.evidence_gaps?.length || 0
  const sourceCount = track.sources_consulted || 0

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-700/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-gray-200">{track.track_id}: {track.track_name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {findingCount} findings, {sourceCount} sources, {gapCount} gaps
            </p>
          </div>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
          track.relevance === 'High' ? 'bg-emerald-500/20 text-emerald-300' :
          track.relevance === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {track.relevance || 'N/A'}
        </span>
      </div>

      {expanded && (
        <div className="border-t border-surface-600 p-4 max-h-[600px] overflow-y-auto space-y-4">
          {track.findings?.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Key Findings</h5>
              <div className="space-y-2">
                {track.findings.map(f => (
                  <div key={f.id} className="p-3 bg-surface-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-gray-500">{f.id}</span>
                      <span className="text-sm font-medium text-gray-200">{f.title}</span>
                      <EvidenceBadge weight={f.evidence_weight} />
                      {(f.feeds_questions || []).map(q => (
                        <span key={q} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-600/15 text-amber-300 border border-amber-600/30">
                          {q}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{f.content}</p>
                    {f.sources?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {f.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-amber-400 hover:text-amber-300 underline"
                          >
                            {truncate(src.name || src.url, 40)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {track.evidence_gaps?.length > 0 && (
            <div>
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
        </div>
      )}
    </div>
  )
}

function EvidenceBadge({ weight }) {
  const styles = {
    strong:   'bg-emerald-500/20 text-emerald-300',
    moderate: 'bg-blue-500/20 text-blue-300',
    thin:     'bg-amber-500/20 text-amber-300',
    absent:   'bg-gray-500/20 text-gray-400',
  }
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${styles[weight] || styles.absent}`}>
      {weight || 'N/A'}
    </span>
  )
}

function truncate(str, n) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

function handleDownloadAll(cellaryResults) {
  const parts = []
  const { dossier, trackSyntheses, plan } = cellaryResults

  parts.push('# Cellary Decision Dossier\n\n')
  if (dossier?.venture_name) parts.push(`**Venture:** ${dossier.venture_name}\n\n`)
  if (dossier?.synthesis_notes) parts.push(`${dossier.synthesis_notes}\n\n`)
  parts.push('---\n\n')

  // FactBank as markdown table
  parts.push('## FactBank\n\n')
  parts.push('| ID | Question | Answer | Confidence | Sources |\n')
  parts.push('|---|---|---|---|---|\n')
  for (const entry of (dossier?.factbank || [])) {
    const sources = (entry.sources || [])
      .map(s => `[${s.name || s.url}](${s.url})`)
      .join('<br>')
    const answer = (entry.answer || '').replace(/\n/g, ' ') + (entry.gaps ? ` *(Gap: ${entry.gaps})*` : '')
    parts.push(`| ${entry.id} | ${entry.question} | ${answer} | ${entry.confidence || 'N/A'} | ${sources || '—'} |\n`)
  }
  parts.push('\n---\n\n')

  // Decision Memo
  parts.push('## Decision Memo\n\n')
  for (const entry of (dossier?.decision_memo || [])) {
    parts.push(`### ${entry.id} — ${entry.question}\n\n`)
    parts.push(`**Recommendation** (confidence: ${entry.confidence || 'N/A'}): ${entry.recommendation}\n\n`)
    if (entry.supporting_evidence?.length > 0) {
      parts.push('**Supporting evidence:**\n')
      for (const ev of entry.supporting_evidence) {
        const refs = (ev.fact_refs || []).length > 0 ? ` _[${ev.fact_refs.join(', ')}]_` : ''
        parts.push(`- ${ev.claim}${refs}\n`)
      }
      parts.push('\n')
    }
    if (entry.counter_evidence?.length > 0) {
      parts.push('**Counter evidence:**\n')
      for (const ev of entry.counter_evidence) {
        const refs = (ev.fact_refs || []).length > 0 ? ` _[${ev.fact_refs.join(', ')}]_` : ''
        parts.push(`- ${ev.claim}${refs}\n`)
      }
      parts.push('\n')
    }
    if (entry.assumptions?.length > 0) {
      parts.push('**Assumptions:**\n')
      for (const a of entry.assumptions) parts.push(`- ${a}\n`)
      parts.push('\n')
    }
    if (entry.what_would_change_our_mind) {
      parts.push(`**What would change our mind:** ${entry.what_would_change_our_mind}\n\n`)
    }
    if (entry.kill_signals?.length > 0) {
      parts.push('**Kill signals:**\n')
      for (const ks of entry.kill_signals) parts.push(`- ${ks}\n`)
      parts.push('\n')
    }
    parts.push('---\n\n')
  }

  // Tracks as appendix
  parts.push('## Appendix: Track Evidence Packages\n\n')
  for (const track of (trackSyntheses || [])) {
    parts.push(`### ${track.track_id}: ${track.track_name}\n\n`)
    parts.push('```json\n')
    parts.push(JSON.stringify(track, null, 2))
    parts.push('\n```\n\n')
  }

  if (plan) {
    parts.push('## Appendix: Research Plan\n\n```json\n')
    parts.push(JSON.stringify(plan, null, 2))
    parts.push('\n```\n')
  }

  const blob = new Blob([parts.join('')], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cellary-dossier-${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  URL.revokeObjectURL(url)
}
