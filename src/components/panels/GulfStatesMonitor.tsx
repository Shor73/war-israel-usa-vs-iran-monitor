'use client'
import { GULF_STATES } from '@/lib/constants'
import { threatColor, threatBg } from '@/lib/utils'
import { Flag, ISO3_TO_ISO2 } from '@/components/ui/Flag'

const STANCE_COLORS: Record<string, string> = {
  ALLY: '#00e676', CAUTIOUS: '#ffc107', NEUTRAL: '#7f8c9b',
  CONTESTED: '#ff6b35', HOSTILE: '#ff2d2d', MEDIATOR: '#2196f3',
}

export default function GulfStatesMonitor() {
  return (
    <div className="grid grid-cols-2 gap-1 p-1 overflow-y-auto h-full">
      {GULF_STATES.map(state => (
        <div
          key={state.code}
          className="border p-1.5 rounded-sm"
          style={{ borderColor: `${threatColor(state.threat)}30`, backgroundColor: threatBg(state.threat) }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Flag iso={ISO3_TO_ISO2[state.code] || state.code.slice(0, 2).toLowerCase()} size={16} />
              <span className="font-military text-[9px]" style={{ color: '#c8d6e5' }}>{state.name}</span>
            </div>
            <span
              className="font-military text-[7px] border px-0.5"
              style={{ color: threatColor(state.threat), borderColor: threatColor(state.threat) }}
            >
              {state.threat}
            </span>
          </div>

          <div className="flex items-center gap-1 mb-1">
            <span className="font-military text-[7px] border px-0.5"
              style={{ color: STANCE_COLORS[state.stance], borderColor: STANCE_COLORS[state.stance] }}>
              {state.stance}
            </span>
          </div>

          {state.usBases.length > 0 && (
            <div className="font-mono-data text-[7px] mb-0.5" style={{ color: '#2196f3' }}>
              ✈ {state.usBases[0].split('(')[0].trim()}
            </div>
          )}

          <div className="font-mono-data text-[7px] leading-snug" style={{ color: '#7f8c9b' }}>
            {state.keyFactor.slice(0, 80)}{state.keyFactor.length > 80 ? '...' : ''}
          </div>

          {state.latestDevelopment && (
            <div className="font-mono-data text-[7px] mt-0.5" style={{ color: '#ffc107' }}>
              ▶ {state.latestDevelopment.slice(0, 60)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
