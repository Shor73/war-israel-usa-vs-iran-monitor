'use client'
import { STRIKE_GROUPS, ARSENAL_STATUS, DEFENSE_AMMO_STATUS, CASUALTY_DATA } from '@/lib/missile-data'

// ── Computed totals from live data ───────────────────────────────────────────
function computeSummary() {
  const enemy   = STRIKE_GROUPS.filter(g => ['Iran', 'Hezbollah', 'Houthi'].includes(g.actor))
  const coalition = STRIKE_GROUPS.filter(g => ['IDF', 'USA'].includes(g.actor))

  const eLaunched     = enemy.reduce((s, g) => s + g.totalLaunched, 0)
  const eIntercepted  = enemy.reduce((s, g) => s + g.totalIntercepted, 0)
  const cLaunched     = coalition.reduce((s, g) => s + g.totalLaunched, 0)
  const cHit          = coalition.reduce((s, g) => s + g.totalHit, 0)

  const totalAll        = eLaunched + cLaunched
  const enemyInterceptPct = eLaunched > 0 ? ((eIntercepted / eLaunched) * 100).toFixed(1) : '0.0'
  const coalitionSuccessPct = cLaunched > 0 ? ((cHit / cLaunched) * 100).toFixed(1) : '0.0'

  const totalKIA = CASUALTY_DATA.reduce((s, c) => s + c.militaryKIA + c.civilianKIA, 0)
  const totalWIA = CASUALTY_DATA.reduce((s, c) => s + c.militaryWIA + c.civilianWIA, 0)

  return { totalAll, eLaunched, eIntercepted, enemyInterceptPct, coalitionSuccessPct, cLaunched, cHit, totalKIA, totalWIA }
}

const S = computeSummary()

function AmmoBar({ pct, color, status }: { pct: number; color: string; status: string }) {
  const statusColor = status === 'CRITICAL' ? '#ff2d2d' : status === 'LOW' ? '#ff6b35' : status === 'FULL' ? '#00e676' : '#2196f3'
  return (
    <div className="flex items-center gap-1">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#0d1520' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono-data text-[8px] w-7 text-right flex-shrink-0" style={{ color }}>
        {pct}%
      </span>
      <span className="font-military text-[7px] w-14 flex-shrink-0" style={{ color: statusColor }}>
        {status}
      </span>
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="border flex flex-col items-center justify-center py-2 px-1" style={{ borderColor: `${color}30`, background: `${color}08` }}>
      <div className="font-military text-[7px] mb-1" style={{ color: '#4a6a7a' }}>{label}</div>
      <div className="font-mono-data font-bold" style={{ fontSize: 18, color }}>{value}</div>
      {sub && <div className="font-military text-[7px] mt-0.5" style={{ color: '#4a6a7a' }}>{sub}</div>}
    </div>
  )
}

export default function WarSummary() {
  const allArsenal = [
    ARSENAL_STATUS.Iran.mrbm,
    ARSENAL_STATUS.Iran.drones,
    ARSENAL_STATUS.Iran.fattah1,
    ARSENAL_STATUS.Hezbollah.rockets,
    ARSENAL_STATUS.Houthi.missiles,
  ]

  const totalKIA = CASUALTY_DATA.reduce((s, c) => s + c.militaryKIA + c.civilianKIA, 0)
  const maxKIA = Math.max(...CASUALTY_DATA.map(c => c.militaryKIA + c.civilianKIA))

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#0a0e14' }}>
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b"
        style={{ borderColor: '#1e2d3d', background: '#0d1520' }}
      >
        <span className="font-military text-[10px]" style={{ color: '#00ff88' }}>
          CONFLICT OVERVIEW — OPERATION ULTIMATUM — D+5
        </span>
        <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>
          28 FEB → 05 MAR 2026 · ALL THEATERS
        </span>
      </div>

      {/* Top stat cards */}
      <div className="flex-shrink-0 grid gap-1 p-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <StatCard label="TOTAL PROJECTILES" value={S.totalAll.toLocaleString()} sub="all actors" color="#c8d6e5" />
        <StatCard label="ENEMY INTERCEPT%" value={`${S.enemyInterceptPct}%`} sub={`${S.eIntercepted.toLocaleString()} of ${S.eLaunched.toLocaleString()}`} color="#ffc107" />
        <StatCard label="COALITION STRIKE%" value={`${S.coalitionSuccessPct}%`} sub={`${S.cHit} hits of ${S.cLaunched}`} color="#00e676" />
        <StatCard label="ATTACK WAVES" value="31" sub="all actors" color="#ff6b35" />
        <StatCard label="DAYS OF CONFLICT" value="5" sub="28 Feb → 05 Mar" color="#2196f3" />
      </div>

      {/* Middle: 2 columns */}
      <div className="flex-1 grid min-h-0" style={{ gridTemplateColumns: '1fr 1fr' }}>

        {/* LEFT — Enemy Arsenal Depletion */}
        <div className="border-r overflow-y-auto p-2" style={{ borderColor: '#1e2d3d' }}>
          <div className="font-military text-[8px] mb-2 pb-1 border-b" style={{ color: '#4a6a7a', borderColor: '#1e2d3d' }}>
            ENEMY ARSENAL — % REMAINING (D+5 EST.)
          </div>
          <div className="space-y-2">
            {allArsenal.map(a => (
              <div key={a.label}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-military text-[7px]" style={{ color: a.color }}>{a.label}</span>
                  <span className="font-mono-data text-[7px]" style={{ color: '#7f8c9b' }}>
                    ~{a.remaining.toLocaleString()} left
                  </span>
                </div>
                <AmmoBar pct={a.pct} color={a.color}
                  status={a.pct <= 40 ? 'CRITICAL' : a.pct <= 60 ? 'LOW' : a.pct >= 95 ? 'FULL' : 'NOMINAL'} />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="font-military text-[8px] mt-3 mb-2 pb-1 border-b" style={{ color: '#4a6a7a', borderColor: '#1e2d3d' }}>
            PROJECTILES BREAKDOWN
          </div>
          {STRIKE_GROUPS.map(g => {
            const interceptColor = g.actor === 'IDF' || g.actor === 'USA' ? '#00e676' : '#ffc107'
            const hitColor       = g.actor === 'IDF' || g.actor === 'USA' ? '#00e676' : '#ff2d2d'
            return (
              <div key={g.actor} className="flex items-center gap-1 mb-1">
                <span className="font-military text-[7px] w-16 flex-shrink-0" style={{ color: '#c8d6e5' }}>{g.actor}</span>
                <span className="font-mono-data text-[8px] w-8 text-right flex-shrink-0" style={{ color: '#c8d6e5' }}>{g.totalLaunched}</span>
                <span className="font-military text-[7px] flex-shrink-0" style={{ color: '#4a6a7a' }}>→</span>
                <span className="font-mono-data text-[8px] flex-shrink-0" style={{ color: interceptColor }}>
                  {g.actor === 'IDF' || g.actor === 'USA'
                    ? `${g.overallHitRate}% HIT`
                    : `${((g.totalIntercepted / g.totalLaunched) * 100).toFixed(0)}% INTC`}
                </span>
              </div>
            )
          })}
        </div>

        {/* RIGHT — Defense Ammo + Casualties */}
        <div className="flex flex-col overflow-hidden">

          {/* Defense ammo status */}
          <div className="flex-shrink-0 p-2 border-b" style={{ borderColor: '#1e2d3d' }}>
            <div className="font-military text-[8px] mb-2" style={{ color: '#4a6a7a' }}>
              DEFENSE AMMO STATUS — MULTILAYER
            </div>
            <div className="space-y-1.5">
              {DEFENSE_AMMO_STATUS.map(d => (
                <div key={d.system}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-military text-[7px]" style={{ color: '#c8d6e5' }}>{d.system}</span>
                    <span className="font-military text-[7px]" style={{ color: '#4a6a7a' }}>{d.operator}</span>
                  </div>
                  <AmmoBar pct={d.pct} color={d.color} status={d.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Casualties summary */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="font-military text-[8px] mb-2" style={{ color: '#4a6a7a' }}>
              CASUALTIES BY NATION — KIA + WIA (D+5 EST.)
            </div>

            {/* Total counter */}
            <div className="flex gap-3 mb-2 border p-1.5" style={{ borderColor: '#ff2d2d30', background: 'rgba(255,45,45,0.05)' }}>
              <div className="text-center flex-1">
                <div className="font-mono-data font-bold text-[15px]" style={{ color: '#ff2d2d' }}>
                  {totalKIA.toLocaleString()}
                </div>
                <div className="font-military text-[7px]" style={{ color: '#4a6a7a' }}>TOTAL KIA</div>
              </div>
              <div className="text-center flex-1">
                <div className="font-mono-data font-bold text-[15px]" style={{ color: '#ff6b35' }}>
                  {S.totalWIA.toLocaleString()}
                </div>
                <div className="font-military text-[7px]" style={{ color: '#4a6a7a' }}>TOTAL WIA</div>
              </div>
            </div>

            {CASUALTY_DATA.map(c => {
              const kia  = c.militaryKIA + c.civilianKIA
              const wia  = c.militaryWIA + c.civilianWIA
              const barW = maxKIA > 0 ? Math.round((kia / maxKIA) * 100) : 0
              return (
                <div key={c.nation} className="mb-1.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-military text-[8px]" style={{ color: '#c8d6e5' }}>
                      {c.flag} {c.nation.toUpperCase()}
                    </span>
                    <span className="font-mono-data text-[8px]" style={{ color: '#4a6a7a' }}>
                      {kia.toLocaleString()} KIA · {wia.toLocaleString()} WIA
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: '#0d1520' }}>
                    <div className="h-full rounded-full" style={{ width: `${barW}%`, background: c.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
