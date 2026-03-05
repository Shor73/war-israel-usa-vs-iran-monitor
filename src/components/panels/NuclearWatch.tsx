'use client'
import { useDashboardStore } from '@/store/dashboard'
import { Flag } from '@/components/ui/Flag'

const IRAN_SITES = [
  { name: 'Natanz FEP', type: 'Uranium Enrichment', enrichment: '84%', status: 'HEAVILY DAMAGED', color: '#ff2d2d', detail: '~65% surface destruction confirmed (B-2 GBU-57 MOP). Centrifuge halls A/B assessed destroyed. Underground sections TBD.' },
  { name: 'Fordow FFEP', type: 'Underground Enrichment', enrichment: '84%', status: 'DAMAGED', color: '#ff6b35', detail: 'Hardened underground facility. MOP strikes delivered. Damage assessment ongoing. Partial functionality possible.' },
  { name: 'Isfahan UCF', type: 'Uranium Conversion', enrichment: 'N/A', status: 'STRUCK', color: '#ffc107', detail: 'Uranium conversion disrupted. F-35I precision strikes confirmed.' },
  { name: 'Arak IR-40', type: 'Heavy Water Reactor', enrichment: 'N/A', status: 'STRUCK', color: '#ffc107', detail: 'Plutonium pathway disrupted. IDF and US strikes confirmed.' },
  { name: 'Bushehr NPP', type: 'Nuclear Power Plant', enrichment: 'N/A', status: 'INTACT', color: '#00e676', detail: 'INTENTIONALLY NOT TARGETED — radiological risk. IAEA monitoring requested. Russian technicians evacuated.' },
  { name: 'Parchin Military', type: 'Weapons Research', enrichment: 'N/A', status: 'STRUCK', color: '#ff6b35', detail: 'IRGC weapons-related research facility. Specific buildings targeted.' },
]

export default function NuclearWatch() {
  const { nuclearWatchOpen, closNuclearWatch } = useDashboardStore()

  if (!nuclearWatchOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={closNuclearWatch}
    >
      <div
        className="w-full max-w-3xl max-h-[80vh] overflow-y-auto border"
        style={{ background: '#0a0e14', borderColor: '#ab47bc' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 border-b font-military"
          style={{ borderColor: '#ab47bc', background: 'rgba(171,71,188,0.1)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">☢</span>
            <span className="text-sm" style={{ color: '#ab47bc' }}>NUCLEAR WATCH — CLASSIFICATION: TOP SECRET // NP // NOFORN</span>
          </div>
          <button className="text-[#ab47bc] hover:opacity-70" onClick={closNuclearWatch}>✕ CLOSE</button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-4">
          {/* Iran nuclear status */}
          <div>
            <h3 className="font-military text-[10px] mb-3 flex items-center gap-1.5" style={{ color: '#ff5722' }}>
              <Flag iso="ir" size={14} /> IRAN NUCLEAR PROGRAM — POST-STRIKE ASSESSMENT
            </h3>

            <div className="border p-2 mb-3" style={{ borderColor: '#ab47bc30', background: 'rgba(171,71,188,0.05)' }}>
              <div className="font-military text-[9px] mb-1" style={{ color: '#ab47bc' }}>ENRICHMENT STATUS</div>
              <div className="font-mono-data text-[9px]" style={{ color: '#c8d6e5' }}>
                Pre-conflict: ~84% (HEU near weapons-grade)<br />
                Post-strikes: Material status unknown — IAEA access DENIED<br />
                Pre-war breakout time: 1-2 weeks<br />
                Post-strike assessment: TBD (6-18 months if facilities destroyed)
              </div>
            </div>

            {IRAN_SITES.map(site => (
              <div key={site.name} className="border-b py-2" style={{ borderColor: '#1e2d3d' }}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-military text-[10px]" style={{ color: '#c8d6e5' }}>{site.name}</span>
                  <span className="font-military text-[8px] border px-1"
                    style={{ color: site.color, borderColor: site.color }}>
                    {site.status}
                  </span>
                </div>
                <div className="font-mono-data text-[8px]" style={{ color: '#4a6a7a' }}>{site.type} | Enrichment: {site.enrichment}</div>
                <div className="font-mono-data text-[8px] mt-0.5" style={{ color: '#7f8c9b' }}>{site.detail}</div>
              </div>
            ))}
          </div>

          {/* Israel + US STRATCOM */}
          <div>
            <h3 className="font-military text-[10px] mb-3 flex items-center gap-1.5" style={{ color: '#2196f3' }}>
              <Flag iso="il" size={14} /> ISRAEL NUCLEAR AMBIGUITY
            </h3>
            <div className="border p-2 mb-4" style={{ borderColor: '#2196f330', background: 'rgba(33,150,243,0.05)' }}>
              <div className="font-mono-data text-[9px] leading-relaxed" style={{ color: '#9ab0c0' }}>
                Israel maintains official policy of nuclear ambiguity. Does not confirm or deny nuclear weapons.<br /><br />
                <span style={{ color: '#ffc107' }}>Estimated capability (FAS/SIPRI):</span><br />
                • ~80-90 warheads<br />
                • Jericho III ICBM (est. 6,500km range)<br />
                • Jericho II MRBM (est. 1,500km range)<br />
                • Submarine-based Popeye Turbo SLCM (INS Dolphin)<br /><br />
                <span style={{ color: '#ff6b35' }}>⚠ Samson Option doctrine: nuclear retaliation if Israel faces existential threat.</span>
              </div>
            </div>

            <h3 className="font-military text-[10px] mb-3 flex items-center gap-1.5" style={{ color: '#00e676' }}>
              <Flag iso="us" size={14} /> US STRATCOM ALERT
            </h3>
            <div className="border p-2" style={{ borderColor: '#00e67630', background: 'rgba(0,230,118,0.05)' }}>
              <div className="font-mono-data text-[9px] leading-relaxed" style={{ color: '#9ab0c0' }}>
                STRATCOM forces at <span style={{ color: '#ffc107' }}>DEFCON 2</span> — second-highest readiness.<br /><br />
                Ohio-class SSBNs confirmed at sea (standard deterrence patrol).<br />
                B-2 nuclear-capable bombers deployed Diego Garcia.<br />
                B61-12 gravity bombs at Incirlik AB, Turkey (NATO nuclear sharing).<br /><br />
                <span style={{ color: '#00e676' }}>⚠ No nuclear escalation indicators detected. Conventional conflict only at this time.</span>
              </div>
            </div>

            <div className="mt-4 border p-2" style={{ borderColor: '#ff2d2d30', background: 'rgba(255,45,45,0.05)' }}>
              <div className="font-military text-[9px] mb-1" style={{ color: '#ff2d2d' }}>SOURCE ASSESSMENT</div>
              <div className="font-mono-data text-[8px]" style={{ color: '#7f8c9b' }}>
                Sources: 38 North, SIPRI Yearbook, FAS Nuclear Notebook, IAEA reports, Arms Control Association. Iran site coordinates from open-source IMINT analysis. UNCLASSIFIED information only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
