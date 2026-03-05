'use client'
import { useState, useEffect, useRef } from 'react'
import { toShortDTG } from '@/lib/utils'

type SigintType = 'SIGINT' | 'OSINT' | 'HUMINT' | 'CYBER'

const SIGINT_COLORS: Record<SigintType, string> = {
  SIGINT: '#00e676', OSINT: '#ab47bc', HUMINT: '#ffd700', CYBER: '#ff6b35'
}

const INITIAL_ENTRIES = [
  { type: 'SIGINT' as SigintType, text: 'IRGC encrypted comm spike detected, Kermanshah — launch preparation assessed HIGH confidence' },
  { type: 'OSINT' as SigintType, text: '@OSINTdefender: "Multiple explosions reported near Isfahan, large smoke column visible from city center"' },
  { type: 'HUMINT' as SigintType, text: 'Source CARPET: IRGC Aerospace Force missile reserve est. ~35% remaining. Commander rotation ordered.' },
  { type: 'OSINT' as SigintType, text: '@AuroraIntel: "IDF confirms Arrow-3 successful intercept of Fattah-1 over Tel Aviv sector"' },
  { type: 'CYBER' as SigintType, text: 'APT33 (IRGC-linked) surge targeting CENTCOM network perimeters — 847 intrusion attempts blocked [CISA]' },
  { type: 'SIGINT' as SigintType, text: 'Hezbollah comm unit switched to backup encrypted frequency plan — SIGINT degraded 12-24h' },
  { type: 'OSINT' as SigintType, text: '@IntelSlava: "B-2 Spirit overflight Diego Garcia confirmed by multiple ADS-B watchers"' },
  { type: 'HUMINT' as SigintType, text: 'Source ATLAS: Supreme Leader relocated to undisclosed location at conflict onset. IRGC QF Cmdr now coordinating' },
  { type: 'SIGINT' as SigintType, text: 'IRGC Navy fast attack craft comms indicate Strait of Hormuz swarm tactics preparation — 23 vessels tracked' },
  { type: 'CYBER' as SigintType, text: 'Iran state hackers targeting Israel power grid SCADA systems — IEC Unit 8200 countermeasures deployed' },
  { type: 'OSINT' as SigintType, text: '@sentdefender: "PMF Iraq social media activated — Kataib Hezbollah confirming combat alert status"' },
  { type: 'SIGINT' as SigintType, text: 'IRGC Quds Force coordination with Hezbollah and PMF on encrypted channel — third wave coordination assessed' },
  { type: 'HUMINT' as SigintType, text: 'Source CEDAR: Hezbollah Radwan Force at south Lebanon fence positions. Ground operation cannot be excluded.' },
  { type: 'OSINT' as SigintType, text: '@warmonitor: "IDF Northern Command full call-up of reserves — all maneuver brigades at northern border"' },
  { type: 'CYBER' as SigintType, text: 'Cloudflare Radar: Iran internet outage 94% — assessed intentional government shutdown (information control)' },
]

const EXTRA_ENTRIES = [
  { type: 'SIGINT' as SigintType, text: 'USS Eisenhower CSG comm traffic surge — additional strike package preparation assessed' },
  { type: 'OSINT' as SigintType, text: '@intelslava: "Satellite confirms IRGC TEL convoy movement — 7 vehicles near Tabriz"' },
  { type: 'HUMINT' as SigintType, text: 'Source AMBER: Iran Supreme National Security Council emergency session 16:00Z — agenda: 3rd strike wave approval' },
  { type: 'CYBER' as SigintType, text: 'Israeli banking sector DDoS attack repelled — Tel Aviv Stock Exchange temporarily suspended trading' },
]

type FilterType = SigintType | 'ALL'

export default function CommsIntercept() {
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [entries, setEntries] = useState(INITIAL_ENTRIES)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  // Simulate new entries arriving
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused) {
        const random = EXTRA_ENTRIES[Math.floor(Math.random() * EXTRA_ENTRIES.length)]
        setEntries(prev => [{ ...random, text: `[${toShortDTG(new Date())}] ` + random.text }, ...prev.slice(0, 30)])
      }
    }, 12000)
    return () => clearInterval(id)
  }, [paused])

  const filtered = filter === 'ALL' ? entries : entries.filter(e => e.type === filter)

  const FILTER_TABS: FilterType[] = ['ALL', 'SIGINT', 'OSINT', 'HUMINT', 'CYBER']

  return (
    <div className="flex flex-col h-full sigint-terminal">
      {/* Header */}
      <div
        className="flex-shrink-0 px-2 py-1 border-b font-military text-[9px]"
        style={{ borderColor: '#0a2a0c', color: '#00ff41', background: '#010801' }}
      >
        <div className="flex items-center justify-between">
          <span>{'>'} SIGINT/OSINT MONITOR — TS//SI//NOFORN</span>
          <span className="cursor-blink text-[10px]">█</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex border-b flex-shrink-0" style={{ borderColor: '#0a2a0c' }}>
        {FILTER_TABS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="font-military text-[8px] px-2 py-1 flex-1 transition-colors"
            style={{
              color: filter === f ? (SIGINT_COLORS[f as SigintType] || '#00ff41') : '#0a5a0c',
              backgroundColor: filter === f ? 'rgba(0,255,65,0.05)' : 'transparent',
            }}
          >
            {f}
          </button>
        ))}
        <button
          onClick={() => setPaused(!paused)}
          className="font-military text-[8px] px-2 py-1 border-l"
          style={{ color: paused ? '#ffc107' : '#0a5a0c', borderColor: '#0a2a0c' }}
        >
          {paused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      {/* Terminal entries */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1 font-mono-data text-[9px]">
        {filtered.map((entry, idx) => (
          <div key={idx} className="flex gap-2">
            <span
              className="flex-shrink-0 font-military text-[8px]"
              style={{ color: SIGINT_COLORS[entry.type] }}
            >
              [{entry.type}]
            </span>
            <span style={{ color: '#00cc30' }}>
              {entry.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
