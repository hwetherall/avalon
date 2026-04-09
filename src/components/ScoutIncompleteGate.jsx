/**
 * Shown when at least one scout failed or produced no field report.
 * War Table does not run until the user explicitly continues.
 */
export default function ScoutIncompleteGate({ onContinue, disabled }) {
  return (
    <div className="max-w-3xl mx-auto rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-amber-200">
        Scouts incomplete
      </h3>
      <p className="text-xs text-gray-400 leading-relaxed">
        The War Table is held until every path has a successful scout field report, or you choose to continue
        with whatever evidence is available (missing paths will be treated as uninvestigated).
      </p>
      <p className="text-xs text-gray-500">
        You can use <span className="text-gray-300">Rerun scout</span> on failed paths above, then continue when
        ready — or proceed now if you accept partial coverage.
      </p>
      <button
        type="button"
        onClick={onContinue}
        disabled={disabled}
        className="px-4 py-2 text-xs font-medium rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-100 hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Continue to War Table anyway
      </button>
    </div>
  )
}
