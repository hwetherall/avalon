import { useState, useCallback, useRef } from 'react'
import InputPanel from './components/InputPanel.jsx'
import PipelineView from './components/PipelineView.jsx'
import PassportView from './components/PassportView.jsx'
import { runPipeline, STEPS } from './pipeline/orchestrator.js'
// Demo data is lazy-loaded only when the user clicks Demo
const loadDemoData = () => import('./demo/demoData.js')

const PHASES = { INPUT: 'input', RUNNING: 'running', COMPLETE: 'complete', ERROR: 'error' }

export default function App() {
  const [phase, setPhase] = useState(PHASES.INPUT)
  const [stepStates, setStepStates] = useState({})
  const [passport, setPassport] = useState(null)
  const [pipelineError, setPipelineError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)
  const startTimesRef = useRef({})

  const updateStep = useCallback((stepId, update) => {
    if (update.status === 'running') {
      startTimesRef.current[stepId] = startTimesRef.current[stepId] || Date.now()
    }
    setStepStates(prev => {
      const prevStep = prev[stepId] || {}
      // Merge scout sub-states instead of overwriting
      const mergedScouts = update.scouts
        ? { ...(prevStep.scouts || {}), ...update.scouts }
        : prevStep.scouts
      return {
        ...prev,
        [stepId]: {
          ...prevStep,
          ...update,
          scouts: mergedScouts,
          startTime: startTimesRef.current[stepId] || Date.now(),
        },
      }
    })
  }, [])

  const handleSubmit = useCallback(async ({ demval, marketResearch, competitorAnalysis, userContext }) => {
    setPhase(PHASES.RUNNING)
    setPipelineError(null)
    setPassport(null)
    setIsDemo(false)
    startTimesRef.current = {}

    const initial = {}
    for (const step of STEPS) {
      initial[step.id] = { status: 'waiting', output: null, error: null }
    }
    setStepStates(initial)

    try {
      const result = await runPipeline(demval, marketResearch, competitorAnalysis, userContext, updateStep)
      setPassport(result)
      setPhase(PHASES.COMPLETE)
    } catch (err) {
      setPipelineError(err.message)
      setPhase(PHASES.ERROR)
    }
  }, [updateStep])

  const handleDemo = useCallback(async () => {
    const { DEMO_STEP_OUTPUTS, DEMO_PASSPORT } = await loadDemoData()

    setIsDemo(true)
    setPipelineError(null)

    // Build step states with all steps instantly complete
    const now = Date.now()
    const demoStates = {}
    for (const step of STEPS) {
      demoStates[step.id] = {
        status: 'complete',
        output: DEMO_STEP_OUTPUTS[step.id] || null,
        error: null,
        startTime: now,
        timestamp: now,
      }
    }
    setStepStates(demoStates)
    setPassport(DEMO_PASSPORT)
    setPhase(PHASES.COMPLETE)
  }, [])

  const handleReset = () => {
    setPhase(PHASES.INPUT)
    setStepStates({})
    setPassport(null)
    setPipelineError(null)
    setIsDemo(false)
    startTimesRef.current = {}
  }

  return (
    <div className="min-h-screen bg-surface-900 text-gray-100">
      <div className="px-4 py-8 md:px-8 lg:px-12">
        {/* Input Phase */}
        {phase === PHASES.INPUT && (
          <InputPanel onSubmit={handleSubmit} onDemo={handleDemo} disabled={false} />
        )}

        {/* Running Phase */}
        {(phase === PHASES.RUNNING || phase === PHASES.ERROR) && (
          <div className="space-y-8">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-gray-100 font-mono tracking-tight">AVALON</h1>
              <p className="text-gray-500 text-sm mt-1">Adversarial synthesis in progress...</p>
            </div>
            <PipelineView stepStates={stepStates} />

            {phase === PHASES.ERROR && pipelineError && (
              <div className="max-w-3xl mx-auto">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <h3 className="text-sm font-semibold text-red-400 mb-1">Pipeline Error</h3>
                  <p className="text-xs text-red-300 font-mono">{pipelineError}</p>
                  <button
                    onClick={handleReset}
                    className="mt-3 px-4 py-2 text-xs font-medium rounded-lg bg-surface-700 border border-surface-600 text-gray-300 hover:bg-surface-600 transition-colors"
                  >
                    Return to Input
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Complete Phase */}
        {phase === PHASES.COMPLETE && passport && (
          <div className="space-y-8">
            {isDemo && (
              <div className="max-w-5xl mx-auto">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                  <span className="text-xs font-medium text-amber-300">
                    Demo Mode — Samsung LEO Satellite Case — Pre-computed outputs, no AI calls made
                  </span>
                </div>
              </div>
            )}
            <PipelineView stepStates={stepStates} />
            <div className="border-t border-surface-600 pt-8">
              <PassportView passport={passport} onReset={handleReset} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
