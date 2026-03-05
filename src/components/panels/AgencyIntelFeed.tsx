'use client'
import { useState } from 'react'
import { useDashboardStore } from '@/store/dashboard'
import { agencyColor, toShortDTG } from '@/lib/utils'
import type { AgencyType } from '@/lib/types'
import { ClassifiedBadge, AgencyBadge } from '@/components/ui/ClassifiedBadge'
import { militaryDTG } from '@/lib/war-time'

const AGENCY_TABS: AgencyType[] = ['ALL', 'CIA', 'MOSSAD', 'AMAN', 'OSINT', 'IRGC']

// Offsets in minutes from "now" — always current timestamps
const INTEL_TEMPLATES = [
  {
    id: 1, agency: 'CIA' as AgencyType, classification: 'TOP SECRET' as const,
    originator: 'CIA/DO/NE', source: 'SIGINT — CONFIRMED',
    subject: 'IRGC 4th wave preparation — Fattah-2 TELs active near Kermanshah',
    body: 'NRO/NGA satellite confirms 6 Fattah-2 hypersonic MRBM TELs repositioning near Kermanshah. Assessed as 4th wave launch preparation targeting IDF airbases (Nevatim, Ramat David). Launch window estimated 4-8 hours. SIGINT corroborates encrypted IRGC Aerospace comms spike.',
    confidence: 'HIGH' as const,
    offset: 38,
  },
  {
    id: 2, agency: 'MOSSAD' as AgencyType, classification: 'SECRET' as const,
    originator: 'MOSSAD/SIGINT UNIT 8200 (liaison)',
    source: 'HUMINT — CORROBORATED',
    subject: 'Hezbollah Radwan Force — IDF ground incursion imminent S. Lebanon',
    body: 'Source CEDAR (HIGH reliability) reports IDF Northern Command issuing pre-operation orders to Golani Brigade for limited ground incursion into S. Lebanon. Objective: Hezbollah launch infrastructure Metula–Bint Jbeil corridor. Expected H-Hour within 6-12 hours.',
    confidence: 'HIGH' as const,
    offset: 95,
  },
  {
    id: 3, agency: 'CIA' as AgencyType, classification: 'TOP SECRET' as const,
    originator: 'CIA/DS&T/IMINT',
    source: 'SATELLITE IMAGERY — CONFIRMED',
    subject: 'Fordow FFEP underground damage — IAEA assessment confirms breach',
    body: 'NRO KH-13 + commercial imagery correlation confirms B-2 GBU-57 MOP penetrated Fordow FFEP tunnel entrance. Structural collapse Section B confirmed. IAEA emergency team deploying via Turkish airspace. Radiation monitoring stations outside Qom show NO elevated readings — warhead components unconfirmed.',
    confidence: 'HIGH' as const,
    offset: 155,
  },
  {
    id: 4, agency: 'AMAN' as AgencyType, classification: 'SECRET' as const,
    originator: 'IDF Military Intelligence — Unit 504 (liaison)',
    source: 'OSINT + SIGINT',
    subject: 'IRGC missile reserve critical — 28% remaining, Fattah-1 depleted',
    body: 'Updated combined analysis D+5: IRGC Aerospace Force missile inventory estimated at 28% of pre-conflict. Fattah-1 hypersonic stock EXHAUSTED (all 12 expended D+0/D+3). Fattah-2 now primary hypersonic asset. Shahed-136 critically low (~600 remaining). Transition to Fattah-2 + cruise missile strategy assessed.',
    confidence: 'MEDIUM' as const,
    offset: 240,
  },
  {
    id: 5, agency: 'OSINT' as AgencyType, classification: 'UNCLASSIFIED' as const,
    originator: 'OSINT AGGREGATION',
    source: 'OSINT — UNVERIFIED',
    subject: '@AuroraIntel: Brent crude $128/bbl — Hormuz shipping crisis escalating',
    body: 'Multiple OSINT sources confirm Brent crude breaching $128/bbl — highest since 2008. IRGC fast boats shadowing 3 VLCC tankers in Hormuz. Lloyd\'s War Risk Premium now 4.8% hull value. AP reports Qatar redirecting 4 LNG tankers away from Gulf. NOT OFFICIALLY CONFIRMED by US 5th Fleet.',
    confidence: 'MEDIUM' as const,
    offset: 310,
  },
  {
    id: 6, agency: 'CIA' as AgencyType, classification: 'SECRET' as const,
    originator: 'CIA/CTC',
    source: 'HUMINT — MODERATE CONFIDENCE',
    subject: 'Oman back-channel: Iran signals 72h humanitarian pause willingness',
    body: 'Source MERCURY (Omani FM office) reports Iranian Deputy FM Bagheri contacted Omani counterpart at 08:00Z conveying conditional willingness for 72-hour humanitarian pause. Conditions: halt US/IDF strikes on non-nuclear infrastructure, IAEA access to Fordow. US NSC assessing. Qatar also notified.',
    confidence: 'MEDIUM' as const,
    offset: 420,
  },
  {
    id: 7, agency: 'IRGC' as AgencyType, classification: 'UNCLASSIFIED' as const,
    originator: 'IRGC STATE MEDIA MONITOR',
    source: 'OPEN SOURCE — IRANIAN STATE',
    subject: '[IRANIAN STATE] IRGC claims USS Cole SM-3 "ineffective" vs Fattah-2',
    body: 'Press TV / IRGC channel: "Fattah-2 hypersonic successfully bypassed Zionist-American naval missile defense in Red Sea. USS Cole SM-3 Block IIA fired twice — both missed." IDF + CENTCOM NOT confirming claim. US 5th Fleet: "USS Cole engaged and neutralized incoming threat." Claims assessed UNVERIFIED.',
    confidence: 'LOW' as const,
    offset: 510,
  },
  {
    id: 8, agency: 'AMAN' as AgencyType, classification: 'SECRET' as const,
    originator: 'IDF Military Intelligence',
    source: 'SIGINT',
    subject: 'Hezbollah encrypted comms — backup frequency plan Day 2 active',
    body: 'Hezbollah communications units now operating on tertiary encrypted frequency plan (3rd rotation since D+3). Unit 8200 SIGINT collection degraded ~60% vs D+0 baseline. Radwan Force company-level comms using single-use OTP pads assessed. Real-time intelligence collection severely hampered. High uncertainty for 24-48h.',
    confidence: 'HIGH' as const,
    offset: 600,
  },
]

function makeIntelEntries() {
  return INTEL_TEMPLATES.map(t => ({ ...t, dtg: militaryDTG(t.offset) }))
}

export default function AgencyIntelFeed() {
  const { agencyFilter, setAgencyFilter } = useDashboardStore()
  const [intelEntries] = useState(() => makeIntelEntries())

  const filtered = agencyFilter === 'ALL'
    ? intelEntries
    : intelEntries.filter(e => e.agency === agencyFilter)

  const confidenceColor = (c: string) => {
    if (c === 'HIGH') return '#00e676'
    if (c === 'MEDIUM') return '#ffc107'
    return '#ff6b35'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Agency tabs */}
      <div className="flex border-b flex-shrink-0" style={{ borderColor: '#1e2d3d' }}>
        {AGENCY_TABS.map(a => (
          <button
            key={a}
            onClick={() => setAgencyFilter(a)}
            className="text-[9px] font-military px-2 py-1 flex-1 transition-colors"
            style={{
              color: agencyFilter === a ? agencyColor(a) : '#4a6a7a',
              backgroundColor: agencyFilter === a ? `${agencyColor(a)}15` : 'transparent',
              borderBottom: agencyFilter === a ? `1px solid ${agencyColor(a)}` : 'none',
            }}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Intel entries */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map(entry => (
          <div
            key={entry.id}
            className="p-2 border-b"
            style={{ borderColor: '#1e2d3d' }}
          >
            {/* Entry header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <AgencyBadge agency={entry.agency} />
                <ClassifiedBadge level={entry.classification} />
              </div>
              <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>{entry.dtg}</span>
            </div>

            {/* Classified format */}
            <div
              className="border p-1.5 font-mono-data text-[9px]"
              style={{ borderColor: `${agencyColor(entry.agency)}30`, backgroundColor: `${agencyColor(entry.agency)}05` }}
            >
              <div style={{ color: '#4a6a7a' }}>ORIG: {entry.originator}</div>
              <div style={{ color: '#4a6a7a' }}>SRC: {entry.source}</div>
              <div className="mt-1 font-military text-[10px]" style={{ color: agencyColor(entry.agency) }}>
                {entry.subject}
              </div>
              <div className="mt-1 leading-relaxed" style={{ color: '#9ab0c0' }}>
                {entry.body}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span style={{ color: '#4a6a7a' }}>CONFIDENCE:</span>
                <span style={{ color: confidenceColor(entry.confidence) }} className="font-military text-[9px]">
                  {entry.confidence}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
