import { NextResponse } from 'next/server'

// OREF Pikud HaOref — API endpoints (geo-blocked for non-Israeli IPs)
// From Israeli IP: returns [] when no alert, or JSON with active alert
const OREF_LIVE_URL = 'https://www.oref.org.il/WarningMessages/alert/alerts.json'
const OREF_HISTORY_URL = 'https://www.oref.org.il/Shared/Ajax/GetAlertsHistory.aspx?lang=en&fromDate={DATE}&toDate={DATE}&area=0'
const OREF_HISTORY_ALT_URL = 'https://alerts-history.oref.org.il/Shared/Ajax/GetAlarmsHistory.aspx?lang=en&fromDate={DATE}&toDate={DATE}&area=0'
// tzevaadom.co.il — Israeli community API, no geo-block, real-time OREF mirror
const TZEVA_ADOM_API_URL = 'https://api.tzevaadom.co.il/notifications'
// Optional: relay server running on Israeli home machine (set OREF_RELAY_URL env var)
// SECURITY: must be HTTPS and not a private/loopback IP (SSRF prevention)
function validateRelayUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    const h = parsed.hostname
    if (/^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|::1)/i.test(h)) return false
    return true
  } catch { return false }
}
const _rawRelay = process.env.OREF_RELAY_URL?.replace(/\/$/, '') || null
const RELAY_URL = _rawRelay && validateRelayUrl(_rawRelay) ? _rawRelay : null

// Cache
let alertCache: { alerts: OrefAlert[]; history: OrefHistoryItem[]; ts: number } | null = null
const LIVE_TTL = 10 * 1000 // 10 seconds for live
const HISTORY_TTL = 2 * 60 * 1000 // 2 min for history

// Last known-good relay response — keeps showing OREF_RELAY during transient tunnel drops
let relayLiveCache: { response: object; ts: number } | null = null
const RELAY_LIVE_TTL = 30 * 1000 // 30s — if relay fails, serve last good result

// --- Types ---
export interface OrefAlert {
  id: string
  cat: number        // 1=rockets, 2=UAV, 3=aircraft, 4=security, 6=unknown aircraft
  title: string      // alert type in Hebrew
  titleEn: string    // translated
  data: string[]     // affected areas in Hebrew
  dataEn: string[]   // areas in English
  areas: AlertArea[]
  threatSource: ThreatSource
  timeToImpact: number // seconds
  ts: number
}

export interface OrefHistoryItem {
  alertDate: string
  title: string
  data: string
  city: string
  category: number
  matrixId: number
  id: string
  // enriched
  titleEn?: string
  threatSource?: ThreatSource
  region?: string
}

export type ThreatSource = 'HAMAS' | 'HEZBOLLAH' | 'IRAN' | 'HOUTHI' | 'UNKNOWN'

interface AlertArea {
  nameHe: string
  nameEn: string
  region: string
  threatSource: ThreatSource
  timeToImpact: number
}

// --- Area database: Hebrew name → metadata ---
// Based on OREF official area list + geographic threat attribution
const AREA_DB: Record<string, AlertArea> = {
  // North Israel — Hezbollah threat
  'קריית שמונה': { nameHe: 'קריית שמונה', nameEn: 'Kiryat Shmona', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 15 },
  'נהריה': { nameHe: 'נהריה', nameEn: 'Nahariya', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 20 },
  'עכו': { nameHe: 'עכו', nameEn: 'Akko', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 25 },
  'חיפה': { nameHe: 'חיפה', nameEn: 'Haifa', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 30 },
  'טבריה': { nameHe: 'טבריה', nameEn: 'Tiberias', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 25 },
  'צפת': { nameHe: 'צפת', nameEn: 'Safed', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 20 },
  'מטולה': { nameHe: 'מטולה', nameEn: 'Metula', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 10 },
  'שלומי': { nameHe: 'שלומי', nameEn: 'Shlomi', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 12 },
  'כרמיאל': { nameHe: 'כרמיאל', nameEn: "Karmiel", region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 28 },
  'עפולה': { nameHe: 'עפולה', nameEn: 'Afula', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 35 },
  'בית שאן': { nameHe: 'בית שאן', nameEn: "Beit She'an", region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 30 },
  // Center — Iran/Hezbollah long-range
  'תל אביב': { nameHe: 'תל אביב', nameEn: 'Tel Aviv', region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  'רמת גן': { nameHe: 'רמת גן', nameEn: 'Ramat Gan', region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  'חולון': { nameHe: 'חולון', nameEn: 'Holon', region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  'פתח תקווה': { nameHe: 'פתח תקווה', nameEn: 'Petah Tikva', region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  'ראשון לציון': { nameHe: 'ראשון לציון', nameEn: 'Rishon LeZion', region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  'נתניה': { nameHe: 'נתניה', nameEn: 'Netanya', region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  'הרצליה': { nameHe: 'הרצליה', nameEn: 'Herzliya', region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  'ירושלים': { nameHe: 'ירושלים', nameEn: 'Jerusalem', region: 'Jerusalem', threatSource: 'IRAN', timeToImpact: 90 },
  'מודיעין': { nameHe: 'מודיעין', nameEn: "Modi'in", region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  // South — IRAN long-range / HOUTHI (Hamas INACTIVE since 28 Feb 2026 — zero rockets)
  'אשקלון': { nameHe: 'אשקלון', nameEn: 'Ashkelon', region: 'South', threatSource: 'IRAN', timeToImpact: 90 },
  'אשדוד': { nameHe: 'אשדוד', nameEn: 'Ashdod', region: 'South', threatSource: 'IRAN', timeToImpact: 90 },
  'שדרות': { nameHe: 'שדרות', nameEn: 'Sderot', region: 'South', threatSource: 'IRAN', timeToImpact: 90 },
  'באר שבע': { nameHe: 'באר שבע', nameEn: 'Beer Sheva', region: 'South', threatSource: 'IRAN', timeToImpact: 90 },
  'נתיבות': { nameHe: 'נתיבות', nameEn: 'Netivot', region: 'South', threatSource: 'IRAN', timeToImpact: 90 },
  'אופקים': { nameHe: 'אופקים', nameEn: 'Ofakim', region: 'South', threatSource: 'IRAN', timeToImpact: 90 },
  'קריית גת': { nameHe: 'קריית גת', nameEn: 'Kiryat Gat', region: 'South', threatSource: 'IRAN', timeToImpact: 90 },
  'אילת': { nameHe: 'אילת', nameEn: 'Eilat', region: 'South', threatSource: 'HOUTHI', timeToImpact: 120 },
}

// Category code → English title
const CAT_TITLES: Record<number, string> = {
  1: 'ROCKET / MORTAR FIRE',
  2: 'HOSTILE UAV',
  3: 'HOSTILE AIRCRAFT',
  4: 'SECURITY INCIDENT',
  6: 'UNIDENTIFIED AIRCRAFT',
  13: 'BALLISTIC MISSILE',
}

function enrichArea(nameHe: string): AlertArea {
  return AREA_DB[nameHe] || {
    nameHe,
    nameEn: nameHe, // fallback: use Hebrew
    region: 'Unknown',
    threatSource: 'UNKNOWN',
    timeToImpact: 60,
  }
}

function parseOrefResponse(raw: { id: number; cat: number; title: string; data: string[] }): OrefAlert {
  const areas = (raw.data || []).map(enrichArea)
  const primaryThreat: ThreatSource = areas[0]?.threatSource || 'UNKNOWN'
  const minTime = Math.min(...areas.map(a => a.timeToImpact), 999)
  return {
    id: String(raw.id || Date.now()),
    cat: raw.cat || 1,
    title: raw.title || 'ירי רקטות וטילים',
    titleEn: CAT_TITLES[raw.cat] || 'ROCKET FIRE',
    data: raw.data || [],
    dataEn: areas.map(a => a.nameEn),
    areas,
    threatSource: primaryThreat,
    timeToImpact: minTime === 999 ? 60 : minTime,
    ts: Date.now(),
  }
}

// Shared history parser — handles both OREF primary (Hebrew city) and alt (English data) formats
function parseHistory(data: unknown): OrefHistoryItem[] {
  if (!Array.isArray(data)) return []
  return data.map((item: OrefHistoryItem & { rid?: number; category_desc?: string }) => {
    // alt format uses `data` for city name (English) and `rid` for id
    const cityKey = item.city || item.data || ''
    const enriched = enrichArea(cityKey)
    return {
      ...item,
      id: item.id || String(item.rid || Date.now() + Math.random()),
      city: cityKey,
      titleEn: CAT_TITLES[item.category] || item.category_desc || 'ROCKET FIRE',
      threatSource: enriched?.threatSource || 'UNKNOWN',
      region: enriched?.region || 'Unknown',
    }
  })
}

// --- OREF History fetch (tries primary + alternative endpoint) ---
async function fetchOrefHistory(): Promise<OrefHistoryItem[]> {
  const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '-') // dd-MM-yyyy
  const COMMON_HEADERS = {
    'Referer': 'https://www.oref.org.il/',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8',
  }

  for (const urlTemplate of [OREF_HISTORY_URL, OREF_HISTORY_ALT_URL]) {
    try {
      const url = urlTemplate.replace(/{DATE}/g, today)
      const res = await fetch(url, { headers: COMMON_HEADERS, signal: AbortSignal.timeout(8000) })
      if (res.ok) {
        const data = await res.json()
        const items = parseHistory(data)
        if (items.length > 0) return items
      }
    } catch { /* geo-blocked or timeout, try next */ }
  }
  return []
}

// --- Simulation for when geo-blocked ---
// Dates are always relative to "now" — each server restart reflects current time
// Hamas INACTIVE since 28 Feb 2026 — South alerts attributed to IRAN
function minsAgo(mins: number): string {
  return new Date(Date.now() - mins * 60 * 1000).toISOString()
}

const SIMULATED_HISTORY: OrefHistoryItem[] = [
  { id: 'sim-001', alertDate: minsAgo(12),  title: 'ירי רקטות וטילים', data: 'קריית שמונה', city: 'קריית שמונה', category: 1,  matrixId: 1,  titleEn: 'ROCKET / MORTAR FIRE', threatSource: 'HEZBOLLAH', region: 'North'     },
  { id: 'sim-002', alertDate: minsAgo(28),  title: 'ירי רקטות וטילים', data: 'שלומי',        city: 'שלומי',        category: 1,  matrixId: 1,  titleEn: 'ROCKET / MORTAR FIRE', threatSource: 'HEZBOLLAH', region: 'North'     },
  { id: 'sim-003', alertDate: minsAgo(45),  title: 'כטב"מ עוין',       data: 'נהריה',        city: 'נהריה',        category: 2,  matrixId: 2,  titleEn: 'HOSTILE UAV',          threatSource: 'HEZBOLLAH', region: 'North'     },
  { id: 'sim-004', alertDate: minsAgo(67),  title: 'ירי רקטות וטילים', data: 'מטולה',        city: 'מטולה',        category: 1,  matrixId: 1,  titleEn: 'ROCKET / MORTAR FIRE', threatSource: 'HEZBOLLAH', region: 'North'     },
  { id: 'sim-005', alertDate: minsAgo(93),  title: 'ירי רקטות וטילים', data: 'שדרות',        city: 'שדרות',        category: 1,  matrixId: 1,  titleEn: 'ROCKET / MORTAR FIRE', threatSource: 'IRAN',      region: 'South'     },
  { id: 'sim-006', alertDate: minsAgo(125), title: 'ירי רקטות וטילים', data: 'אשקלון',       city: 'אשקלון',       category: 1,  matrixId: 1,  titleEn: 'ROCKET / MORTAR FIRE', threatSource: 'IRAN',      region: 'South'     },
  { id: 'sim-007', alertDate: minsAgo(152), title: 'טיל בליסטי',       data: 'תל אביב',      city: 'תל אביב',      category: 13, matrixId: 13, titleEn: 'BALLISTIC MISSILE',    threatSource: 'IRAN',      region: 'Center'    },
  { id: 'sim-008', alertDate: minsAgo(153), title: 'טיל בליסטי',       data: 'ירושלים',      city: 'ירושלים',      category: 13, matrixId: 13, titleEn: 'BALLISTIC MISSILE',    threatSource: 'IRAN',      region: 'Jerusalem' },
  { id: 'sim-009', alertDate: minsAgo(154), title: 'טיל בליסטי',       data: 'חיפה',         city: 'חיפה',         category: 13, matrixId: 13, titleEn: 'BALLISTIC MISSILE',    threatSource: 'IRAN',      region: 'North'     },
  { id: 'sim-010', alertDate: minsAgo(188), title: 'ירי רקטות וטילים', data: 'נהריה',        city: 'נהריה',        category: 1,  matrixId: 1,  titleEn: 'ROCKET / MORTAR FIRE', threatSource: 'HEZBOLLAH', region: 'North'     },
  { id: 'sim-011', alertDate: minsAgo(220), title: 'ירי רקטות וטילים', data: 'קריית שמונה', city: 'קריית שמונה', category: 1,  matrixId: 1,  titleEn: 'ROCKET / MORTAR FIRE', threatSource: 'HEZBOLLAH', region: 'North'     },
  { id: 'sim-012', alertDate: minsAgo(258), title: 'כטב"מ עוין',       data: 'עכו',          city: 'עכו',          category: 2,  matrixId: 2,  titleEn: 'HOSTILE UAV',          threatSource: 'HEZBOLLAH', region: 'North'     },
  { id: 'sim-013', alertDate: minsAgo(295), title: 'ירי רקטות וטילים', data: 'אשדוד',        city: 'אשדוד',        category: 1,  matrixId: 1,  titleEn: 'ROCKET / MORTAR FIRE', threatSource: 'IRAN',      region: 'South'     },
  { id: 'sim-014', alertDate: minsAgo(342), title: 'ירי רקטות וטילים', data: 'נתיבות',       city: 'נתיבות',       category: 1,  matrixId: 1,  titleEn: 'ROCKET / MORTAR FIRE', threatSource: 'IRAN',      region: 'South'     },
  { id: 'sim-015', alertDate: minsAgo(390), title: 'טיל בליסטי',       data: 'תל אביב',      city: 'תל אביב',      category: 13, matrixId: 13, titleEn: 'BALLISTIC MISSILE',    threatSource: 'IRAN',      region: 'Center'    },
]

// --- tzevaadom.co.il community API (Israeli, no geo-block) ---
// Format: [{city: 'Hebrew', threat: 1, isDrill: false, time: epoch_sec}]
// threat codes: 1=rockets, 2=UAV, 13=ballistic — same as OREF cat codes
async function fetchTzevaAdomLive(): Promise<OrefAlert | null | 'empty'> {
  try {
    const res = await fetch(TZEVA_ADOM_API_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Origin': 'https://www.tzevaadom.co.il',
        'Referer': 'https://www.tzevaadom.co.il/',
      },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!Array.isArray(data)) return null
    if (data.length === 0) return 'empty' // connected but no active alert
    // Aggregate: all cities in current alert
    const cities: string[] = data.map((item: { city?: string }) => item.city).filter(Boolean) as string[]
    const cat: number = Number(data[0]?.threat) || 1
    return parseOrefResponse({ id: data[0]?.time || Date.now(), cat, title: '', data: cities })
  } catch {
    return null
  }
}

// Stats for summary
function buildStats(history: OrefHistoryItem[]) {
  const byRegion: Record<string, number> = {}
  const byThreat: Record<string, number> = {}
  const byType: Record<string, number> = {}
  history.forEach(h => {
    const region = h.region || 'Unknown'
    const threat = String(h.threatSource || 'UNKNOWN')
    const type = h.titleEn || 'ROCKET FIRE'
    byRegion[region] = (byRegion[region] || 0) + 1
    byThreat[threat] = (byThreat[threat] || 0) + 1
    byType[type] = (byType[type] || 0) + 1
  })
  return { total: history.length, byRegion, byThreat, byType }
}

const VALID_MODES = new Set(['live', 'history', 'stats'])

// Safe JSON parse with schema validation for OREF response
function safeParseOrefRaw(text: string): Record<string, unknown> | null {
  try {
    const raw = JSON.parse(text)
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
    if (!Array.isArray(raw.data)) return null
    return raw as Record<string, unknown>
  } catch { return null }
}

export async function GET(req: Request) {
  // Rate limit: 60 req/min per IP (live alerts poll every 10s)
  const { rateLimit } = await import('@/lib/rate-limit')
  const rl = rateLimit(req, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, {
      status: 429,
      headers: { 'Retry-After': String(rl.retryAfter) },
    })
  }

  const { searchParams } = new URL(req.url)
  const rawMode = searchParams.get('mode')
  // Whitelist: only known modes, default to 'live'
  const mode = rawMode && VALID_MODES.has(rawMode) ? rawMode : 'live'

  if (mode === 'history' || mode === 'stats') {
    if (!alertCache || Date.now() - alertCache.ts > HISTORY_TTL) {
      // Priority: relay → OREF direct → simulation
      let realHistory: OrefHistoryItem[] = []
      if (RELAY_URL) {
        // Try history-alt first — more reliable endpoint via relay
        try {
          const r = await fetch(`${RELAY_URL}/history-alt`, { signal: AbortSignal.timeout(8000) })
          if (r.ok) {
            const text = await r.text()
            if (text && text.trim().startsWith('[')) realHistory = parseHistory(JSON.parse(text))
          }
        } catch { /* relay alt failed */ }
        // Fallback to primary history endpoint
        if (!realHistory.length) {
          try {
            const r = await fetch(`${RELAY_URL}/history`, { signal: AbortSignal.timeout(8000) })
            if (r.ok) {
              const text = await r.text()
              if (text && text.trim().startsWith('[')) realHistory = parseHistory(JSON.parse(text))
            }
          } catch { /* relay unavailable */ }
        }
      }
      if (!realHistory.length) realHistory = await fetchOrefHistory()
      alertCache = {
        alerts: alertCache?.alerts || [],
        history: realHistory.length > 0 ? realHistory : SIMULATED_HISTORY,
        ts: Date.now(),
      }
    }
    if (mode === 'stats') return NextResponse.json(buildStats(alertCache.history))
    return NextResponse.json({
      history: alertCache.history,
      source: alertCache.history === SIMULATED_HISTORY ? 'SIMULATION' : (RELAY_URL ? 'OREF_RELAY' : 'OREF_LIVE'),
    })
  }

  // 1. Relay server on Israeli home machine (highest priority — real data, Israeli IP)
  if (RELAY_URL) {
    try {
      const r = await fetch(`${RELAY_URL}/live`, { signal: AbortSignal.timeout(5000) })
      if (r.ok) {
        const text = await r.text()
        let relayResponse: object
        if (!text || text.trim() === '' || text.trim() === '[]' || text.trim() === '\r\n') {
          relayResponse = { active: null, source: 'OREF_RELAY' }
        } else {
          const raw = safeParseOrefRaw(text)
          const rawData = raw?.data as string[] | undefined
          relayResponse = (!raw || !rawData || rawData.length === 0)
            ? { active: null, source: 'OREF_RELAY' }
            : { active: parseOrefResponse(raw as Parameters<typeof parseOrefResponse>[0]), source: 'OREF_RELAY' }
        }
        relayLiveCache = { response: relayResponse, ts: Date.now() }
        return NextResponse.json(relayResponse)
      }
    } catch { /* relay offline — fall through to cache or direct */ }

    // Relay failed: serve last good result if still fresh (avoids SIMULATION flicker)
    if (relayLiveCache && Date.now() - relayLiveCache.ts < RELAY_LIVE_TTL) {
      return NextResponse.json(relayLiveCache.response)
    }
  }

  // 2. OREF direct (works if this server happens to have Israeli IP)
  try {
    const res = await fetch(OREF_LIVE_URL, {
      headers: {
        'Referer': 'https://www.oref.org.il/',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'he-IL,he;q=0.9',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      const text = await res.text()
      if (!text || text.trim() === '' || text.trim() === '\r\n') {
        return NextResponse.json({ active: null, source: 'OREF_LIVE' })
      }
      const raw = JSON.parse(text)
      if (!raw || !raw.data || raw.data.length === 0) {
        return NextResponse.json({ active: null, source: 'OREF_LIVE' })
      }
      return NextResponse.json({ active: parseOrefResponse(raw), source: 'OREF_LIVE' })
    }
  } catch { /* geo-blocked from this server IP */ }

  // 3. tzevaadom.co.il community API
  const tzevaResult = await fetchTzevaAdomLive()
  if (tzevaResult === 'empty') return NextResponse.json({ active: null, source: 'TZEVA_ADOM_API' })
  if (tzevaResult !== null) return NextResponse.json({ active: tzevaResult, source: 'TZEVA_ADOM_API' })

  // 4. All server-side sources unreachable — browser will try direct fetch from Israeli IP
  return NextResponse.json({ active: null, source: 'SIMULATION', geoBlocked: true })
}
