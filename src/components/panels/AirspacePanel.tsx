'use client'
import { useEffect, useState, useCallback } from 'react'
import { NOTAM_ENTRIES, AIRLINE_STATUS } from '@/lib/constants'

const NOTAM_COLORS: Record<string, string> = {
  CLOSED: '#ff2d2d', RESTRICTED: '#ff6b35', CAUTION: '#ffc107', NORMAL: '#00e676'
}

const MIL_FLIGHTS = [
  { callsign: 'DOOM21', type: 'B-52H', mission: 'Strike/RTB', status: 'AIRBORNE', origin: 'Al Udeid' },
  { callsign: 'COBRA31', type: 'RC-135W', mission: 'SIGINT', status: 'AIRBORNE', origin: 'Cyprus' },
  { callsign: 'SWIFT41', type: 'KC-135', mission: 'Air Refueling', status: 'AIRBORNE', origin: 'Al Dhafra' },
  { callsign: 'POSEIDON11', type: 'P-8A', mission: 'Maritime Patrol', status: 'AIRBORNE', origin: 'Bahrain' },
  { callsign: 'ATLAS22', type: 'C-17', mission: 'Airlift', status: 'AIRBORNE', origin: 'Dover' },
]

type TabType = 'NOTAM' | 'AIRLINES' | 'MILFLIGHTS'

export default function AirspacePanel() {
  const [tab, setTab] = useState<TabType>('NOTAM')

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b flex-shrink-0" style={{ borderColor: '#1e2d3d' }}>
        {(['NOTAM', 'AIRLINES', 'MILFLIGHTS'] as TabType[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="font-military text-[8px] px-2 py-1.5 flex-1 transition-colors"
            style={{
              color: tab === t ? '#2196f3' : '#4a6a7a',
              backgroundColor: tab === t ? 'rgba(33,150,243,0.08)' : 'transparent',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {tab === 'NOTAM' && (
          <div className="space-y-2">
            <div className="font-military text-[8px] mb-1" style={{ color: '#4a6a7a' }}>
              ICAO NOTAM STATUS — ACTIVE CLOSURES/RESTRICTIONS
            </div>
            {NOTAM_ENTRIES.map(n => (
              <div key={n.firCode} className="border p-1.5 flex items-center gap-2" style={{ borderColor: `${NOTAM_COLORS[n.status]}40` }}>
                <span
                  className="font-military text-[10px] w-12 flex-shrink-0"
                  style={{ color: NOTAM_COLORS[n.status] }}
                >
                  {n.firCode}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-military text-[9px]" style={{ color: '#c8d6e5' }}>{n.fir}</span>
                    <span
                      className="font-military text-[7px] border px-0.5"
                      style={{ color: NOTAM_COLORS[n.status], borderColor: NOTAM_COLORS[n.status] }}
                    >
                      {n.status}
                    </span>
                  </div>
                  <div className="font-mono-data text-[8px]" style={{ color: '#7f8c9b' }}>{n.country} | {n.detail}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'AIRLINES' && (
          <div className="space-y-1.5">
            {AIRLINE_STATUS.map(a => (
              <div key={a.iata} className="border p-1.5" style={{ borderColor: '#1e2d3d' }}>
                <div className="flex items-center justify-between">
                  <span className="font-military text-[9px]" style={{ color: '#c8d6e5' }}>{a.name}</span>
                  <span className="font-military text-[8px] border px-1"
                    style={{ color: a.status === 'SUSPENDED' ? '#ff2d2d' : a.status === 'REROUTING' ? '#ffc107' : '#00e676',
                      borderColor: a.status === 'SUSPENDED' ? '#ff2d2d' : a.status === 'REROUTING' ? '#ffc107' : '#00e676' }}>
                    {a.status}
                  </span>
                </div>
                <div className="font-mono-data text-[8px] mt-0.5" style={{ color: '#7f8c9b' }}>{a.routes}</div>
                {a.extraHours ? (
                  <div className="font-mono-data text-[8px]" style={{ color: '#ffc107' }}>
                    +{a.extraHours}h | ${(a.extraCost || 0).toLocaleString()} extra fuel cost
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {tab === 'MILFLIGHTS' && (
          <div>
            <div className="font-military text-[8px] mb-2" style={{ color: '#4a6a7a' }}>
              MILITARY FLIGHT TRACKER (OpenSky Network) — CLASSIFIED CALLSIGNS
            </div>
            {MIL_FLIGHTS.map(f => (
              <div key={f.callsign} className="border-b py-1.5 flex items-center gap-2" style={{ borderColor: '#1e2d3d' }}>
                <span className="font-military text-[10px] w-20" style={{ color: '#00ff88' }}>{f.callsign}</span>
                <div className="flex-1">
                  <div className="font-military text-[9px]" style={{ color: '#c8d6e5' }}>{f.type}</div>
                  <div className="font-mono-data text-[8px]" style={{ color: '#4a6a7a' }}>{f.mission} | {f.origin}</div>
                </div>
                <span className="font-military text-[8px]" style={{ color: '#2196f3' }}>{f.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
