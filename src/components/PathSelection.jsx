import { useState, useRef } from 'react'

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

// Map categorical War Table ratings → numeric 0-4 so paths can be plotted.
// Strong = good on every dimension (per RATING_COLORS emerald = positive).
const RATING_SCORE = {
  'Strong': 4,
  'Moderate': 2.5,
  'Weak': 1,
  'Insufficient Data': 0,
}
const scoreOf = (r) => RATING_SCORE[r] ?? 0

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
  const cardRefs = useRef({})

  if (!warTableOutput) return null

  const { venture, key_tradeoff, cross_path_insights, ranking, uninvestigated_paths, innovera_recommendation } = warTableOutput
  const rec = innovera_recommendation || {}
  const isOverride = selectedId && selectedId !== rec.recommended_path_id

  const handleConfirm = () => {
    if (!selectedId) return
    onSelect(selectedId, isOverride ? overrideRationale : null)
  }

  const handleDotClick = (pathId) => {
    setSelectedId(pathId)
    setConfirming(false)
    const node = cardRefs.current[pathId]
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' })
      node.classList.add('ring-2', 'ring-accent')
      setTimeout(() => node.classList.remove('ring-2', 'ring-accent'), 1400)
    }
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

      {/* Risk/Reward quadrant map */}
      {(ranking || []).length > 0 && (
        <PathQuadrant
          paths={ranking}
          selectedId={selectedId}
          recommendedId={rec.recommended_path_id}
          onDotClick={handleDotClick}
        />
      )}

      {/* Ranked path cards */}
      <div className="space-y-3">
        {(ranking || []).map(path => {
          const isRecommended = path.path_id === rec.recommended_path_id
          const isSelected = path.path_id === selectedId

          return (
            <div
              key={path.path_id}
              ref={el => { if (el) cardRefs.current[path.path_id] = el }}
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

// ══════════════════════════════════════════════════════════════════════════════
// PathQuadrant — Reward (x) × inverted Risk (y) map with one dot per path.
// Dots are plotted from War Table categorical ratings mapped to 0-4 scores.
// Dot size encodes evidence_strength. Recommended and selected paths get
// distinct strokes/fills so they stand out.
// ══════════════════════════════════════════════════════════════════════════════
function PathQuadrant({ paths, selectedId, recommendedId, onDotClick }) {
  const width = 720
  const height = 380
  const pad = { left: 56, right: 28, top: 28, bottom: 44 }
  const plotW = width - pad.left - pad.right
  const plotH = height - pad.top - pad.bottom

  // domain 0..4 (RATING_SCORE range)
  const xScale = (v) => pad.left + (v / 4) * plotW
  const yScale = (v) => pad.top + (1 - v / 4) * plotH

  const quadrantLabelStyle = { fontSize: 10, fill: '#9ca3af', fontFamily: 'monospace' }
  const axisTickStyle = { fontSize: 9, fill: '#6b7280', fontFamily: 'monospace' }

  // Collision-aware jitter: identical (x,y) dots would overlap exactly. Detect
  // duplicates and spread them in a small circle.
  const placed = paths.map(p => ({
    path: p,
    rawX: scoreOf(p.dimensions?.reward_ceiling),
    rawY: scoreOf(p.dimensions?.core_bet_risk),
    rawEv: scoreOf(p.dimensions?.evidence_strength),
  }))
  const posKey = (p) => `${p.rawX}|${p.rawY}`
  const buckets = {}
  placed.forEach(p => {
    const k = posKey(p)
    ;(buckets[k] = buckets[k] || []).push(p)
  })
  Object.values(buckets).forEach(bucket => {
    if (bucket.length === 1) {
      bucket[0].x = xScale(bucket[0].rawX)
      bucket[0].y = yScale(bucket[0].rawY)
    } else {
      bucket.forEach((p, i) => {
        const angle = (i / bucket.length) * Math.PI * 2
        const r = 14
        p.x = xScale(p.rawX) + Math.cos(angle) * r
        p.y = yScale(p.rawY) + Math.sin(angle) * r
      })
    }
  })

  const allInsufficient = placed.every(p => p.rawX === 0 && p.rawY === 0)

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">Path Map</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Reward ceiling × inverted core-bet risk. Top-right is highest reward at lowest risk. Dot size = evidence strength. Click a dot to select.
          </p>
        </div>
        {allInsufficient && (
          <span className="text-[10px] px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
            All paths have Insufficient Data — dots stacked at origin
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Path risk-reward quadrant">
          {/* Quadrant backgrounds (subtle) */}
          <rect x={pad.left} y={pad.top} width={plotW / 2} height={plotH / 2} fill="#f59e0b" fillOpacity="0.04" />
          <rect x={pad.left + plotW / 2} y={pad.top} width={plotW / 2} height={plotH / 2} fill="#10b981" fillOpacity="0.06" />
          <rect x={pad.left} y={pad.top + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#ef4444" fillOpacity="0.04" />
          <rect x={pad.left + plotW / 2} y={pad.top + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#6366f1" fillOpacity="0.04" />

          {/* Grid */}
          <line x1={pad.left} y1={pad.top + plotH / 2} x2={pad.left + plotW} y2={pad.top + plotH / 2} stroke="#374151" strokeDasharray="3 3" />
          <line x1={pad.left + plotW / 2} y1={pad.top} x2={pad.left + plotW / 2} y2={pad.top + plotH} stroke="#374151" strokeDasharray="3 3" />

          {/* Axes */}
          <line x1={pad.left} y1={pad.top + plotH} x2={pad.left + plotW} y2={pad.top + plotH} stroke="#4b5563" />
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + plotH} stroke="#4b5563" />

          {/* Quadrant labels */}
          <text x={pad.left + plotW * 0.25} y={pad.top + plotH * 0.08} textAnchor="middle" style={quadrantLabelStyle}>
            GRINDER
          </text>
          <text x={pad.left + plotW * 0.75} y={pad.top + plotH * 0.08} textAnchor="middle" style={quadrantLabelStyle} fill="#10b981">
            LOW-HANGING FRUIT
          </text>
          <text x={pad.left + plotW * 0.25} y={pad.top + plotH * 0.96} textAnchor="middle" style={quadrantLabelStyle} fill="#ef4444">
            AVOID
          </text>
          <text x={pad.left + plotW * 0.75} y={pad.top + plotH * 0.96} textAnchor="middle" style={quadrantLabelStyle}>
            MOONSHOT
          </text>

          {/* Axis titles */}
          <text x={pad.left + plotW / 2} y={height - 8} textAnchor="middle" style={{ ...axisTickStyle, fontSize: 11, fill: '#9ca3af' }}>
            Reward Ceiling →
          </text>
          <text
            x={-(pad.top + plotH / 2)} y={16}
            transform="rotate(-90)"
            textAnchor="middle"
            style={{ ...axisTickStyle, fontSize: 11, fill: '#9ca3af' }}
          >
            ← Risk (safer up)
          </text>

          {/* Axis ticks */}
          {['Weak', 'Moderate', 'Strong'].map((label, i) => {
            const v = [1, 2.5, 4][i]
            return (
              <g key={`x-${label}`}>
                <text x={xScale(v)} y={pad.top + plotH + 14} textAnchor="middle" style={axisTickStyle}>{label}</text>
              </g>
            )
          })}
          {['Weak', 'Moderate', 'Strong'].map((label, i) => {
            const v = [1, 2.5, 4][i]
            return (
              <text key={`y-${label}`} x={pad.left - 6} y={yScale(v) + 3} textAnchor="end" style={axisTickStyle}>{label}</text>
            )
          })}

          {/* Path dots */}
          {placed.map(({ path, x, y, rawEv }) => {
            const isRecommended = path.path_id === recommendedId
            const isSelected = path.path_id === selectedId
            const radius = 6 + rawEv * 2 // 6..14
            const fill = isSelected ? '#f59e0b' : isRecommended ? 'rgba(16, 185, 129, 0.45)' : 'rgba(156, 163, 175, 0.5)'
            const stroke = isSelected ? '#fbbf24' : isRecommended ? '#10b981' : '#9ca3af'
            return (
              <g key={path.path_id} style={{ cursor: 'pointer' }} onClick={() => onDotClick(path.path_id)}>
                <circle cx={x} cy={y} r={radius} fill={fill} stroke={stroke} strokeWidth={isSelected ? 2.5 : 1.5} />
                <text
                  x={x} y={y - radius - 4}
                  textAnchor="middle"
                  style={{ fontSize: 10, fill: isSelected ? '#fde68a' : isRecommended ? '#a7f3d0' : '#d1d5db', fontFamily: 'monospace', fontWeight: 600 }}
                >
                  #{path.rank} {truncate(path.path_name, 22)}
                </text>
                <title>{`${path.path_name}\nReward: ${path.dimensions?.reward_ceiling}\nCore Bet: ${path.dimensions?.core_bet_risk}\nEvidence: ${path.dimensions?.evidence_strength}`}</title>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-2 text-[10px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500" />
          Innovera recommended
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-amber-500 border border-amber-300" />
          Your selection
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-400/50 border border-gray-400" />
          Other
        </div>
        <div className="ml-auto italic text-gray-500">Dot size ∝ evidence strength</div>
      </div>
    </div>
  )
}

function truncate(s, n) {
  if (!s) return ''
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}
