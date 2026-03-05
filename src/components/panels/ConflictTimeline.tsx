'use client'
import { useState } from 'react'
import { eventTypeColor, severityEmoji } from '@/lib/utils'
import type { ConflictEvent } from '@/lib/types'

const EVENTS: ConflictEvent[] = [
  // D+0 — 28 Feb 2026
  { id: 1,  date: '2026-02-28T04:00:00Z', type: 'military',     actor: 'US/IDF',    title: 'Op. Ultimatum: strikes on Iran nuclear/missile sites', detail: 'B-2 Spirit GBU-57 MOP on Fordow. F-35I on Natanz. 150+ Tomahawk TLAM from DDGs/SSGN. IRGC Aerospace command nodes targeted.', severity: 'CRITICAL' },
  { id: 2,  date: '2026-02-28T06:00:00Z', type: 'military',     actor: 'Iran',      title: 'Iran 1st wave — 80+ ballistic missiles at Israel', detail: 'Shahab-3, Emad, Fattah-1 hypersonic launched. Arrow-3/2 activated across Israel. ~80% intercept rate initial wave.', severity: 'CRITICAL' },
  { id: 3,  date: '2026-02-28T08:00:00Z', type: 'economic',     actor: 'Market',    title: 'Oil surges 25% — Brent $122/bbl, defense stocks +14%', detail: 'Hormuz tensions spike markets. War risk premium triples. RTX +12%, LMT +14%, NOC +11%. Gold $2,480.', severity: 'HIGH' },
  { id: 4,  date: '2026-02-28T12:00:00Z', type: 'diplomatic',   actor: 'UN',        title: 'UNSC: Russia/China veto condemnation resolution', detail: 'Emergency session. US/UK support self-defense. Russia/China block resolution. G7 preparing joint statement.', severity: 'MEDIUM' },
  // D+1 — 01 Mar 2026
  { id: 5,  date: '2026-03-01T00:30:00Z', type: 'military',     actor: 'Iran',      title: 'Iran 2nd wave — 120+ missiles + Shahed-136 swarm', detail: '50 Shahed-136 kamikaze + 70 ballistic. Multi-layer defense activated. 85%+ intercept rate.', severity: 'CRITICAL' },
  { id: 6,  date: '2026-03-01T06:00:00Z', type: 'military',     actor: 'USA',       title: 'US F/A-18 SEAD/DEAD — Iranian air defense degraded', detail: 'Carrier-based F/A-18E/F + EA-18G Growler. S-300PMU2 sites targeted. Bavar-373 status unknown.', severity: 'HIGH' },
  { id: 7,  date: '2026-03-01T10:00:00Z', type: 'economic',     actor: 'Airlines',  title: 'Global airlines close Iranian airspace — mass rerouting', detail: 'Emirates, Qatar, Turkish, Lufthansa, Air France announce diversions. +3-5h extra flight time. $15K+/flight fuel premium.', severity: 'HIGH' },
  { id: 8,  date: '2026-03-01T18:00:00Z', type: 'intelligence', actor: 'CIA/OSINT', title: 'SIGINT: IRGC Quds-Hezbollah coordination detected', detail: 'Encrypted comms confirm Hezbollah activation coordination. IDF Northern Command on max alert REDCON-1.', severity: 'HIGH' },
  // D+2 — 02 Mar 2026
  { id: 9,  date: '2026-03-02T02:00:00Z', type: 'military',     actor: 'Hezbollah', title: 'Hezbollah opens 2nd front — 1st barrage N. Israel', detail: '~60 rockets from S. Lebanon. Iron Dome activated. Kiryat Shmona hit. Galilee under sustained fire.', severity: 'CRITICAL' },
  { id: 10, date: '2026-03-02T14:00:00Z', type: 'diplomatic',   actor: 'G7',        title: 'G7 emergency statement: support for US/Israel', detail: 'Joint statement. UK commits Typhoon squadrons. France calls for humanitarian ceasefire. Germany freezes Iran assets.', severity: 'MEDIUM' },
  { id: 11, date: '2026-03-02T20:00:00Z', type: 'military',     actor: 'Houthi',    title: 'Houthis: Toofan missiles at USS Gravely — SM-2 intercept', detail: 'Anti-ship missiles from Yemen. SM-2 successful intercept. No damage. Red Sea transit halted by major insurers.', severity: 'HIGH' },
  // D+3 — 03 Mar 2026
  { id: 12, date: '2026-03-03T02:00:00Z', type: 'military',     actor: 'Iran',      title: 'Iran 3rd wave — Fattah-1 hypersonics target IDF airbases', detail: '12 Fattah-1 vs Nevatim, Hatzerim. Arrow-3 intercepts 8/12. Nevatim runway partial damage. F-35 operations briefly suspended.', severity: 'CRITICAL' },
  { id: 13, date: '2026-03-03T08:00:00Z', type: 'intelligence', actor: 'Satellite', title: 'Natanz 65% surface destruction — Planet Labs/Maxar confirm', detail: 'NRO + commercial imagery. Centrifuge halls A/B destroyed. Underground FEP unassessable. IAEA access DENIED by Iran.', severity: 'HIGH' },
  { id: 14, date: '2026-03-03T15:00:00Z', type: 'military',     actor: 'Iran',      title: 'Iran threatens Hormuz closure — IRGC Navy deploys', detail: 'Fast attack craft + mine-laying vessels at Strait entrance. 5th Fleet at REDCON-2. MCM assets deployed.', severity: 'CRITICAL' },
  // D+4 — 04 Mar 2026
  { id: 15, date: '2026-03-04T01:00:00Z', type: 'humanitarian', actor: 'UN',        title: 'OCHA: 2,400+ casualties — multi-theater', detail: 'Iran: 1,800+ (strikes on military/infra). Israel: 340+. Lebanon: 180+. Yemen: 80+. ICRC requests humanitarian corridors.', severity: 'MEDIUM' },
  { id: 16, date: '2026-03-04T10:00:00Z', type: 'military',     actor: 'Hezbollah', title: 'Day 3 Hezbollah: 185+ projectiles — Iron Dome strained', detail: "Iron Dome 80% intercept rate under saturation pressure. David's Sling activated. IDF ground op imminent per IDF spokesperson.", severity: 'CRITICAL' },
  { id: 17, date: '2026-03-04T14:00:00Z', type: 'diplomatic',   actor: 'China',     title: 'China: 72h humanitarian pause — US rejects', detail: 'Qatar/Oman: Iran receptive to back-channel. French President in Doha. US: no pause until Iran ceases missile launches.', severity: 'MEDIUM' },
  { id: 18, date: '2026-03-04T22:00:00Z', type: 'military',     actor: 'USA/IDF',   title: 'Night strikes: 4th US sortie wave — IRGC Missile HQ targeted', detail: 'B-52H + carrier F-35A. IRGC Aerospace Force HQ in Tehran suburbs hit. Multiple secondary explosions.', severity: 'CRITICAL' },
  // D+5 — 05 Mar 2026 (TODAY)
  { id: 19, date: '2026-03-05T02:00:00Z', type: 'military',     actor: 'Iran',      title: 'Iran 4th wave — 62 missiles, Fattah-2 first use', detail: 'Larger 4th wave. First combat use of new Fattah-2 hypersonic (longer range than Fattah-1). IDF Arrow-3 engaged 4/6 Fattah-2. Impacts Tel Aviv suburbs, Haifa port damaged.', severity: 'CRITICAL' },
  { id: 20, date: '2026-03-05T06:00:00Z', type: 'military',     actor: 'IDF',       title: 'IDF announces Lebanon ground operation imminent', detail: "IDF Northern Command: ground forces at border. US endorses 'defensive action'. UN SG calls for halt. Hezbollah fires 52 rockets in retaliation warning.", severity: 'CRITICAL' },
  { id: 21, date: '2026-03-05T09:00:00Z', type: 'intelligence', actor: 'IAEA',      title: 'IAEA Emergency Board: Fordow underground damage "severe"', detail: 'First official confirmation. Director General: "significant structural damage to underground enrichment hall." Iran stockpile status unknown. Breakout timeline reset.', severity: 'HIGH' },
  { id: 22, date: '2026-03-05T11:00:00Z', type: 'economic',     actor: 'Market',    title: 'Brent $128/bbl — Hormuz 22% traffic reduction', detail: 'Record since 2022. Gulf states suspending OPEC+ cuts to compensate. Saudi Aramco emergency production increase. Aviation fuel +40%.', severity: 'HIGH' },
  { id: 23, date: '2026-03-05T13:00:00Z', type: 'diplomatic',   actor: 'Oman/Qatar',title: 'Oman: Iran signals readiness for humanitarian ceasefire', detail: 'Sultanate FM: Iran conveyed willingness to discuss 72h pause if strikes halt. US/Israel: conditions unacceptable. Talks ongoing in Muscat.', severity: 'MEDIUM' },
  { id: 24, date: '2026-03-05T16:00:00Z', type: 'military',     actor: 'USA',       title: 'US SM-3 first combat use — intercept of Iranian MRBM', detail: 'USS Cole (DDG-67) fires SM-3 Block IIA in Persian Gulf — intercepts Iranian Ghadr-110 MRBM. First combat use of SM-3 against ballistic missile. Confirmed by CENTCOM.', severity: 'CRITICAL' },
]

const TYPE_TABS = ['ALL', 'military', 'diplomatic', 'economic', 'intelligence', 'humanitarian']

// Height of the timeline container
const TIMELINE_H = 160

export default function ConflictTimeline() {
  const [selected, setSelected] = useState<ConflictEvent | null>(null)
  const [typeFilter, setTypeFilter] = useState('ALL')

  const filtered = typeFilter === 'ALL' ? EVENTS : EVENTS.filter(e => e.type === typeFilter)

  return (
    <div className="flex h-full">
      {/* Left: timeline + filter */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Type filter */}
        <div className="flex border-b flex-shrink-0 overflow-x-auto" style={{ borderColor: '#1e2d3d' }}>
          {TYPE_TABS.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="font-military text-[8px] px-2 py-1 whitespace-nowrap flex-shrink-0 transition-colors capitalize"
              style={{
                color: typeFilter === t ? eventTypeColor(t) : '#4a6a7a',
                backgroundColor: typeFilter === t ? `${eventTypeColor(t)}15` : 'transparent',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Horizontal alternating timeline */}
        <div className="flex-1 overflow-hidden relative">
          {/* Center axis line */}
          <div
            className="absolute pointer-events-none"
            style={{ top: TIMELINE_H / 2, left: 0, right: 0, height: 1, background: '#2a4a6b', zIndex: 1 }}
          />

          {/* Scrollable event row */}
          <div className="h-full overflow-x-auto overflow-y-hidden">
            <div className="flex px-4" style={{ height: TIMELINE_H, width: 'max-content', alignItems: 'stretch' }}>
              {filtered.map((event, idx) => {
                const above = idx % 2 === 0
                const color = eventTypeColor(event.type)
                const dateStr =
                  new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) +
                  ' ' + String(new Date(event.date).getUTCHours()).padStart(2, '0') + ':00Z'
                const isToday = event.date.startsWith('2026-03-05')
                const titleShort = event.title.slice(0, 50) + (event.title.length > 50 ? '…' : '')

                return (
                  <button
                    key={event.id}
                    onClick={() => setSelected(selected?.id === event.id ? null : event)}
                    className="flex flex-col items-center group transition-opacity hover:opacity-100"
                    style={{ minWidth: 120, width: 120, opacity: selected && selected.id !== event.id ? 0.6 : 1 }}
                  >
                    {above ? (
                      /* ABOVE: text stacks upward, dot at bottom (touches line) */
                      <>
                        <div className="flex-1 flex flex-col items-center justify-end pb-1.5 min-w-0 w-full">
                          {isToday && (
                            <span className="font-military text-[6px] border px-0.5 mb-0.5" style={{ color: '#00ff88', borderColor: '#00ff88' }}>
                              ● TODAY D+5
                            </span>
                          )}
                          <div
                            className="font-military text-[7px] text-center leading-tight px-1"
                            style={{ color: selected?.id === event.id ? color : '#9ab0c0', maxWidth: 112 }}
                          >
                            {severityEmoji(event.severity)} {titleShort}
                          </div>
                          <div className="font-military text-[6px] mt-0.5" style={{ color: '#4a6a7a' }}>
                            {dateStr}
                          </div>
                        </div>
                        {/* Dot — sits on the center line */}
                        <div
                          className="flex-shrink-0 rounded-full border-2 z-10 transition-transform group-hover:scale-125"
                          style={{
                            width: 12, height: 12,
                            backgroundColor: color,
                            borderColor: selected?.id === event.id ? '#fff' : color,
                            boxShadow: selected?.id === event.id ? `0 0 8px ${color}` : 'none',
                          }}
                        />
                        <div className="flex-1" />
                      </>
                    ) : (
                      /* BELOW: dot at top (touches line), text stacks downward */
                      <>
                        <div className="flex-1" />
                        <div
                          className="flex-shrink-0 rounded-full border-2 z-10 transition-transform group-hover:scale-125"
                          style={{
                            width: 12, height: 12,
                            backgroundColor: color,
                            borderColor: selected?.id === event.id ? '#fff' : color,
                            boxShadow: selected?.id === event.id ? `0 0 8px ${color}` : 'none',
                          }}
                        />
                        <div className="flex-1 flex flex-col items-center justify-start pt-1.5 min-w-0 w-full">
                          <div className="font-military text-[6px]" style={{ color: '#4a6a7a' }}>
                            {dateStr}
                          </div>
                          <div
                            className="font-military text-[7px] text-center leading-tight mt-0.5 px-1"
                            style={{ color: selected?.id === event.id ? color : '#9ab0c0', maxWidth: 112 }}
                          >
                            {severityEmoji(event.severity)} {titleShort}
                          </div>
                          {isToday && (
                            <span className="font-military text-[6px] border px-0.5 mt-0.5" style={{ color: '#00ff88', borderColor: '#00ff88' }}>
                              ● TODAY D+5
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right: detail panel */}
      {selected && (
        <div
          className="w-72 border-l flex-shrink-0 overflow-y-auto"
          style={{ borderColor: '#1e2d3d', background: '#0d1520' }}
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="font-military text-[8px] border px-1"
                  style={{ color: eventTypeColor(selected.type), borderColor: eventTypeColor(selected.type) }}
                >
                  {selected.type.toUpperCase()}
                </span>
                {selected.date.startsWith('2026-03-05') && (
                  <span className="font-military text-[7px] border px-1 live-dot" style={{ color: '#00ff88', borderColor: '#00ff88' }}>
                    ● D+5 TODAY
                  </span>
                )}
              </div>
              <button onClick={() => setSelected(null)} style={{ color: '#4a6a7a', fontSize: 12 }}>✕</button>
            </div>
            <div className="font-military text-[8px] mb-2" style={{ color: '#4a6a7a' }}>
              {new Date(selected.date).toUTCString()}
            </div>
            <div className="font-military text-[11px] mb-2 leading-tight" style={{ color: eventTypeColor(selected.type) }}>
              {selected.title}
            </div>
            <div className="font-mono-data text-[9px] leading-relaxed" style={{ color: '#9ab0c0' }}>
              {selected.detail}
            </div>
            <div className="mt-2 font-military text-[8px]" style={{ color: '#4a6a7a' }}>
              ACTOR: {selected.actor} | SEVERITY: {selected.severity}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
