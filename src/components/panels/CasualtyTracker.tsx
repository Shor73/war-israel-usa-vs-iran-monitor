'use client'
import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CASUALTY_DATA, DAILY_CASUALTIES } from '@/lib/missile-data'

type TabId = 'total' | 'byday' | 'humanitarian'

const NATION_COLORS: Record<string, string> = {
  iran: '#ff2d2d', israel: '#2196f3', lebanon: '#ab47bc',
  yemen: '#ffc107', usa: '#00e676', iraq: '#7f8c9b',
}

const HUMANITARIAN = [
  { label: 'Internally Displaced — Israel (North)', value: '250,000+', icon: '🏠', color: '#2196f3' },
  { label: 'Displaced — Lebanon (South + Bekaa)',   value: '400,000+', icon: '🏠', color: '#ab47bc' },
  { label: 'Iranian Civilian Evacuated (strike zones)', value: '180,000+', icon: '🏠', color: '#ff2d2d' },
  { label: 'Yemeni Displaced (US/UK strikes)',       value: '45,000+',  icon: '🏠', color: '#ffc107' },
  { label: 'UN OCHA Status',                         value: 'EMERGENCY L3', icon: '🇺🇳', color: '#ff6b35' },
  { label: 'Red Cross/Red Crescent Access',          value: 'SEVERELY LIMITED', icon: '🏥', color: '#ff6b35' },
  { label: 'Hospitals Under Pressure (IL)',          value: '3 (Haifa, Ashkelon, K. Shmona)', icon: '🏥', color: '#ffc107' },
  { label: 'Hospitals Damaged (IR)',                 value: '7 (Isfahan, Kermanshah, Tehran)', icon: '🏥', color: '#ff2d2d' },
  { label: 'Global Food/Aid Supply Disrupted',       value: 'Hormuz +44% shipping costs', icon: '⚠', color: '#ff6b35' },
  { label: 'ICRC Emergency Appeals',                 value: '$820M (unprecedented 5-day record)', icon: '📋', color: '#c8d6e5' },
]

function TotalTab() {
  const totalKIA = CASUALTY_DATA.reduce((s, c) => s + c.militaryKIA + c.civilianKIA, 0)
  const totalWIA = CASUALTY_DATA.reduce((s, c) => s + c.militaryWIA + c.civilianWIA, 0)
  const milKIA   = CASUALTY_DATA.reduce((s, c) => s + c.militaryKIA, 0)
  const civKIA   = CASUALTY_DATA.reduce((s, c) => s + c.civilianKIA, 0)
  const maxKIA   = Math.max(...CASUALTY_DATA.map(c => c.militaryKIA + c.civilianKIA))

  return (
    <div className="flex h-full min-h-0">
      {/* Left: bars */}
      <div className="flex-1 overflow-y-auto p-3 border-r" style={{ borderColor: '#1e2d3d' }}>
        <div className="font-military text-[8px] mb-3" style={{ color: '#4a6a7a' }}>
          TOTAL KIA BY NATION (MILITARY + CIVILIAN)
        </div>
        {CASUALTY_DATA.map(c => {
          const kia    = c.militaryKIA + c.civilianKIA
          const milPct = kia > 0 ? Math.round((c.militaryKIA / kia) * 100) : 0
          const civPct = 100 - milPct
          const barW   = maxKIA > 0 ? Math.round((kia / maxKIA) * 100) : 0
          return (
            <div key={c.nation} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-military text-[9px]" style={{ color: '#c8d6e5' }}>
                  {c.flag} {c.nation.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-military text-[7px]" style={{ color: '#4a6a7a' }}>{c.role}</span>
                  <span className="font-mono-data text-[9px]" style={{ color: c.color }}>
                    {kia.toLocaleString()} KIA
                  </span>
                </div>
              </div>
              {/* Stacked bar: military (solid) + civilian (dimmer) */}
              <div className="w-full h-3 rounded flex overflow-hidden" style={{ background: '#0d1520' }}>
                <div style={{ width: `${(barW * milPct) / 100}%`, background: c.color }} title={`Military: ${c.militaryKIA}`} />
                <div style={{ width: `${(barW * civPct) / 100}%`, background: `${c.color}55` }} title={`Civilian: ${c.civilianKIA}`} />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="font-military text-[7px]" style={{ color: c.color }}>MIL: {c.militaryKIA.toLocaleString()}</span>
                <span className="font-military text-[7px]" style={{ color: `${c.color}99` }}>CIV: {c.civilianKIA.toLocaleString()}</span>
                <span className="font-military text-[7px]" style={{ color: '#4a6a7a' }}>WIA: {(c.militaryWIA + c.civilianWIA).toLocaleString()}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Right: summary stats */}
      <div className="w-44 flex-shrink-0 p-3 space-y-3">
        <div className="font-military text-[8px] mb-2" style={{ color: '#4a6a7a' }}>AGGREGATE D+5</div>

        {[
          { label: 'TOTAL KIA',     value: totalKIA.toLocaleString(), color: '#ff2d2d' },
          { label: 'TOTAL WIA',     value: totalWIA.toLocaleString(), color: '#ff6b35' },
          { label: 'MILITARY KIA',  value: milKIA.toLocaleString(),   color: '#ffc107' },
          { label: 'CIVILIAN KIA',  value: civKIA.toLocaleString(),   color: '#ab47bc' },
        ].map(s => (
          <div key={s.label} className="border p-2 text-center" style={{ borderColor: `${s.color}30`, background: `${s.color}08` }}>
            <div className="font-mono-data font-bold" style={{ fontSize: 15, color: s.color }}>
              {s.value}
            </div>
            <div className="font-military text-[7px]" style={{ color: '#4a6a7a' }}>{s.label}</div>
          </div>
        ))}

        <div className="border p-2 text-center" style={{ borderColor: '#1e2d3d' }}>
          <div className="font-mono-data text-[9px]" style={{ color: '#c8d6e5' }}>
            {civKIA > 0 && milKIA > 0 ? (civKIA / milKIA).toFixed(1) : '—'}:1
          </div>
          <div className="font-military text-[7px]" style={{ color: '#4a6a7a' }}>CIV / MIL RATIO</div>
        </div>

        <div className="border p-2" style={{ borderColor: '#1e2d3d' }}>
          <div className="font-military text-[7px] mb-1" style={{ color: '#4a6a7a' }}>■ MILITARY  ░ CIVILIAN</div>
          <div className="font-military text-[7px]" style={{ color: '#7f8c9b' }}>
            Bars show KIA proportion. Darker = military, lighter = civilian collateral.
          </div>
        </div>
      </div>
    </div>
  )
}

function ByDayTab() {
  const [view, setView] = useState<'kia' | 'total'>('kia')

  const chartData = DAILY_CASUALTIES.map(d => ({
    name: d.label,
    Iran: d.iran,
    Israel: d.israel,
    Lebanon: d.lebanon,
    USA: d.usa,
    Yemen: d.yemen,
    Total: d.total,
  }))

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
    if (!active || !payload) return null
    return (
      <div className="border p-2 text-[8px]" style={{ background: '#0d1520', borderColor: '#2a4a6b' }}>
        <div className="font-military mb-1" style={{ color: '#c8d6e5' }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value.toLocaleString()}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b flex-shrink-0" style={{ borderColor: '#1e2d3d' }}>
        <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>DISPLAY:</span>
        {(['kia', 'total'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="font-military text-[7px] border px-2 py-0.5 transition-colors"
            style={{
              color: view === v ? '#00e676' : '#4a6a7a',
              borderColor: view === v ? '#00e676' : '#2a4a6b',
              background: view === v ? 'rgba(0,230,118,0.08)' : 'transparent',
            }}
          >
            {v === 'kia' ? 'PER NATION KIA' : 'DAILY TOTAL'}
          </button>
        ))}
        <span className="ml-auto font-military text-[7px]" style={{ color: '#4a6a7a' }}>CUMULATIVE — D+0 → D+5</span>
      </div>

      <div className="flex-1 p-2 min-h-0">
        {view === 'total' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff2d2d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff2d2d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#4a6a7a', fontSize: 8, fontFamily: 'Share Tech Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a6a7a', fontSize: 8, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Total" stroke="#ff2d2d" fill="url(#gradTotal)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                {Object.entries(NATION_COLORS).map(([nation, color]) => (
                  <linearGradient key={nation} id={`grad_${nation}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#4a6a7a', fontSize: 8, fontFamily: 'Share Tech Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a6a7a', fontSize: 8, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 8, fontFamily: 'Share Tech Mono', color: '#4a6a7a' }} />
              <Area type="monotone" dataKey="Iran"    stroke={NATION_COLORS.iran}    fill={`url(#grad_iran)`}    strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="Israel"  stroke={NATION_COLORS.israel}  fill={`url(#grad_israel)`}  strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="Lebanon" stroke={NATION_COLORS.lebanon} fill={`url(#grad_lebanon)`} strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="Yemen"   stroke={NATION_COLORS.yemen}   fill={`url(#grad_yemen)`}   strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="USA"     stroke={NATION_COLORS.usa}     fill={`url(#grad_usa)`}     strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex-shrink-0 border-t px-3 py-1" style={{ borderColor: '#1e2d3d' }}>
        <div className="flex gap-4">
          {[
            { label: 'D+2: Hezbollah enters conflict', color: '#ab47bc' },
            { label: 'D+3: 3rd Iran missile wave', color: '#ff2d2d' },
            { label: 'D+3: Peak daily casualties', color: '#ffc107' },
          ].map(n => (
            <span key={n.label} className="font-military text-[7px]" style={{ color: n.color }}>▲ {n.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function HumanitarianTab() {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 space-y-2">
      <div className="font-military text-[8px] mb-1" style={{ color: '#4a6a7a' }}>
        HUMANITARIAN SITUATION — UN OCHA ASSESSMENT — D+5
      </div>
      {HUMANITARIAN.map((h, i) => (
        <div
          key={i}
          className="flex items-start gap-2 border p-2"
          style={{ borderColor: `${h.color}25`, background: `${h.color}06` }}
        >
          <span style={{ fontSize: 12 }}>{h.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-military text-[7px]" style={{ color: '#7f8c9b' }}>{h.label}</div>
            <div className="font-military text-[9px] mt-0.5" style={{ color: h.color }}>{h.value}</div>
          </div>
        </div>
      ))}

      <div className="mt-2 border p-2" style={{ borderColor: '#1e2d3d' }}>
        <div className="font-military text-[7px] mb-1" style={{ color: '#4a6a7a' }}>SOURCE CLASSIFICATION</div>
        <div className="font-military text-[7px]" style={{ color: '#7f8c9b' }}>
          Data aggregated from UN OCHA, ICRC, WHO, UNHCR, Médecins Sans Frontières field reports.
          Casualty figures are best estimates — ground access severely limited in active conflict zones.
          All data reflects D+5 (05 MAR 2026) assessment.
        </div>
      </div>
    </div>
  )
}

export default function CasualtyTracker() {
  const [tab, setTab] = useState<TabId>('total')

  const TABS: { id: TabId; label: string; color: string }[] = [
    { id: 'total',        label: 'TOTAL CASUALTIES', color: '#ff2d2d' },
    { id: 'byday',        label: 'DAILY PROGRESSION', color: '#ffc107' },
    { id: 'humanitarian', label: 'HUMANITARIAN',      color: '#2196f3' },
  ]

  return (
    <div className="flex flex-col h-full" style={{ background: '#0a0e14' }}>
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b"
        style={{ borderColor: '#1e2d3d', background: '#0d1520' }}
      >
        <span className="font-military text-[10px]" style={{ color: '#ff2d2d' }}>
          CASUALTY TRACKER — ALL THEATERS
        </span>
        <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>
          D+5 · EST. FROM FIELD REPORTS + SIGINT
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-shrink-0 border-b" style={{ borderColor: '#1e2d3d' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="font-military text-[8px] px-3 py-1.5 flex-1 transition-colors"
            style={{
              color: tab === t.id ? t.color : '#4a6a7a',
              backgroundColor: tab === t.id ? `${t.color}10` : 'transparent',
              borderBottom: tab === t.id ? `1px solid ${t.color}` : '1px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === 'total'        && <TotalTab />}
        {tab === 'byday'        && <ByDayTab />}
        {tab === 'humanitarian' && <HumanitarianTab />}
      </div>
    </div>
  )
}
