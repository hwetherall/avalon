import { availableModes } from '../pipeline/modes/registry.js'

const ACCENT_CLASSES = {
  violet: {
    border: 'border-violet-500/30',
    iconBg: 'bg-violet-500/20',
    button:  'bg-violet-600 hover:bg-violet-500',
    heading: 'text-gray-100',
  },
  amber: {
    border: 'border-amber-600/40',
    iconBg: 'bg-amber-600/20',
    button:  'bg-amber-600 hover:bg-amber-500',
    heading: 'text-amber-100',
  },
  // Default fallback for future modes
  default: {
    border: 'border-surface-600',
    iconBg: 'bg-surface-700',
    button:  'bg-accent hover:bg-accent/90',
    heading: 'text-gray-100',
  },
}

/**
 * Renders one CTA card per available mode (gated by the mode's gate()).
 *
 * Props:
 *  - passport: string (used to evaluate each mode's gate)
 *  - onLaunch: (modeId: string) => void
 */
export default function ModeLauncher({ passport, onLaunch }) {
  if (!onLaunch) return null
  const modes = availableModes(passport)
  if (modes.length === 0) return null

  return (
    <div className="mt-8 space-y-4">
      {modes.map(mode => {
        const accent = ACCENT_CLASSES[mode.accent] || ACCENT_CLASSES.default
        return (
          <div key={mode.id} className={`p-6 bg-surface-800 border ${accent.border} rounded-lg`}>
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${accent.iconBg} flex items-center justify-center`}>
                <span className="text-lg">{mode.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${accent.heading} mb-1`}>{mode.label}</h3>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">{mode.blurb}</p>
                <button
                  onClick={() => onLaunch(mode.id)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-colors ${accent.button}`}
                >
                  {mode.label.startsWith('Launch') ? mode.label : `Launch ${mode.label}`}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
