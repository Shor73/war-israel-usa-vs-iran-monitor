'use client'
import { useEffect, useState, useCallback } from 'react'
import { CHOKEPOINTS, DEFENSE_STOCKS, AIRLINE_STATUS } from '@/lib/constants'
import type { OilPrice, StockQuote } from '@/lib/types'

const SECTION_TABS = ['OIL', 'STOCKS', 'CHOKEPOINTS', 'AIRLINES', 'SANCTIONS']

const CHOKEPOINT_STATUS_COLORS: Record<string, string> = {
  OPEN: '#00e676', RESTRICTED: '#ffc107', HOSTILE: '#ff6b35', CLOSED: '#ff2d2d'
}

const STANCE_COLORS: Record<string, string> = {
  SUSPENDED: '#ff2d2d', REROUTING: '#ffc107', NORMAL: '#00e676', ENHANCED: '#2196f3'
}

const SANCTIONS_TIMELINE = [
  { date: '2018-05', event: 'US withdraws from JCPOA — maximum pressure campaign begins', actor: 'USA' },
  { date: '2019-06', event: 'SWIFT exclusion extended to Central Bank of Iran', actor: 'USA/EU' },
  { date: '2020-01', event: 'All UN sanctions snapback invoked', actor: 'USA' },
  { date: '2022-03', event: 'EU sanctions expanded: tech, aviation, individuals', actor: 'EU' },
  { date: '2024-10', event: 'BIS foreign direct product rule applied to Iran tech sector', actor: 'USA' },
  { date: '2026-02-28', event: '🔴 WARTIME: Emergency sanctions package — full banking, oil, aviation', actor: 'USA/EU/UK/AU/CA' },
  { date: '2026-03-01', event: 'G7 emergency sanctions coordination — secondary sanctions threatened', actor: 'G7' },
  { date: '2026-03-02', event: 'Asset freeze orders: IRGC and all IRGC-linked entities', actor: 'USA/EU' },
]

export default function EconomicImpact() {
  const [tab, setTab] = useState('OIL')
  const [oils, setOils] = useState<OilPrice[]>([])
  const [stocks, setStocks] = useState<StockQuote[]>([])

  const fetchOil = useCallback(async () => {
    try {
      const res = await fetch('/api/oil')
      if (res.ok) setOils(await res.json())
    } catch { /* ignore */ }
  }, [])

  const fetchStocks = useCallback(async () => {
    try {
      const res = await fetch('/api/markets')
      if (res.ok) setStocks(await res.json())
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchOil()
    fetchStocks()
    const oilId = setInterval(fetchOil, 5 * 60 * 1000)
    const stockId = setInterval(fetchStocks, 5 * 60 * 1000)
    return () => { clearInterval(oilId); clearInterval(stockId) }
  }, [fetchOil, fetchStocks])

  return (
    <div className="flex flex-col h-full">
      {/* Section tabs */}
      <div className="flex border-b flex-shrink-0" style={{ borderColor: '#1e2d3d' }}>
        {SECTION_TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="font-military text-[8px] px-2 py-1.5 flex-1 transition-colors"
            style={{
              color: tab === t ? '#ffc107' : '#4a6a7a',
              backgroundColor: tab === t ? 'rgba(255,193,7,0.08)' : 'transparent',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {tab === 'OIL' && (
          <div className="space-y-2">
            <div className="font-military text-[8px] mb-2" style={{ color: '#4a6a7a' }}>
              ⚠ POST-28 FEB 2026 WAR PRICES — Pre-war Brent: ~$97/bbl
            </div>
            {oils.length > 0 ? oils.map(o => (
              <div key={o.symbol} className="border p-2 flex items-center justify-between" style={{ borderColor: '#1e2d3d' }}>
                <div>
                  <div className="font-military text-[10px]" style={{ color: '#c8d6e5' }}>{o.name}</div>
                  <div className="font-mono-data text-[8px]" style={{ color: '#4a6a7a' }}>{o.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="font-military text-sm" style={{ color: '#ffc107' }}>${o.price.toFixed(2)}</div>
                  <div className="font-mono-data text-[9px]" style={{ color: o.changePercent >= 0 ? '#ff2d2d' : '#00e676' }}>
                    {o.changePercent >= 0 ? '+' : ''}{o.changePercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-3 border" style={{ borderColor: '#1e2d3d' }}>
                {/* Fallback hardcoded */}
                {[
                  { name: 'Brent Crude', symbol: 'BZ=F', price: 121.45, pct: 24.1 },
                  { name: 'WTI Crude', symbol: 'CL=F', price: 117.20, pct: 22.8 },
                  { name: 'Natural Gas', symbol: 'NG=F', price: 5.82, pct: 34.7 },
                  { name: 'Kerosene/Jet-A', symbol: 'HO=F', price: 3.89, pct: 28.4 },
                ].map(o => (
                  <div key={o.symbol} className="flex justify-between py-1 border-b" style={{ borderColor: '#0d1520' }}>
                    <span className="font-military text-[9px]" style={{ color: '#9ab0c0' }}>{o.name}</span>
                    <span className="font-military text-[10px]" style={{ color: '#ffc107' }}>${o.price.toFixed(2)} <span style={{ color: '#ff2d2d' }}>+{o.pct}%</span></span>
                  </div>
                ))}
              </div>
            )}
            <div className="border p-2" style={{ borderColor: '#ff2d2d30', background: 'rgba(255,45,45,0.05)' }}>
              <div className="font-military text-[8px]" style={{ color: '#ff6b35' }}>
                WAR RISK PREMIUM — Strait of Hormuz: +4.2% hull value (pre-war: +0.5%)
              </div>
              <div className="font-military text-[8px] mt-1" style={{ color: '#7f8c9b' }}>
                Baltic Dry Index: -8.4% | LNG spot: +35.2% | VLCC daily rate: $95,000 (+340%)
              </div>
            </div>
          </div>
        )}

        {tab === 'STOCKS' && (
          <div className="space-y-1">
            <div className="grid grid-cols-3 font-military text-[8px] border-b pb-1 mb-1" style={{ color: '#4a6a7a', borderColor: '#1e2d3d' }}>
              <span>Symbol</span><span className="text-right">Price</span><span className="text-right">%</span>
            </div>
            {stocks.length > 0 ? stocks.map(s => (
              <div key={s.symbol} className="grid grid-cols-3 font-mono-data text-[9px] py-0.5 border-b" style={{ borderColor: '#0d1520' }}>
                <div>
                  <div className="font-military text-[9px]" style={{ color: s.sector === 'defense' ? '#2196f3' : '#ff6b35' }}>{s.symbol}</div>
                  <div className="text-[7px]" style={{ color: '#4a6a7a' }}>{s.name.split('(')[0].trim()}</div>
                </div>
                <span className="text-right" style={{ color: '#c8d6e5' }}>${s.price.toFixed(2)}</span>
                <span className="text-right" style={{ color: s.changePercent >= 0 ? '#00e676' : '#ff2d2d' }}>
                  {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(1)}%
                </span>
              </div>
            )) : (
              DEFENSE_STOCKS.slice(0, 7).map(s => (
                <div key={s.symbol} className="flex justify-between py-0.5 border-b" style={{ borderColor: '#0d1520' }}>
                  <span className="font-military text-[9px]" style={{ color: s.sector === 'defense' ? '#2196f3' : '#ff6b35' }}>{s.symbol}</span>
                  <span className="font-mono-data text-[8px]" style={{ color: '#00e676' }}>+{(8 + Math.random() * 6).toFixed(1)}%</span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'CHOKEPOINTS' && (
          <div className="space-y-2">
            {CHOKEPOINTS.map(cp => (
              <div key={cp.id} className="border p-2" style={{ borderColor: `${CHOKEPOINT_STATUS_COLORS[cp.status]}40` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-military text-[10px]" style={{ color: '#c8d6e5' }}>{cp.name}</span>
                  <span
                    className="font-military text-[8px] border px-1"
                    style={{ color: CHOKEPOINT_STATUS_COLORS[cp.status], borderColor: CHOKEPOINT_STATUS_COLORS[cp.status] }}
                  >
                    {cp.status}
                  </span>
                </div>
                <div className="font-mono-data text-[8px]" style={{ color: '#ffc107' }}>
                  {cp.dailyTrafficMMBD} MMBD daily traffic
                </div>
                <div className="font-mono-data text-[8px] mt-0.5" style={{ color: '#7f8c9b' }}>{cp.detail}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'AIRLINES' && (
          <div className="space-y-1.5">
            {AIRLINE_STATUS.map(a => (
              <div key={a.iata} className="border p-1.5" style={{ borderColor: '#1e2d3d' }}>
                <div className="flex items-center justify-between">
                  <span className="font-military text-[10px]" style={{ color: '#c8d6e5' }}>{a.name} ({a.iata})</span>
                  <span
                    className="font-military text-[8px] border px-1"
                    style={{ color: STANCE_COLORS[a.status], borderColor: STANCE_COLORS[a.status] }}
                  >
                    {a.status}
                  </span>
                </div>
                <div className="font-mono-data text-[8px] mt-0.5" style={{ color: '#7f8c9b' }}>{a.routes}</div>
                {a.extraCost && (
                  <div className="font-mono-data text-[8px]" style={{ color: '#ffc107' }}>
                    Extra cost: ~${a.extraCost.toLocaleString()}/flight | +{a.extraHours}h flight time
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'SANCTIONS' && (
          <div className="space-y-1.5">
            {SANCTIONS_TIMELINE.map((s, i) => (
              <div key={i} className="flex gap-2 border-b pb-1.5" style={{ borderColor: '#1e2d3d' }}>
                <div className="flex-shrink-0 font-military text-[8px] w-20" style={{ color: '#4a6a7a' }}>{s.date}</div>
                <div className="flex-1">
                  <div className="font-mono-data text-[9px]" style={{ color: '#c8d6e5' }}>{s.event}</div>
                  <div className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>{s.actor}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
