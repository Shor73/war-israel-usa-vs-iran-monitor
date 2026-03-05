'use client'
import { useEffect, useState } from 'react'
import { toShortDTG } from '@/lib/utils'

const INITIAL_ITEMS = [
  { severity: 'CRITICAL', text: 'Arrow-3 engaging Fattah-1 hypersonic target — Tel Aviv sector — interception successful' },
  { severity: 'CRITICAL', text: 'IRGC TEL convoy movement detected near Tabriz — 3rd wave preparation assessed' },
  { severity: 'ELEVATED', text: 'Hezbollah fires 40+ rockets at northern Israel — Iron Dome activated across Galilee region' },
  { severity: 'ELEVATED', text: 'USS Gravely (DDG-107) reports hostile UAV contact in Red Sea — SM-2 intercept' },
  { severity: 'WATCH', text: 'Iran formally threatens Strait of Hormuz closure if strikes continue — IRGC Navy assets deployed' },
  { severity: 'WATCH', text: 'US Senate approves emergency $8.5B military supplemental for Israel and CENTCOM operations' },
  { severity: 'ELEVATED', text: 'B-2 Spirit sorties continue from Diego Garcia — 3rd consecutive night of operations over Iran' },
  { severity: 'CRITICAL', text: 'Hezbollah Fateh-110 launch detected from Bekaa Valley — David\'s Sling activated' },
  { severity: 'WATCH', text: 'China proposes 72-hour humanitarian pause — US delegation rejects proposal at UN Security Council' },
  { severity: 'ELEVATED', text: 'Brent crude $121.40 (+24.1%) — Hormuz war risk premium surges to 4.2% of hull value' },
  { severity: 'WATCH', text: 'IAEA emergency session convened — Iran refuses inspectors access to Natanz and Fordow sites' },
  { severity: 'ELEVATED', text: 'IDF confirms Nevatim runway partial damage repaired — F-35I operations resumed' },
  { severity: 'WATCH', text: 'Qatar FM in contact with Iranian counterpart — back-channel communication channel active' },
  { severity: 'CRITICAL', text: 'SIGINT: IRGC Aerospace Force encrypted comm spike detected — missile launch preparation assessed' },
  { severity: 'ELEVATED', text: 'PMF (Kataib Hezbollah) in Iraq placed on combat alert — US bases Ain al-Asad and Erbil on REDCON-2' },
]

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#ff2d2d',
  ELEVATED: '#ff6b35',
  WATCH: '#ffc107',
}

const SEVERITY_EMOJI: Record<string, string> = {
  CRITICAL: '🔴',
  ELEVATED: '🟠',
  WATCH: '🟡',
}

export default function IntelTicker() {
  const [dtg, setDtg] = useState('')

  useEffect(() => {
    setDtg(toShortDTG(new Date()))
    const id = setInterval(() => setDtg(toShortDTG(new Date())), 60000)
    return () => clearInterval(id)
  }, [])

  const tickerContent = INITIAL_ITEMS.map((item, i) => (
    <span key={i} className="inline-flex items-center gap-2 mr-12">
      <span className="font-military text-[9px]" style={{ color: '#7f8c9b' }}>{dtg}</span>
      <span className="font-military text-[10px]" style={{ color: SEVERITY_COLORS[item.severity] }}>
        {SEVERITY_EMOJI[item.severity]} [{item.severity}]
      </span>
      <span className="font-military text-[10px]" style={{ color: '#c8d6e5' }}>{item.text}</span>
      <span style={{ color: '#2a4a6b' }}>◆</span>
    </span>
  ))

  return (
    <div
      className="flex items-center overflow-hidden"
      style={{
        background: '#0d1520',
        borderBottom: '1px solid #1e2d3d',
        borderTop: '1px solid #1e2d3d',
        height: '28px',
        gridColumn: '1 / -1',
        gridRow: '2',
      }}
    >
      <div
        className="font-military text-[9px] px-2 flex-shrink-0 border-r"
        style={{ color: '#ff2d2d', borderColor: '#1e2d3d', backgroundColor: 'rgba(255,45,45,0.1)', height: '100%', display: 'flex', alignItems: 'center' }}
      >
        ▶ INTEL
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-scroll flex items-center h-full">
          {tickerContent}
          {tickerContent}
        </div>
      </div>
    </div>
  )
}
