import { useState, useCallback, useRef } from 'react'
import InputPanel from './components/InputPanel.jsx'
import PipelineView from './components/PipelineView.jsx'
import PassportView from './components/PassportView.jsx'
import PathSelection from './components/PathSelection.jsx'
import ScoutIncompleteGate from './components/ScoutIncompleteGate.jsx'
import { runPreSelection, runPostSelection, STEPS } from './pipeline/orchestrator.js'
import { runSingleScout } from './pipeline/scoutOrchestrator.js'
// Demo data is lazy-loaded only when the user clicks Demo
const loadDemoData = () => import('./demo/demoData.js')

const PHASES = {
  INPUT: 'input',
  RUNNING: 'running',
  SCOUT_GATE: 'scout_gate', // Incomplete scouts — user must confirm before War Table
  SELECTING: 'selecting',   // User selection gate between pre- and post-selection
  RUNNING_POST: 'running_post',
  COMPLETE: 'complete',
  ERROR: 'error',
}

export default function App() {
  const [phase, setPhase] = useState(PHASES.INPUT)
  const [stepStates, setStepStates] = useState({})
  const [passport, setPassport] = useState(null)
  const [pipelineError, setPipelineError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)
  const startTimesRef = useRef({})

  // Pre-selection state is stored between phases so post-selection can use it
  const preSelectionRef = useRef(null)
  /** Set before scouts finish so reruns work while the pipeline is still running */
  const scoutContextRef = useRef(null)
  /** Promise controls for incomplete-scout gate (resume or cancel on reset) */
  const scoutGateRef = useRef(null)
  const [rerunningScoutPathId, setRerunningScoutPathId] = useState(null)

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

  // ── Phase 1: Submit → Pre-Selection ──
  const handleSubmit = useCallback(async ({ demval, marketResearch, competitorAnalysis, userContext }) => {
    setPhase(PHASES.RUNNING)
    setPipelineError(null)
    setPassport(null)
    setIsDemo(false)
    startTimesRef.current = {}
    preSelectionRef.current = null
    scoutContextRef.current = null
    scoutGateRef.current = null

    const initial = {}
    for (const step of STEPS) {
      initial[step.id] = { status: 'waiting', output: null, error: null }
    }
    setStepStates(initial)

    try {
      const result = await runPreSelection(
        demval,
        marketResearch,
        competitorAnalysis,
        userContext,
        updateStep,
        ctx => { scoutContextRef.current = ctx },
        {
          onAfterScouts: data => {
            preSelectionRef.current = {
              ...data,
              warTableOutput: null,
            }
          },
          waitForWarTableIfIncomplete: () =>
            new Promise((resolve, reject) => {
              scoutGateRef.current = { resolve, reject }
              setPhase(PHASES.SCOUT_GATE)
            }),
          getLatestScoutResults: () => preSelectionRef.current?.scoutResults ?? null,
        },
      )
      preSelectionRef.current = result
      setPhase(PHASES.SELECTING)
    } catch (err) {
      setPipelineError(err.message)
      setPhase(PHASES.ERROR)
    }
  }, [updateStep])

  // ── User Selection Gate → Post-Selection ──
  const handlePathSelect = useCallback(async (selectedPathId, overrideRationale) => {
    setPhase(PHASES.RUNNING_POST)
    setPipelineError(null)

    try {
      const result = await runPostSelection(
        preSelectionRef.current,
        selectedPathId,
        overrideRationale,
        updateStep,
      )
      setPassport(result)
      setPhase(PHASES.COMPLETE)
    } catch (err) {
      setPipelineError(err.message)
      setPhase(PHASES.ERROR)
    }
  }, [updateStep])

  // ── Demo Mode ──
  const handleDemo = useCallback(async () => {
    const { DEMO_STEP_OUTPUTS, DEMO_PASSPORT } = await loadDemoData()

    setIsDemo(true)
    setPipelineError(null)
    preSelectionRef.current = null
    scoutContextRef.current = null
    setRerunningScoutPathId(null)

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

  // ── Reset ──
  const handleReset = () => {
    if (scoutGateRef.current?.reject) {
      scoutGateRef.current.reject(new Error('Pipeline reset before continuing to War Table.'))
      scoutGateRef.current = null
    }
    setPhase(PHASES.INPUT)
    setStepStates({})
    setPassport(null)
    setPipelineError(null)
    setIsDemo(false)
    setRerunningScoutPathId(null)
    startTimesRef.current = {}
    preSelectionRef.current = null
    scoutContextRef.current = null
  }

  const handleContinueToWarTable = useCallback(() => {
    const g = scoutGateRef.current
    if (!g) return
    scoutGateRef.current = null
    setPhase(PHASES.RUNNING)
    g.resolve()
  }, [])

  const getScoutRerunContext = useCallback(() => {
    if (preSelectionRef.current) {
      const { cartographerOutput, userContext } = preSelectionRef.current
      const ventureName = userContext?.match(/venture[:\s]+(.+)/i)?.[1]?.trim()
        || cartographerOutput?.match(/venture[:\s]+(.+)/i)?.[1]?.trim()
        || 'Venture'
      return { cartographerOutput, ventureName }
    }
    return scoutContextRef.current
  }, [])

  const handleRerunScout = useCallback(async pathId => {
    const ctx = getScoutRerunContext()
    if (!ctx?.cartographerOutput) return

    setRerunningScoutPathId(pathId)
    try {
      const result = await runSingleScout(ctx.cartographerOutput, ctx.ventureName, pathId, (pid, update) => {
        updateStep('2.scout', { scouts: { [pid]: update } })
      })

      if (preSelectionRef.current) {
        const list = preSelectionRef.current.scoutResults
        const row = {
          pathId: result.pathId,
          pathName: result.pathName,
          status: result.status,
          fieldReport: result.fieldReport,
          queriesRun: result.queriesRun,
          error: result.error,
        }
        const i = list.findIndex(r => r.pathId === pathId)
        if (i >= 0) list[i] = row
        else list.push(row)
      }
    } catch (err) {
      const existing = preSelectionRef.current?.scoutResults?.find(r => r.pathId === pathId)
      updateStep('2.scout', {
        scouts: {
          [pathId]: {
            status: 'error',
            pathName: existing?.pathName || pathId,
            error: err.message,
          },
        },
      })
    } finally {
      setRerunningScoutPathId(null)
    }
  }, [getScoutRerunContext, updateStep])

  const isRunning = phase === PHASES.RUNNING || phase === PHASES.RUNNING_POST

  const showPipelineRunning =
    isRunning || phase === PHASES.ERROR || phase === PHASES.SCOUT_GATE

  return (
    <div className="min-h-screen bg-surface-900 text-gray-100">
      <div className="px-4 py-8 md:px-8 lg:px-12">
        {/* Input Phase */}
        {phase === PHASES.INPUT && (
          <InputPanel onSubmit={handleSubmit} onDemo={handleDemo} disabled={false} />
        )}

        {/* Running / scout gate / error */}
        {showPipelineRunning && (
          <div className="space-y-8">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-gray-100 font-mono tracking-tight">AVALON</h1>
              <p className="text-gray-500 text-sm mt-1">
                {phase === PHASES.RUNNING_POST
                  ? 'Adversarial debate in progress on chosen path...'
                  : phase === PHASES.SCOUT_GATE
                    ? 'Some scouts did not complete — fix or confirm before the War Table.'
                    : 'Adversarial synthesis in progress...'}
              </p>
            </div>
            <PipelineView
              stepStates={stepStates}
              onRerunScout={isDemo ? undefined : handleRerunScout}
              rerunningScoutPathId={rerunningScoutPathId}
            />

            {phase === PHASES.SCOUT_GATE && (
              <ScoutIncompleteGate onContinue={handleContinueToWarTable} disabled={false} />
            )}

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

        {/* Selection Phase — War Table complete, awaiting user path choice */}
        {phase === PHASES.SELECTING && (
          <div className="space-y-8">
            <PipelineView
              stepStates={stepStates}
              onRerunScout={handleRerunScout}
              rerunningScoutPathId={rerunningScoutPathId}
            />
            <div className="border-t border-surface-600 pt-8">
              <PathSelection
                warTableOutput={preSelectionRef.current?.warTableOutput}
                onSelect={handlePathSelect}
              />
            </div>
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
            <PipelineView
              stepStates={stepStates}
              onRerunScout={handleRerunScout}
              rerunningScoutPathId={rerunningScoutPathId}
            />
            <div className="border-t border-surface-600 pt-8">
              <PassportView passport={passport} onReset={handleReset} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
