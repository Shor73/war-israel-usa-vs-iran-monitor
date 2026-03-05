'use client'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line } from 'recharts'
import { STRIKE_GROUPS, DAILY_STRIKES, INTERCEPTION_COSTS } from '@/lib/missile-data'
import { Flag, ACTOR_ISO } from '@/components/ui/Flag'

const ACTOR_COLORS: Record<string, string> = {
  Iran: '#ff5722', IDF: '#2196f3', USA: '#00e676', Hezbollah: '#ffd700', Houthi: '#ab47bc'
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="border p-2 font-mono-data text-[9px]" style={{ background: '#0d1520', borderColor: '#2a4a6b' }}>
      <div className="font-military text-[10px] mb-1" style={{ color: '#00ff88' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

type TabType = 'DAILY' | 'BREAKDOWN' | 'INTERCEPT' | 'COST' | 'TABLE'

export default function MissileStats() {
  const [tab, setTab] = useState<TabType>('DAILY')
  const TABS: TabType[] = ['DAILY', 'BREAKDOWN', 'INTERCEPT', 'COST', 'TABLE']

  const summaryData = STRIKE_GROUPS.map(g => ({
    name: g.actor,
    launched: g.totalLaunched,
    intercepted: g.totalIntercepted,
    hit: g.totalHit,
    rate: g.overallHitRate.toFixed(1),
  }))

  const interceptData = STRIKE_GROUPS.slice(0, 3).map(g => ({
    name: g.actor,
    value: g.totalIntercepted,
  }))

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b flex-shrink-0" style={{ borderColor: '#1e2d3d' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="font-military text-[8px] px-3 py-1.5 flex-1 transition-colors"
            style={{
              color: tab === t ? '#00ff88' : '#4a6a7a',
              backgroundColor: tab === t ? 'rgba(0,255,136,0.08)' : 'transparent',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {/* Totals bar */}
        <div className="flex gap-3 mb-3">
          {STRIKE_GROUPS.map(g => (
            <div key={g.actor} className="flex-1 border p-1.5 text-center" style={{ borderColor: '#1e2d3d' }}>
              <div className="font-military text-[8px] flex items-center justify-center gap-1" style={{ color: ACTOR_COLORS[g.actor] }}>
                {ACTOR_ISO[g.actor] && <Flag iso={ACTOR_ISO[g.actor]} size={12} />}
                {g.actor}
              </div>
              <div className="font-military text-sm" style={{ color: '#c8d6e5' }}>{g.totalLaunched}</div>
              <div className="font-mono-data text-[8px]" style={{ color: '#4a6a7a' }}>{g.overallHitRate.toFixed(0)}% hit</div>
            </div>
          ))}
        </div>

        {tab === 'DAILY' && (
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={DAILY_STRIKES} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: '#4a6a7a', fontSize: 8 }} />
              <YAxis tick={{ fill: '#4a6a7a', fontSize: 8 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="iran" name="Iran" fill="#ff5722" stackId="a" />
              <Bar dataKey="idf" name="IDF" fill="#2196f3" stackId="a" />
              <Bar dataKey="usa" name="USA" fill="#00e676" stackId="a" />
              <Bar dataKey="hezbollah" name="Hezbollah" fill="#ffd700" stackId="a" />
              <Bar dataKey="houthi" name="Houthi" fill="#ab47bc" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {tab === 'BREAKDOWN' && (
          <div className="space-y-1">
            {STRIKE_GROUPS[0].systems.map(s => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="font-military text-[9px] w-28 truncate" style={{ color: '#9ab0c0' }}>{s.name}</span>
                <div className="flex-1 h-3 rounded-sm overflow-hidden" style={{ background: '#0d1520' }}>
                  <div
                    className="h-full"
                    style={{
                      width: `${(s.launched / 85) * 100}%`,
                      background: `linear-gradient(90deg, #ff5722, #ff572260)`,
                    }}
                  />
                </div>
                <span className="font-military text-[8px] w-12 text-right" style={{ color: '#ff5722' }}>
                  {s.launched} ({s.hitRate.toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'INTERCEPT' && (
          <div>
            <div className="font-military text-[9px] mb-2" style={{ color: '#7f8c9b' }}>Iran/HEZ/Houthi missiles INTERCEPTED by system:</div>
            {[
              { system: 'Arrow-3', count: 14, color: '#2196f3' },
              { system: 'Arrow-2', count: 51, color: '#00e676' },
              { system: "David's Sling", count: 6, color: '#ffc107' },
              { system: 'Iron Dome', count: 179, color: '#00ff88' },
              { system: 'Patriot PAC-3', count: 8, color: '#ab47bc' },
              { system: 'SM-2 / SM-6 (USN)', count: 5, color: '#1a73e8' },
            ].map(({ system, count, color }) => (
              <div key={system} className="flex items-center gap-2 mb-1.5">
                <span className="font-military text-[9px] w-32" style={{ color }}>{system}</span>
                <div className="flex-1 h-3" style={{ background: '#0d1520' }}>
                  <div className="h-full" style={{ width: `${(count / 179) * 100}%`, background: color, opacity: 0.7 }} />
                </div>
                <span className="font-military text-[9px] w-8 text-right" style={{ color }}>{count}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'COST' && (
          <div>
            <div className="font-military text-[9px] mb-2" style={{ color: '#ffc107' }}>⚠ BURN RATE — Cost per intercept</div>
            {INTERCEPTION_COSTS.map(c => (
              <div key={c.system} className="border-b py-1.5 flex items-center gap-2" style={{ borderColor: '#1e2d3d' }}>
                <div className="flex-1">
                  <div className="font-military text-[10px]" style={{ color: '#c8d6e5' }}>{c.system}</div>
                  <div className="font-mono-data text-[8px]" style={{ color: '#4a6a7a' }}>{c.target}</div>
                </div>
                <div className="text-right">
                  <div className="font-military text-[10px]" style={{ color: '#ffc107' }}>
                    ${(c.cost / 1000000).toFixed(1)}M
                  </div>
                  <div className="font-mono-data text-[8px]" style={{ color: '#4a6a7a' }}>{c.operator}</div>
                </div>
              </div>
            ))}
            <div className="mt-2 p-2 border" style={{ borderColor: '#ff2d2d30', background: 'rgba(255,45,45,0.05)' }}>
              <div className="font-military text-[9px]" style={{ color: '#ff6b35' }}>
                ⚡ ECONOMIC NOTE: Iran spends ~$800 per Shahed-136. Israel/USA spend $50K–$4M per intercept. Attrition warfare economics heavily favor attacker at volume.
              </div>
            </div>
          </div>
        )}

        {tab === 'TABLE' && (
          <div className="overflow-x-auto">
            <table className="w-full font-mono-data text-[8px]">
              <thead>
                <tr style={{ borderBottom: '1px solid #1e2d3d' }}>
                  {['Actor', 'System', 'Type', 'Launched', 'Hit', 'Hit%'].map(h => (
                    <th key={h} className="font-military text-left py-1 px-1" style={{ color: '#4a6a7a' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STRIKE_GROUPS.flatMap(g => g.systems.map((s, i) => (
                  <tr key={`${g.actor}-${i}`} className="hover:bg-white/5" style={{ borderBottom: '1px solid #0d1520' }}>
                    <td className="py-0.5 px-1 font-military text-[8px]" style={{ color: ACTOR_COLORS[g.actor] }}>{i === 0 ? g.actor : ''}</td>
                    <td className="py-0.5 px-1" style={{ color: '#9ab0c0' }}>{s.name}</td>
                    <td className="py-0.5 px-1" style={{ color: '#4a6a7a' }}>{s.type}</td>
                    <td className="py-0.5 px-1 text-right" style={{ color: '#c8d6e5' }}>{s.launched}</td>
                    <td className="py-0.5 px-1 text-right" style={{ color: '#c8d6e5' }}>{s.hit}</td>
                    <td className="py-0.5 px-1 text-right" style={{ color: s.hitRate > 50 ? '#ff2d2d' : '#00e676' }}>
                      {s.hitRate.toFixed(0)}%
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
