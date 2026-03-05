'use client'
import { useState, useEffect } from 'react'
import { useDashboardStore } from '@/store/dashboard'
import { toMilTime } from '@/lib/utils'

const FALLBACK_BRIEF = `SITUATION REPORT — OPERATION ULTIMATUM
DTG: 041800ZMAR2026 | CLASSIFICATION: SECRET//NOFORN

SITUATION (D+5):
The US-Israel combined strike campaign against Iranian nuclear and military infrastructure continues into Day 5. Israeli air defenses have maintained approximately 80-85% intercept effectiveness against three Iranian ballistic missile waves. Hezbollah opened the northern front on D+2 with 185+ projectiles, straining Iron Dome capacity. Houthi anti-ship operations continue in the Red Sea.

THREAT ASSESSMENT:
IRAN: IRGC Aerospace Force estimated at 35% remaining stockpile. Fattah-1 hypersonic inventory critically depleted (~18-20 remaining). Third wave preparation assessed HIGH confidence. Air defense capability significantly degraded following SEAD operations.
HEZBOLLAH: Active second front. 185+ projectiles in 3 days. Precision inventory partially depleted (IDF strikes on depots). Risk of ground operation rising.
HOUTHI: Limited engagement. 25 total launches. Red Sea anti-access operations continue.

KEY DEVELOPMENTS (last 24h):
• Iran formally threatened Strait of Hormuz closure — IRGC Navy assets deployed
• US Navy MCM assets deployed to Strait in response
• China proposed 72h humanitarian pause — US rejected
• Natanz destruction confirmed 60-70% by commercial satellite imagery
• Oil prices stabilized at +24% above pre-war levels

ECONOMIC WARFARE:
G7 emergency sanctions fully in effect. Iran banking sector fully excluded. Oil exports estimated at near-zero. GDP impact for Iran: -40% annualized if conflict continues 30 days. US/EU secondary sanctions threaten Chinese companies purchasing Iranian oil.

FORECAST (24-48h):
ESCALATION PROBABILITY: MEDIUM-HIGH (65%)
De-escalation pathway exists via Qatar/Oman back-channel but Iran domestic politics may require visible retaliation. Third wave launch likely within 18-24 hours.

SOURCES: RSS aggregation from Reuters, Times of Israel, Breaking Defense, OSINT feeds. Assessment reflects open-source information only.`

export default function CommandBrief() {
  const { briefOpen, closeBrief } = useDashboardStore()
  const [brief, setBrief] = useState('')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [displayedText, setDisplayedText] = useState('')

  const generateBrief = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/brief')
      if (res.ok) {
        const data = await res.json()
        setBrief(data.brief || FALLBACK_BRIEF)
      } else {
        setBrief(FALLBACK_BRIEF)
      }
    } catch {
      setBrief(FALLBACK_BRIEF)
    }
    setLoading(false)
    setGenerated(true)
  }

  // Typing animation
  useEffect(() => {
    if (!brief) return
    let i = 0
    setDisplayedText('')
    const id = setInterval(() => {
      if (i < brief.length) {
        setDisplayedText(brief.slice(0, i + 1))
        i += 3
      } else {
        clearInterval(id)
        setDisplayedText(brief)
      }
    }, 20)
    return () => clearInterval(id)
  }, [brief])

  if (!briefOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={closeBrief}
    >
      <div
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto border sigint-terminal"
        style={{ borderColor: '#1a73e8' }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between p-3 border-b"
          style={{ borderColor: '#1a73e8', background: 'rgba(26,115,232,0.1)' }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: '#1a73e8' }}>⚡</span>
            <span className="font-military text-sm" style={{ color: '#1a73e8' }}>AI COMMAND BRIEF — SITREP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>{toMilTime(new Date())}</span>
            <button className="font-military text-[9px]" style={{ color: '#1a73e8' }} onClick={closeBrief}>✕</button>
          </div>
        </div>

        <div className="p-4">
          {!generated ? (
            <div className="text-center py-8">
              <div className="font-military text-[10px] mb-4" style={{ color: '#4a6a7a' }}>
                GROQ AI ANALYSIS ENGINE READY<br />
                Model: llama-3.3-70b | Classification: SECRET//NOFORN
              </div>
              <button
                onClick={generateBrief}
                disabled={loading}
                className="font-military text-sm border px-6 py-2 hover:opacity-80 transition-opacity"
                style={{ color: '#00ff88', borderColor: '#00ff88', background: 'rgba(0,255,136,0.08)' }}
              >
                {loading ? '⟳ GENERATING SITREP...' : '▶ GENERATE COMMAND BRIEF'}
              </button>
            </div>
          ) : (
            <div>
              <pre
                className="font-mono-data text-[9px] whitespace-pre-wrap leading-relaxed"
                style={{ color: '#00cc30' }}
              >
                {displayedText}
                {displayedText.length < brief.length && (
                  <span className="cursor-blink">█</span>
                )}
              </pre>
              <button
                onClick={generateBrief}
                className="mt-4 font-military text-[9px] border px-3 py-1"
                style={{ color: '#4a6a7a', borderColor: '#2a4a6b' }}
              >
                ↺ REGENERATE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
