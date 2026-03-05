'use client'
import { useState, useEffect } from 'react'
import { toShortDTG } from '@/lib/utils'
import { LiveDot } from '@/components/ui/ClassifiedBadge'
import type { OpsType } from '@/lib/types'
import { Flag, ACTOR_ISO } from '@/components/ui/Flag'
import { militaryDTG } from '@/lib/war-time'

const OPS_COLORS: Record<string, string> = {
  STRIKE: '#ff2d2d', INTERCEPT: '#00e676', LAUNCH: '#ff6b35',
  RECON: '#2196f3', NAVAL: '#00bcd4', CYBER: '#ab47bc', DIPLOMATIC: '#ffc107',
}

// Entries with offsets in minutes from "now" — always current timestamps
const ENTRY_TEMPLATES = [
  { type: 'LAUNCH',     location: 'Tabriz, Iran',           description: 'Fattah-2 hypersonic MRBM detected — trajectory Israel',          status: 'TRACKING',     actor: 'IRGC',       offset: 4  },
  { type: 'INTERCEPT',  location: 'Haifa sector',           description: 'Arrow-3 vs Fattah-2 hypersonic — intercept SUCCESSFUL',           status: 'SUCCESS',      actor: 'IDF',        offset: 8  },
  { type: 'STRIKE',     location: 'N. Tehran, Iran',        description: 'JASSM-ER package from B-52H — IRGC Aerospace HQ targeted',        status: 'BDA PENDING',  actor: 'USAF',       offset: 14 },
  { type: 'LAUNCH',     location: 'S. Lebanon border',      description: 'Hezbollah Fajr-5 barrage — 18 rockets Galilee/Haifa',             status: 'ACTIVE',       actor: 'HEZ',        offset: 19 },
  { type: 'INTERCEPT',  location: 'Tel Aviv sector',        description: 'Iron Dome engages Shahed-238 swarm — 14/18 neutralized',          status: 'PARTIAL',      actor: 'IDF',        offset: 23 },
  { type: 'NAVAL',      location: 'Strait of Hormuz',       description: 'USS Cole SM-3 Block IIA fires vs Iranian MRBM — CONFIRMED HIT',   status: 'SUCCESS',      actor: 'USN',        offset: 31 },
  { type: 'RECON',      location: 'Eastern Med / Cyprus',   description: 'RC-135W Rivet Joint — SIGINT collection, IRGC Quds comms',        status: 'AIRBORNE',     actor: 'USAF',       offset: 38 },
  { type: 'STRIKE',     location: 'Bekaa Valley, Lebanon',  description: "IDF F-35I — Hezbollah rocket storage complex, 3° det",            status: 'COMPLETED',    actor: 'IDF',        offset: 45 },
  { type: 'CYBER',      location: 'Cyberspace',             description: 'APT33 (IRGC) DDoS on Israeli power grid SCADA — Unit 8200 blocks', status: 'REPELLED',    actor: 'IRGC',       offset: 52 },
  { type: 'LAUNCH',     location: 'Hudaydah, Yemen',        description: 'Houthi Quds-4 cruise missile — Red Sea shipping lane',            status: 'TRACKING',     actor: 'HEZ',        offset: 58 },
  { type: 'INTERCEPT',  location: 'N. Israel / Galilee',    description: "David's Sling vs Hezbollah Zelzal-2 — intercept verified",        status: 'SUCCESS',      actor: 'IDF',        offset: 67 },
  { type: 'NAVAL',      location: 'Persian Gulf',           description: 'P-8A Poseidon MARPAT — IRGC Kilo-class submarine contact',        status: 'AIRBORNE',     actor: 'USN',        offset: 74 },
  { type: 'RECON',      location: 'Over Iran / Isfahan',    description: 'RQ-4 Global Hawk ISR — post-strike BDA nuclear sites',            status: 'AIRBORNE',     actor: 'USAF',       offset: 82 },
  { type: 'STRIKE',     location: 'Fordow, Iran',           description: 'B-2 Spirit GBU-57 MOP — 3rd sortie, underground assessment',      status: 'RTB',          actor: 'USA',        offset: 95 },
  { type: 'DIPLOMATIC', location: 'Muscat, Oman',           description: 'Iran signals 72h humanitarian pause via Omani FM back-channel',   status: 'MONITOR',      actor: 'DIPLOMATIC', offset: 120 },
  { type: 'INTERCEPT',  location: 'Tel Aviv / Center IL',   description: 'Patriot PAC-3 vs Ghadr-110 — DIRECT HIT, warhead neutralized',   status: 'SUCCESS',      actor: 'IDF',        offset: 135 },
  { type: 'LAUNCH',     location: 'W. Iran / Kermanshah',   description: 'Shahed-136 swarm — 26 units, multi-vector approach',              status: 'TRACKING',     actor: 'IRGC',       offset: 148 },
  { type: 'NAVAL',      location: 'Red Sea / Bab-el-Mandeb','description': 'IRGC-backed Houthi fast boat activity — USS Bataan ARG rerouting', status: 'ACTIVE',   actor: 'USN',        offset: 165 },
]

function makeEntries() {
  return ENTRY_TEMPLATES.map(e => ({ ...e, dtg: militaryDTG(e.offset) }))
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#ff2d2d', SUCCESS: '#00e676', FAILED: '#ff6b35', TRACKING: '#ffc107',
  AIRBORNE: '#2196f3', MONITOR: '#7f8c9b', PARTIAL: '#ff6b35', 'RTB': '#00bcd4',
  'BDA PENDING': '#ab47bc', COMPLETED: '#00e676', REPELLED: '#00e676', REJECTED: '#7f8c9b',
}

type FilterType = OpsType | 'ALL'
const FILTER_TABS: FilterType[] = ['ALL', 'STRIKE', 'INTERCEPT', 'LAUNCH', 'RECON', 'NAVAL', 'CYBER']

export default function LiveOpsTracker() {
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [entries] = useState(() => makeEntries())

  const filtered = filter === 'ALL'
    ? entries
    : entries.filter(e => e.type === filter)

  return (
    <div className="flex flex-col h-full">
      {/* Sortie counter */}
      <div
        className="flex items-center justify-between px-2 py-1 flex-shrink-0 border-b font-military text-[9px]"
        style={{ borderColor: '#1e2d3d', backgroundColor: '#0d1520' }}
      >
        <div className="flex gap-3 items-center">
          <span style={{ color: '#7f8c9b' }}>SORTIES:</span>
          <span className="flex items-center gap-1" style={{ color: '#00ff88' }}><Flag iso="il" size={12} />IDF <span className="font-bold">47</span></span>
          <span className="flex items-center gap-1" style={{ color: '#2196f3' }}><Flag iso="us" size={12} />USAF <span className="font-bold">23</span></span>
          <span className="flex items-center gap-1" style={{ color: '#ff5722' }}><Flag iso="ir" size={12} />IRGC <span className="font-bold">12</span></span>
        </div>
        <div className="flex items-center gap-1">
          <LiveDot />
          <span style={{ color: '#ff2d2d' }}>ACTIVE OPS</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b flex-shrink-0 overflow-x-auto" style={{ borderColor: '#1e2d3d' }}>
        {FILTER_TABS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="text-[8px] font-military px-2 py-1 whitespace-nowrap transition-colors flex-shrink-0"
            style={{
              color: filter === f ? (OPS_COLORS[f] || '#00ff88') : '#4a6a7a',
              backgroundColor: filter === f ? `${OPS_COLORS[f] || '#00ff88'}12` : 'transparent',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto font-mono-data text-[9px]">
        {filtered.map((entry, idx) => (
          <div
            key={idx}
            className="flex gap-2 px-2 py-1.5 border-b hover:bg-white/5 transition-colors"
            style={{ borderColor: '#0d1520' }}
          >
            <span style={{ color: OPS_COLORS[entry.type] || '#7f8c9b', minWidth: 60, flexShrink: 0 }}>
              [{entry.type}]
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5" style={{ color: '#7f8c9b' }}>
                {ACTOR_ISO[entry.actor] && <Flag iso={ACTOR_ISO[entry.actor]} size={11} />}
                <span>{entry.actor}</span>
                <span style={{ color: '#2a4a6b' }}>·</span>
                <span>{entry.dtg}</span>
              </div>
              <div style={{ color: '#c8d6e5' }}>{entry.location}</div>
              <div style={{ color: '#9ab0c0' }}>{entry.description}</div>
            </div>
            <span
              className="text-[8px] border px-1 py-0.5 flex-shrink-0 self-start"
              style={{ color: STATUS_COLORS[entry.status] || '#7f8c9b', borderColor: `${STATUS_COLORS[entry.status] || '#7f8c9b'}50` }}
            >
              {entry.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
