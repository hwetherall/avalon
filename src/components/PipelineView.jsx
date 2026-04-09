import StepCard from './StepCard.jsx'
import ScoutPanel from './ScoutPanel.jsx'
import { STEPS } from '../pipeline/orchestrator.js'

const GROUPS = [
  { id: 1, label: 'Step 1: Pairwise Tension Analysis', description: '3 parallel calls comparing chapter pairs' },
  { id: 2, label: 'Step 1.5: Path Cartographer', description: 'Enumerating strategic paths from upstream evidence' },
  { id: 2.5, label: 'Step 2: Scouts', description: 'Parallel web research for each strategic path' },
  { id: 3, label: 'Step 3a: War Table', description: 'Comparative evaluation + ranked recommendation' },
  { id: 4, label: 'Step 3b: Focused Adversarial Debate', description: 'Bull → Bear → Rebuttal → Synthesizer on chosen path' },
  { id: 5, label: 'Step 3c: Final Assembly', description: 'V2 Information Passport with path context + scout evidence' },
]

export default function PipelineView({ stepStates, onRerunScout, rerunningScoutPathId }) {
  const completedCount = Object.values(stepStates).filter(s => s.status === 'complete').length
  const totalSteps = STEPS.length
  const progress = (completedCount / totalSteps) * 100

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-200">Pipeline Progress</h2>
          <span className="text-sm text-gray-400 font-mono">{completedCount}/{totalSteps} steps</span>
        </div>
        <div className="h-1 bg-surface-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-8">
        {GROUPS.map(group => {
          const groupSteps = STEPS.filter(s => s.group === group.id)
          if (groupSteps.length === 0) return null

          // Don't show post-selection groups if none of their steps have started
          const anyStarted = groupSteps.some(s => {
            const state = stepStates[s.id]
            return state && state.status !== 'waiting'
          })
          const isPostSelection = group.id >= 4
          if (isPostSelection && !anyStarted) return null

          return (
            <div key={group.id}>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-300">{group.label}</h3>
                <p className="text-xs text-gray-500">{group.description}</p>
              </div>

              {/* Scout group: special rendering with ScoutPanel */}
              {group.id === 2.5 ? (
                <div className="space-y-3">
                  {groupSteps.map(step => (
                    <div key={step.id}>
                      <StepCard stepId={step.id} state={stepStates[step.id]} />
                      {stepStates[step.id]?.scouts && (
                        <div className="mt-3">
                          <ScoutPanel
                            scoutStates={stepStates[step.id].scouts}
                            onRerunScout={onRerunScout}
                            rerunningScoutPathId={rerunningScoutPathId}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : group.id === 4 ? (
                /* Debate group: 3b-i through 3b-iv are sequential */
                <div className="space-y-3">
                  {groupSteps.map(step => (
                    <StepCard key={step.id} stepId={step.id} state={stepStates[step.id]} />
                  ))}
                </div>
              ) : (
                <div className={`grid gap-3 ${group.id === 1 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
                  {groupSteps.map(step => (
                    <StepCard key={step.id} stepId={step.id} state={stepStates[step.id]} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
