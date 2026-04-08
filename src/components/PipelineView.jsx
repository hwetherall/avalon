import StepCard from './StepCard.jsx'
import { STEPS } from '../pipeline/orchestrator.js'

const GROUPS = [
  { id: 1, label: 'Step 1: Pairwise Tension Analysis', description: '3 parallel calls comparing chapter pairs' },
  { id: 2, label: 'Step 2: Adversarial Strategic Debate', description: 'Bull → Bear → Rebuttal → Synthesizer + Creative' },
  { id: 3, label: 'Step 3: Final Assembly', description: 'Information Passport + P&T Brief' },
]

export default function PipelineView({ stepStates }) {
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
          const isParallel = group.id === 1 || (group.id === 2 && groupSteps.some(s => s.id === '2d'))

          return (
            <div key={group.id}>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-300">{group.label}</h3>
                <p className="text-xs text-gray-500">{group.description}</p>
              </div>

              {group.id === 2 ? (
                <div className="space-y-3">
                  {/* 2a, 2b, 2c are sequential */}
                  {groupSteps.filter(s => ['2a', '2b', '2c'].includes(s.id)).map(step => (
                    <StepCard key={step.id} stepId={step.id} state={stepStates[step.id]} />
                  ))}
                  {/* 2d and 2e are parallel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {groupSteps.filter(s => ['2d', '2e'].includes(s.id)).map(step => (
                      <StepCard key={step.id} stepId={step.id} state={stepStates[step.id]} />
                    ))}
                  </div>
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
