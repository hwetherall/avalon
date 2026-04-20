/**
 * Mode Registry — declarative list of post-passport research modes.
 *
 * Each mode declares:
 *  - id / label / blurb / icon — metadata for the ModeLauncher UI
 *  - accent — Tailwind color family used by the launcher card
 *  - orchestrator — the pipeline runner function ({ passport, ventureBrief, onStep })
 *  - steps — the step definitions array for the pipeline view
 *  - view — the React component that renders progress + results
 *  - resultsKey — the field on the run result that the view reads (for generic dispatch)
 *  - gate(passport) — predicate that decides whether this mode should appear
 *
 * Adding a new mode is a single entry here plus its own orchestrator/view files.
 */

import PrimateView from '../../components/PrimateView.jsx'
import CellaryView from '../../components/CellaryView.jsx'
import { runPrimate, PRIMATE_STEPS } from '../primateOrchestrator.js'
import { runCellary, CELLARY_STEPS } from '../cellaryOrchestrator.js'

const CELLARY_KEYWORDS = /wine|cellar|sommelier|\bclub\b|vineyard|vintner|hospitality|country club|resort/i

// URL override for testing: append ?mode=cellary or ?mode=primate to force a mode to show.
function urlForced(id) {
  if (typeof window === 'undefined') return false
  const m = new URLSearchParams(window.location.search).get('mode')
  return m === id
}

export const MODES = [
  {
    id: 'primate',
    label: 'Launch Deep Research (Primate)',
    blurb: 'Primate runs 6 parallel research tracks — technology maturity, reference architecture, components, regulatory, patent landscape, and talent — producing structured evidence packages for the P&T chapter. 25–35 minutes.',
    icon: '🔬',
    accent: 'violet',
    orchestrator: runPrimate,
    steps: PRIMATE_STEPS,
    view: PrimateView,
    // Primate is always applicable — it's the default P&T deep-research mode.
    gate: () => true,
  },
  {
    id: 'cellary',
    label: 'Launch Cellary: Wine & Private-Club Decision Dossier',
    blurb: 'Cellary runs 6 wine-domain tracks — market sizing, client pain, pricing & WTP, adjacent markets, unit economics, competitor landscape — and produces a cited FactBank plus an auditable Decision Memo. Final synthesis uses Claude Sonnet 4.6.',
    icon: '🍷',
    accent: 'amber',
    orchestrator: runCellary,
    steps: CELLARY_STEPS,
    view: CellaryView,
    gate: (passport) => urlForced('cellary') || (!!passport && CELLARY_KEYWORDS.test(passport)),
  },
]

export function getMode(id) {
  return MODES.find(m => m.id === id) || null
}

export function availableModes(passport) {
  return MODES.filter(m => m.gate(passport))
}
