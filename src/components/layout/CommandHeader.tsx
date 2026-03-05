'use client'
import { useEffect, useState, useCallback } from 'react'
import { toMilTime } from '@/lib/utils'
import { useDashboardStore } from '@/store/dashboard'
import { Flag } from '@/components/ui/Flag'

const DEFCON_LABELS: Record<number, string> = {
  1: 'DEFCON 1', 2: 'DEFCON 2', 3: 'DEFCON 3', 4: 'DEFCON 4', 5: 'DEFCON 5'
}
const DEFCON_COLORS: Record<number, string> = {
  1: '#ff2d2d', 2: '#ff6b35', 3: '#ffc107', 4: '#00e676', 5: '#2196f3'
}
const FPCON_COLORS: Record<string, string> = {
  NORMAL: '#00e676', ALPHA: '#2196f3', BRAVO: '#ffc107', CHARLIE: '#ff6b35', DELTA: '#ff2d2d'
}

const STATUS_DOTS = [
  { label: 'SATCOM', color: '#00e676' },
  { label: 'SIGINT', color: '#00e676' },
  { label: 'HUMINT', color: '#ffc107' },
  { label: 'CYBER', color: '#00e676' },
]

export default function CommandHeader() {
  const [time, setTime] = useState('')
  const { defcon, fpcon, soundEnabled, nuclearWatchOpen, briefOpen, toggleSound, openNuclearWatch, closNuclearWatch, openBrief, closeBrief } = useDashboardStore()

  useEffect(() => {
    setTime(toMilTime(new Date()))
    const id = setInterval(() => setTime(toMilTime(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header
      className="flex items-center justify-between px-3 py-1 flex-shrink-0"
      style={{
        background: 'linear-gradient(180deg, #0d1520 0%, #0a1018 100%)',
        borderBottom: '1px solid #1e2d3d',
        gridColumn: '1 / -1', gridRow: '1',
      }}
    >
      {/* Left: Operation name + DEFCON */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full live-dot" style={{ backgroundColor: '#ff2d2d' }} />
          <span className="font-military text-xs tracking-widest" style={{ color: '#00ff88' }}>
            OPERATION ULTIMATUM
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span
            className="font-military text-[10px] border px-1.5 py-0.5"
            style={{ color: DEFCON_COLORS[defcon], borderColor: DEFCON_COLORS[defcon], backgroundColor: `${DEFCON_COLORS[defcon]}15` }}
          >
            {DEFCON_LABELS[defcon]}
          </span>
          <span
            className="font-military text-[10px] border px-1.5 py-0.5"
            style={{ color: FPCON_COLORS[fpcon], borderColor: FPCON_COLORS[fpcon], backgroundColor: `${FPCON_COLORS[fpcon]}15` }}
          >
            FPCON {fpcon}
          </span>
        </div>

        {/* System status dots */}
        <div className="flex items-center gap-2">
          {STATUS_DOTS.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full live-dot" style={{ backgroundColor: color }} />
              <span className="font-military text-[9px]" style={{ color: '#7f8c9b' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Title + Clock */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-2">
          <Flag iso="il" size={18} />
          <Flag iso="us" size={18} />
          <span className="font-military tracking-widest font-bold" style={{ color: '#ff2d2d', fontSize: 13 }}>vs</span>
          <Flag iso="ir" size={18} />
          <span className="font-military tracking-widest font-bold" style={{ color: '#c8d6e5', fontSize: 12 }}>
            ISRAEL / USA vs IRAN · WAR 2026
          </span>
        </div>
        <span className="font-military text-[10px] tracking-widest" style={{ color: '#7f8c9b' }}>
          {time}
        </span>
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={openNuclearWatch}
          className="font-military text-[9px] border px-2 py-1 hover:opacity-80 transition-opacity"
          style={{ color: '#ab47bc', borderColor: '#ab47bc', backgroundColor: 'rgba(171,71,188,0.1)' }}
        >
          ☢ NUCLEAR WATCH
        </button>
        <button
          onClick={openBrief}
          className="font-military text-[9px] border px-2 py-1 hover:opacity-80 transition-opacity"
          style={{ color: '#1a73e8', borderColor: '#1a73e8', backgroundColor: 'rgba(26,115,232,0.1)' }}
        >
          ⚡ AI SITREP
        </button>
        <button
          onClick={toggleSound}
          className="font-military text-[9px] border px-2 py-1 hover:opacity-80 transition-opacity"
          style={{ color: '#7f8c9b', borderColor: '#2a4a6b' }}
        >
          {soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF'}
        </button>
        <span className="font-military text-[9px] border px-2 py-0.5" style={{ color: '#ff2d2d', borderColor: '#ff2d2d', backgroundColor: 'rgba(255,45,45,0.1)' }}>
          ▶ WAROPS COMMAND CENTER
        </span>
      </div>
    </header>
  )
}
