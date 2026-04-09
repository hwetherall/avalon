import { useState } from 'react'

const DIMENSION_LABELS = {
  evidence_strength: 'Evidence',
  core_bet_risk: 'Core Bet',
  execution_complexity: 'Execution',
  reward_ceiling: 'Reward',
  time_to_value: 'Time to Value',
}

const RATING_COLORS = {
  'Strong': 'bg-emerald-400',
  'Moderate': 'bg-amber-400',
  'Weak': 'bg-red-400',
  'Insufficient Data': 'bg-gray-500',
}

function RatingDot({ rating }) {
  const color = RATING_COLORS[rating] || 'bg-gray-500'
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${color}`}
      title={rating}
    />
  )
}

export default function PathSelection({ warTableOutput, onSelect }) {
  const [selectedId, setSelectedId] = useState(null)
  const [overrideRationale, setOverrideRationale] = useState('')
  const [confirming, setConfirming] = useState(false)

  if (!warTableOutput) return null

  const { venture, key_tradeoff, cross_path_insights, ranking, uninvestigated_paths, innovera_recommendation } = warTableOutput
  const rec = innovera_recommendation || {}
  const isOverride = selectedId && selectedId !== rec.recommended_path_id

  const handleConfirm = () => {
    if (!selectedId) return
    onSelect(selectedId, isOverride ? overrideRationale : null)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-100 font-mono tracking-tight">WAR TABLE</h1>
        <p className="text-gray-400 text-sm mt-1">
          Scout reports analyzed — select a path to proceed with adversarial evaluation
        </p>
      </div>

      {/* Summary bar */}
      <div className="bg-surface-800 border border-surface-600 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">Venture</span>
            <p className="text-sm font-semibold text-gray-200">{venture}</p>
          </div>
          <div className="flex-1 md:mx-6">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Key Tradeoff</span>
            <p className="text-sm text-gray-300">{key_tradeoff}</p>
          </div>
        </div>
      </div>

      {/* Innovera Recommendation callout */}
      {rec.recommended_path_id && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent-light rounded">
                Innovera Recommends
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-100">
                {rec.recommended_path_name}
              </h3>
              <p className="text-xs text-gray-300 mt-1">{rec.rationale}</p>
              {rec.success_criteria_note && (
                <p className="text-xs text-gray-400 mt-1 italic">{rec.success_criteria_note}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cross-path insights */}
      {cross_path_insights?.length > 0 && (
        <div className="bg-surface-800 border border-surface-600 rounded-lg p-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Cross-Path Insights</h3>
          <ul className="space-y-1">
            {cross_path_insights.map((insight, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-gray-500 flex-shrink-0">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ranked path cards */}
      <div className="space-y-3">
        {(ranking || []).map(path => {
          const isRecommended = path.path_id === rec.recommended_path_id
          const isSelected = path.path_id === selectedId

          return (
            <div
              key={path.path_id}
              className={`
                bg-surface-800 border rounded-lg p-4 transition-all cursor-pointer
                ${isSelected
                  ? 'border-accent ring-1 ring-accent/30'
                  : isRecommended
                    ? 'border-accent/40 hover:border-accent/60'
                    : 'border-surface-600 hover:border-surface-500'}
              `}
              onClick={() => { setSelectedId(path.path_id); setConfirming(false) }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Rank + Name + Badges */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-gray-500 font-mono">#{path.rank}</span>
                    <h3 className="text-sm font-semibold text-gray-100">{path.path_name}</h3>
                    {isRecommended && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/20 text-accent-light font-medium uppercase">
                        Recommended
                      </span>
                    )}
                  </div>

                  {/* Elevator pitch */}
                  <p className="text-xs text-gray-300 mb-2">{path.elevator_pitch}</p>

                  {/* Five-dimension ratings */}
                  <div className="flex flex-wrap gap-3 mb-2">
                    {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
                      <div key={key} className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-500">{label}</span>
                        <RatingDot rating={path.dimensions?.[key]} />
                      </div>
                    ))}
                  </div>

                  {/* Scout highlights */}
                  {path.scout_highlights?.length > 0 && (
                    <div className="mb-2">
                      <span className="text-[10px] text-gray-500 font-medium">Scout highlights: </span>
                      {path.scout_highlights.map((h, i) => (
                        <span key={i} className="text-[10px] text-gray-400">
                          {i > 0 && ' · '}{h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Red flags */}
                  {path.red_flags?.length > 0 && (
                    <div className="mb-2">
                      {path.red_flags.map((flag, i) => (
                        <span key={i} className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20 mr-1 mb-1">
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Biggest concern */}
                  <p className="text-[10px] text-gray-500">
                    <span className="font-medium text-gray-400">Concern: </span>
                    {path.biggest_concern}
                  </p>
                </div>

                {/* Select button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedId(path.path_id)
                    setConfirming(true)
                  }}
                  className={`
                    flex-shrink-0 px-4 py-2 text-xs font-medium rounded-lg transition-colors
                    ${isSelected
                      ? 'bg-accent text-white'
                      : 'bg-surface-700 border border-surface-600 text-gray-300 hover:bg-surface-600 hover:text-gray-100'}
                  `}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Uninvestigated paths */}
      {uninvestigated_paths?.length > 0 && (
        <div className="bg-surface-800/50 border border-surface-700 rounded-lg p-4">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Uninvestigated Paths — Scout Failed
          </h3>
          {uninvestigated_paths.map(path => (
            <div key={path.path_id} className="flex items-center gap-3 py-2 text-xs text-gray-500">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-600" />
              <span className="font-medium">{path.path_name}</span>
              <span className="text-gray-600">— {path.reason}</span>
            </div>
          ))}
        </div>
      )}

      {/* Override rationale input + Confirm button */}
      {selectedId && (
        <div className="bg-surface-800 border border-surface-600 rounded-lg p-4 space-y-3">
          {isOverride && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                You're overriding the Innovera recommendation. Tell us why (optional — helps the debate focus on what matters to you):
              </label>
              <textarea
                value={overrideRationale}
                onChange={(e) => setOverrideRationale(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs bg-surface-700 border border-surface-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent/50 resize-none"
                placeholder="e.g., We have existing relationships in maritime that aren't captured in the upstream chapters..."
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Selected: <span className="font-semibold text-gray-200">
                {ranking?.find(r => r.path_id === selectedId)?.path_name || selectedId}
              </span>
              {isOverride && <span className="text-amber-400 ml-2">(overrides recommendation)</span>}
            </p>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              Proceed with Adversarial Debate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
