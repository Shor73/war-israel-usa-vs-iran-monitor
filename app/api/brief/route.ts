import { NextResponse } from 'next/server'

let cache: { brief: string; ts: number } | null = null
const TTL = 6 * 60 * 60 * 1000 // 6 hours

const FALLBACK_BRIEF = `SITUATION REPORT — OPERATION ULTIMATUM
DTG: 041800ZMAR2026 | CLASSIFICATION: SECRET//NOFORN | SOURCE: AI SYNTHESIS

SITUATION (D+5 of conflict):
US-Israeli combined strike campaign against Iranian nuclear and military infrastructure continues. IDF air defenses at 80-85% intercept effectiveness across three Iranian ballistic missile waves. Hezbollah opened second front on D+2. Houthi anti-ship operations continue in Red Sea.

THREAT ASSESSMENT:
• IRAN: IRGC Aerospace ~35% remaining stockpile. Fattah-1 hypersonic critically depleted. Third wave prep HIGH confidence.
• HEZBOLLAH: 185+ projectiles in 3 days. Risk of IDF ground operation rising.
• HOUTHI: 25 total launches. Red Sea anti-access continues.
• IRAN AIR DEFENSE: Significantly degraded post-SEAD operations.

KEY DEVELOPMENTS (24h):
• Iran formally threatened Strait of Hormuz closure. US MCM assets deployed.
• China proposed 72h humanitarian pause. US rejected.
• Natanz 60-70% destruction confirmed by satellite imagery.
• Oil stabilized at +24% above pre-war levels.

DIPLOMATIC TRACK:
Qatar/Oman back-channel active. Iran receptive to preliminary discussions per HUMINT. Iran domestic politics require visible retaliation before ceasefire possible. UN Security Council deadlocked.

ECONOMIC WARFARE:
G7 sanctions fully in effect. Iran banking fully excluded. Oil exports near-zero. Estimated Iran GDP impact: -40% annualized at 30-day scenario.

FORECAST (24-48h):
ESCALATION PROBABILITY: MEDIUM-HIGH (65%)
Third wave launch likely within 18-24 hours. Back-channel offers de-escalation pathway but conditions not yet met.

CLASSIFICATION: SECRET//NOFORN | SOURCES: OSINT aggregation, open-source analysis only`

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json({ brief: cache.brief })
  }

  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) {
    return NextResponse.json({ brief: FALLBACK_BRIEF })
  }

  try {
    const prompt = `You are an intelligence analyst at CIA/Mossad level. Generate a classified-format SITREP (Situation Report) for the Iran-Israel-USA war that started February 28, 2026. Today is March 4, 2026 (D+5).

Key facts:
- Iran launched 3 waves of ballistic missiles (237 total, 191 intercepted)
- Hezbollah opened second front March 2 (185+ rockets in 3 days)
- Houthis attacking Red Sea (25 launches)
- IDF/USA struck Iranian nuclear sites: Natanz (60-70% destroyed), Fordow, Isfahan, Arak, Parchin
- Oil prices up 24%+ (Brent $121)
- Strait of Hormuz threatened with closure

Write a 500-word SITREP in military/intelligence format with sections: SITUATION, THREAT ASSESSMENT, KEY DEVELOPMENTS, DIPLOMATIC TRACK, ECONOMIC WARFARE, FORECAST. Use military jargon. Include DTG timestamps.`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(15000),
    })

    if (res.ok) {
      const data = await res.json()
      const brief = data.choices?.[0]?.message?.content || FALLBACK_BRIEF
      cache = { brief, ts: Date.now() }
      return NextResponse.json({ brief })
    }
  } catch { /* fall through */ }

  return NextResponse.json({ brief: FALLBACK_BRIEF })
}
