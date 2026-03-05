'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import type { OrefHistoryItem } from '@/../../app/api/alerts/route'
import { Flag, THREAT_ISO } from '@/components/ui/Flag'

type ThreatSource = 'HAMAS' | 'HEZBOLLAH' | 'IRAN' | 'HOUTHI' | 'UNKNOWN'

const THREAT_COLORS: Record<ThreatSource, string> = {
  HAMAS: '#7f8c9b',     // grey — Hamas INACTIVE since 28 Feb 2026
  HEZBOLLAH: '#ab47bc',
  IRAN: '#ff2d2d',
  HOUTHI: '#ffc107',
  UNKNOWN: '#7f8c9b',
}

const THREAT_LABELS: Record<ThreatSource, string> = {
  HAMAS: 'HAMAS (INACTIVE)',
  HEZBOLLAH: 'HEZBOLLAH / LEBANON',
  IRAN: 'IRAN (IRGC)',
  HOUTHI: 'HOUTHI / YEMEN',
  UNKNOWN: 'UNKNOWN',
}

function ThreatBadge({ threat, color }: { threat: ThreatSource; color: string }) {
  const iso = THREAT_ISO[threat]
  return (
    <span className="flex items-center gap-1" style={{ color }}>
      {iso && iso !== 'un' ? <Flag iso={iso} size={14} /> : <span>?</span>}
      <span>{THREAT_LABELS[threat]}</span>
    </span>
  )
}

// Minimal area DB for browser-side parsing (when doing direct OREF fetch)
const BROWSER_AREA_DB: Record<string, { nameEn: string; region: string; threatSource: ThreatSource; timeToImpact: number }> = {
  'קריית שמונה': { nameEn: 'Kiryat Shmona', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 15 },
  'נהריה': { nameEn: 'Nahariya', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 20 },
  'עכו': { nameEn: 'Akko', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 25 },
  'חיפה': { nameEn: 'Haifa', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 30 },
  'טבריה': { nameEn: 'Tiberias', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 25 },
  'צפת': { nameEn: 'Safed', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 20 },
  'מטולה': { nameEn: 'Metula', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 10 },
  'שלומי': { nameEn: 'Shlomi', region: 'North', threatSource: 'HEZBOLLAH', timeToImpact: 12 },
  'תל אביב': { nameEn: 'Tel Aviv', region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  'ירושלים': { nameEn: 'Jerusalem', region: 'Jerusalem', threatSource: 'IRAN', timeToImpact: 90 },
  'חולון': { nameEn: 'Holon', region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  'ראשון לציון': { nameEn: 'Rishon LeZion', region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  'נתניה': { nameEn: 'Netanya', region: 'Center', threatSource: 'IRAN', timeToImpact: 90 },
  'באר שבע': { nameEn: 'Beer Sheva', region: 'South', threatSource: 'IRAN', timeToImpact: 90 },
  'אשקלון': { nameEn: 'Ashkelon', region: 'South', threatSource: 'IRAN', timeToImpact: 90 },
  'אשדוד': { nameEn: 'Ashdod', region: 'South', threatSource: 'IRAN', timeToImpact: 90 },
  'שדרות': { nameEn: 'Sderot', region: 'South', threatSource: 'IRAN', timeToImpact: 90 },
  'אילת': { nameEn: 'Eilat', region: 'South', threatSource: 'HOUTHI', timeToImpact: 120 },
}
const BROWSER_CAT_TITLES: Record<number, string> = {
  1: 'ROCKET / MORTAR FIRE', 2: 'HOSTILE UAV', 3: 'HOSTILE AIRCRAFT',
  4: 'SECURITY INCIDENT', 6: 'UNIDENTIFIED AIRCRAFT', 13: 'BALLISTIC MISSILE',
}
// Browser-side fallback URLs (tried in order when server is geo-blocked)
const OREF_DIRECT_URL = 'https://www.oref.org.il/WarningMessages/alert/alerts.json'
const TZEVA_ADOM_BROWSER_URL = 'https://api.tzevaadom.co.il/notifications'

const REGION_COLORS: Record<string, string> = {
  North: '#00e676',
  Center: '#ffc107',
  Jerusalem: '#2196f3',
  South: '#ff6b35',
  Unknown: '#7f8c9b',
}

const CAT_ICONS: Record<number, string> = {
  1: '🚀',
  2: '✈ UAV',
  3: '✈',
  4: '⚠',
  6: '❓',
  13: '⬆ BALLISTIC',
}

const CAT_COLORS: Record<number, string> = {
  1: '#ff6b35',
  2: '#ab47bc',
  3: '#ff2d2d',
  4: '#ffc107',
  6: '#7f8c9b',
  13: '#ff2d2d',
}

interface Stats {
  total: number
  byRegion: Record<string, number>
  byThreat: Record<string, number>
  byType: Record<string, number>
}

interface LiveAlertResponse {
  active: {
    id: string
    cat: number
    titleEn: string
    dataEn: string[]
    areas: { nameEn: string; region: string; threatSource: ThreatSource; timeToImpact: number }[]
    threatSource: ThreatSource
    timeToImpact: number
    ts: number
  } | null
  source: string
  geoBlocked?: boolean
}

interface HistoryResponse {
  history: OrefHistoryItem[]
  source: string
}

function formatAlertTime(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    const day = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    return `${day} ${h}:${m}Z`
  } catch {
    return dateStr
  }
}

function timeAgoShort(dateStr: string): string {
  try {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
    if (diff < 60) return `${Math.round(diff)}s ago`
    if (diff < 3600) return `${Math.round(diff / 60)}m ago`
    return `${Math.round(diff / 3600)}h ago`
  } catch {
    return ''
  }
}

// --- Siren synthesis (Web Audio API) ---
// Pattern: Israeli Tzeva Adom — slow sweep 300→800Hz, sawtooth wave, 3 cycles ~10.5s total
function playSiren(audioCtx: AudioContext, muted: boolean): (() => void) {
  if (muted) return () => {}
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.type = 'sawtooth'

  const now = audioCtx.currentTime
  const period = 3.5 // seconds per wail cycle
  const cycles = 3

  for (let i = 0; i < cycles; i++) {
    const t = now + i * period
    osc.frequency.setValueAtTime(300, t)
    osc.frequency.linearRampToValueAtTime(800, t + period * 0.55)
    osc.frequency.linearRampToValueAtTime(300, t + period)
  }

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.35, now + 0.15)
  gain.gain.setValueAtTime(0.35, now + period * cycles - 0.4)
  gain.gain.linearRampToValueAtTime(0, now + period * cycles)

  osc.start(now)
  osc.stop(now + period * cycles)

  return () => {
    try { osc.stop(); gain.gain.setValueAtTime(0, audioCtx.currentTime) } catch { /* already stopped */ }
  }
}

const LS_HISTORY_KEY = 'warops_alert_history_v1'
const LS_STATS_KEY = 'warops_alert_stats_v1'

function loadCached<T>(key: string): T | null {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    return raw ? (JSON.parse(raw) as T) : null
  } catch { return null }
}

function saveCache(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota */ }
}

export default function ZevaAdom() {
  const [activeAlert, setActiveAlert] = useState<LiveAlertResponse['active']>(null)
  const [history, setHistory] = useState<OrefHistoryItem[]>(() => loadCached<OrefHistoryItem[]>(LS_HISTORY_KEY) || [])
  const [stats, setStats] = useState<Stats | null>(() => loadCached<Stats>(LS_STATS_KEY))
  const [source, setSource] = useState<string>('...')
  const [geoBlocked, setGeoBlocked] = useState(false)
  const [activeTab, setActiveTab] = useState<'live' | 'history' | 'stats'>('live')
  const [flashActive, setFlashActive] = useState(false)
  const [sirenMuted, setSirenMuted] = useState(false)
  const prevAlertId = useRef<string | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const stopSirenRef = useRef<(() => void) | null>(null)

  // Initialize AudioContext on first user interaction (browser autoplay policy)
  const ensureAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
  }, [])

  // Browser-direct fetch: tries tzevaadom.co.il first (CORS-enabled API), then OREF direct
  const pollLiveDirect = useCallback(async (): Promise<boolean> => {
    // --- Attempt 1: tzevaadom.co.il (developer API, CORS-friendly) ---
    try {
      const res = await fetch(TZEVA_ADOM_BROWSER_URL, {
        headers: { 'Accept': 'application/json', 'Origin': 'https://www.tzevaadom.co.il', 'Referer': 'https://www.tzevaadom.co.il/' },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      })
      if (res.ok) {
        const data = await res.json()
        if (!Array.isArray(data) || data.length === 0) {
          setActiveAlert(null)
          setSource('TZEVA_ADOM_API')
          setGeoBlocked(false)
          return true
        }
        const cities: string[] = data.map((item: { city?: string }) => item.city).filter(Boolean) as string[]
        const cat = Number(data[0]?.threat) || 1
        const areas = cities.map(nameHe => {
          const known = BROWSER_AREA_DB[nameHe]
          return known ? { ...known, nameHe } : { nameHe, nameEn: nameHe, region: 'Unknown', threatSource: 'UNKNOWN' as ThreatSource, timeToImpact: 60 }
        })
        const alert: LiveAlertResponse['active'] = {
          id: String(data[0]?.time || Date.now()),
          cat,
          titleEn: BROWSER_CAT_TITLES[cat] || 'ROCKET FIRE',
          dataEn: areas.map(a => a.nameEn),
          areas,
          threatSource: areas[0]?.threatSource || 'UNKNOWN',
          timeToImpact: Math.min(...areas.map(a => a.timeToImpact), 60),
          ts: Date.now(),
        }
        if (alert.id !== prevAlertId.current) {
          prevAlertId.current = alert.id
          setFlashActive(true)
          setTimeout(() => setFlashActive(false), 5000)
        }
        setActiveAlert(alert)
        setSource('TZEVA_ADOM_API')
        setGeoBlocked(false)
        return true
      }
    } catch { /* tzevaadom unavailable or CORS blocked, try OREF direct */ }

    // --- Attempt 2: OREF direct (may work if user is on Israeli IP with CORS support) ---
    try {
      const res = await fetch(OREF_DIRECT_URL, {
        headers: { 'Referer': 'https://www.oref.org.il/', 'X-Requested-With': 'XMLHttpRequest' },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) return false
      const text = await res.text()
      if (!text || text.trim() === '' || text.trim() === '\r\n') {
        setActiveAlert(null)
        setSource('OREF_DIRECT')
        setGeoBlocked(false)
        return true
      }
      const raw = JSON.parse(text)
      if (!raw || !raw.data || raw.data.length === 0) {
        setActiveAlert(null)
        setSource('OREF_DIRECT')
        setGeoBlocked(false)
        return true
      }
      const areas = (raw.data as string[]).map(nameHe => {
        const known = BROWSER_AREA_DB[nameHe]
        return known ? { ...known, nameHe } : { nameHe, nameEn: nameHe, region: 'Unknown', threatSource: 'UNKNOWN' as ThreatSource, timeToImpact: 60 }
      })
      const cat = Number(raw.cat) || 1
      const alert: LiveAlertResponse['active'] = {
        id: String(raw.id || Date.now()),
        cat,
        titleEn: BROWSER_CAT_TITLES[cat] || 'ROCKET FIRE',
        dataEn: areas.map(a => a.nameEn),
        areas,
        threatSource: areas[0]?.threatSource || 'UNKNOWN',
        timeToImpact: Math.min(...areas.map(a => a.timeToImpact), 60),
        ts: Date.now(),
      }
      if (alert.id !== prevAlertId.current) {
        prevAlertId.current = alert.id
        setFlashActive(true)
        setTimeout(() => setFlashActive(false), 5000)
      }
      setActiveAlert(alert)
      setSource('OREF_DIRECT')
      setGeoBlocked(false)
      return true
    } catch {
      return false
    }
  }, [])

  const pollLive = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts?mode=live')
      if (!res.ok) return
      const data: LiveAlertResponse = await res.json()

      // If server is geo-blocked, try fetching OREF directly from this browser
      if (data.geoBlocked) {
        const directOk = await pollLiveDirect()
        if (!directOk) {
          // Both server and browser blocked — stay in simulation
          setSource('SIMULATION')
          setGeoBlocked(true)
        }
        return
      }

      setSource(data.source)
      setGeoBlocked(false)
      if (data.active) {
        if (data.active.id !== prevAlertId.current) {
          prevAlertId.current = data.active.id
          setFlashActive(true)
          setTimeout(() => setFlashActive(false), 5000)
        }
        setActiveAlert(data.active)
      } else {
        setActiveAlert(null)
      }
    } catch { /* ignore */ }
  }, [pollLiveDirect])

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts?mode=history')
      if (!res.ok) return
      const data: HistoryResponse = await res.json()
      const items = data.history || []
      setHistory(items)
      if (items.length > 0) saveCache(LS_HISTORY_KEY, items)
    } catch { /* ignore */ }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts?mode=stats')
      if (!res.ok) return
      const data: Stats = await res.json()
      setStats(data)
      saveCache(LS_STATS_KEY, data)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    pollLive()
    fetchHistory()
    fetchStats()
    const liveId = setInterval(pollLive, 10 * 1000)
    const historyId = setInterval(fetchHistory, 2 * 60 * 1000)
    return () => { clearInterval(liveId); clearInterval(historyId) }
  }, [pollLive, fetchHistory, fetchStats])

  // Play siren when a NEW alert fires (flashActive transitions to true)
  useEffect(() => {
    if (!flashActive) return
    ensureAudioCtx()
    const ctx = audioCtxRef.current
    if (!ctx) return
    // Stop any previous siren still playing
    stopSirenRef.current?.()
    stopSirenRef.current = playSiren(ctx, sirenMuted)
  }, [flashActive, sirenMuted, ensureAudioCtx])

  return (
    <div className="flex flex-col h-full" style={{ background: '#060c12' }}>
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b"
        style={{ borderColor: '#ff2d2d', background: 'rgba(255,45,45,0.08)' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: '#ff2d2d', fontSize: 14 }}>🔴</span>
          <span className="font-military text-[11px]" style={{ color: '#ff2d2d' }}>
            צבע אדום — TZEVA ADOM
          </span>
          <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>
            IDF HOME FRONT COMMAND
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mute toggle */}
          <button
            onClick={() => { ensureAudioCtx(); setSirenMuted(m => !m) }}
            className="font-military text-[7px] border px-1 py-0.5 transition-colors"
            title={sirenMuted ? 'Unmute siren' : 'Mute siren'}
            style={{
              color: sirenMuted ? '#4a6a7a' : '#ff2d2d',
              borderColor: sirenMuted ? '#4a6a7a' : '#ff2d2d44',
            }}
          >
            {sirenMuted ? '🔇 MUTE' : '🔊 SIREN'}
          </button>
          {/* Source indicator */}
          <span
            className="font-military text-[7px] border px-1 py-0.5"
            style={{
              color: geoBlocked ? '#ffc107' : '#00e676',
              borderColor: geoBlocked ? '#ffc107' : '#00e676',
            }}
          >
            {geoBlocked ? '⚠ SIMULATION' : source === 'OREF_DIRECT' ? '⚡ OREF_DIRECT (IL)' : `● ${source}`}
          </span>
          <span className="font-military text-[7px]" style={{ color: '#4a6a7a' }}>POLL: 10s</span>
        </div>
      </div>

      {/* Active Alert Banner */}
      {activeAlert ? (
        <div
          className="flex-shrink-0 border-b p-2"
          style={{
            borderColor: '#ff2d2d',
            background: flashActive ? 'rgba(255,45,45,0.25)' : 'rgba(255,45,45,0.12)',
            transition: 'background 0.5s',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-military text-[10px] animate-pulse" style={{ color: '#ff2d2d' }}>
              ⚠ ACTIVE ALERT
            </span>
            <span
              className="font-military text-[9px] border px-1"
              style={{ color: CAT_COLORS[activeAlert.cat], borderColor: CAT_COLORS[activeAlert.cat] }}
            >
              {CAT_ICONS[activeAlert.cat]} {activeAlert.titleEn}
            </span>
            <span className="font-military text-[9px] ml-auto">
              <ThreatBadge threat={activeAlert.threatSource} color={THREAT_COLORS[activeAlert.threatSource]} />
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mb-1">
            {activeAlert.areas.map((area, i) => (
              <span
                key={i}
                className="font-military text-[8px] border px-1"
                style={{ color: REGION_COLORS[area.region] || '#c8d6e5', borderColor: `${REGION_COLORS[area.region]}50` }}
              >
                {area.nameEn} ({area.region})
              </span>
            ))}
          </div>
          <div className="font-military text-[8px]" style={{ color: '#ff6b35' }}>
            ⏱ TIME TO IMPACT: {activeAlert.timeToImpact}s — SEEK SHELTER IMMEDIATELY
          </div>
        </div>
      ) : (
        <div
          className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border-b"
          style={{ borderColor: '#1e2d3d', background: 'rgba(0,230,118,0.05)' }}
        >
          <span style={{ color: '#00e676', fontSize: 10 }}>●</span>
          <span className="font-military text-[9px]" style={{ color: '#00e676' }}>
            NO ACTIVE ALERT
          </span>
          <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>
            — monitoring all sectors
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-shrink-0 border-b" style={{ borderColor: '#1e2d3d' }}>
        {(['live', 'history', 'stats'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="font-military text-[8px] px-3 py-1.5 flex-1 transition-colors"
            style={{
              color: activeTab === tab ? '#ff2d2d' : '#4a6a7a',
              backgroundColor: activeTab === tab ? 'rgba(255,45,45,0.08)' : 'transparent',
              borderBottom: activeTab === tab ? '1px solid #ff2d2d' : 'none',
            }}
          >
            {tab === 'live' ? '🔴 LIVE FEED' : tab === 'history' ? '📋 TODAY\'S HISTORY' : '📊 STATISTICS'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* LIVE TAB */}
        {activeTab === 'live' && (
          <div>
            {history.slice(0, 8).map((item, idx) => (
              <AlertRow key={item.id || idx} item={item} />
            ))}
            {history.length === 0 && (
              <div className="p-4 font-military text-[8px] text-center" style={{ color: '#4a6a7a' }}>
                LOADING ALERT FEED...
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div>
            <div
              className="px-3 py-1 font-military text-[8px] border-b flex justify-between"
              style={{ borderColor: '#1e2d3d', color: '#4a6a7a' }}
            >
              <span>TODAY — {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span>{history.length} ALERTS</span>
            </div>
            {history.map((item, idx) => (
              <AlertRow key={item.id || idx} item={item} showTime />
            ))}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && stats && (
          <div className="p-3 space-y-3">
            {/* Total */}
            <div className="text-center border py-3" style={{ borderColor: '#ff2d2d', background: 'rgba(255,45,45,0.05)' }}>
              <div className="font-military text-2xl" style={{ color: '#ff2d2d' }}>{stats.total}</div>
              <div className="font-military text-[8px]" style={{ color: '#7f8c9b' }}>TOTAL ALERTS TODAY</div>
            </div>

            {/* By Region */}
            <div>
              <div className="font-military text-[8px] mb-1" style={{ color: '#4a6a7a' }}>ALERTS BY REGION</div>
              {Object.entries(stats.byRegion).sort((a, b) => b[1] - a[1]).map(([region, count]) => (
                <div key={region} className="flex items-center gap-2 mb-1">
                  <span className="font-military text-[8px] w-20 flex-shrink-0" style={{ color: REGION_COLORS[region] || '#c8d6e5' }}>
                    {region.toUpperCase()}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1e2d3d' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((count / stats.total) * 100)}%`,
                        background: REGION_COLORS[region] || '#c8d6e5',
                      }}
                    />
                  </div>
                  <span className="font-mono-data text-[9px] w-6 text-right flex-shrink-0" style={{ color: '#c8d6e5' }}>{count}</span>
                </div>
              ))}
            </div>

            {/* By Threat Source */}
            <div>
              <div className="font-military text-[8px] mb-1" style={{ color: '#4a6a7a' }}>ALERTS BY THREAT SOURCE</div>
              {Object.entries(stats.byThreat).sort((a, b) => b[1] - a[1]).map(([threat, count]) => (
                <div key={threat} className="flex items-center justify-between border-b py-1" style={{ borderColor: '#0d1520' }}>
                  <ThreatBadge threat={threat as ThreatSource} color={THREAT_COLORS[threat as ThreatSource] || '#7f8c9b'} />
                  <span className="font-mono-data text-[10px]" style={{ color: '#c8d6e5' }}>{count}</span>
                </div>
              ))}
            </div>

            {/* By Type */}
            <div>
              <div className="font-military text-[8px] mb-1" style={{ color: '#4a6a7a' }}>ALERTS BY TYPE</div>
              {Object.entries(stats.byType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between border-b py-1" style={{ borderColor: '#0d1520' }}>
                  <span className="font-military text-[8px]" style={{ color: '#c8d6e5' }}>{type}</span>
                  <span className="font-mono-data text-[10px]" style={{ color: '#ffc107' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && !stats && (
          <div className="p-4 font-military text-[8px] text-center" style={{ color: '#4a6a7a' }}>LOADING STATS...</div>
        )}
      </div>
    </div>
  )
}

function AlertRow({ item, showTime }: { item: OrefHistoryItem; showTime?: boolean }) {
  const threat = (item.threatSource || 'UNKNOWN') as ThreatSource
  const cat = item.category || 1
  return (
    <div
      className="flex items-start gap-2 border-b px-3 py-1.5 hover:bg-white/5 transition-colors"
      style={{ borderColor: '#0d1520' }}
    >
      {/* Category icon */}
      <span className="font-military text-[9px] flex-shrink-0 mt-0.5" style={{ color: CAT_COLORS[cat] || '#ff6b35' }}>
        {CAT_ICONS[cat] || '🚀'}
      </span>

      <div className="flex-1 min-w-0">
        {/* Alert type + threat */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-military text-[8px]" style={{ color: CAT_COLORS[cat] || '#ff6b35' }}>
            {item.titleEn || 'ROCKET FIRE'}
          </span>
          <span
            className="font-military text-[7px] border px-0.5 flex-shrink-0 flex items-center gap-0.5"
            style={{ color: THREAT_COLORS[threat], borderColor: `${THREAT_COLORS[threat]}50` }}
          >
            {THREAT_ISO[threat] && THREAT_ISO[threat] !== 'un' && <Flag iso={THREAT_ISO[threat]} size={11} />}
            {threat}
          </span>
        </div>

        {/* Area */}
        <div className="font-military text-[9px] mt-0.5" style={{ color: '#c8d6e5' }}>
          {item.city || item.data}
          {item.region && (
            <span className="ml-1" style={{ color: REGION_COLORS[item.region] || '#4a6a7a' }}>
              [{item.region}]
            </span>
          )}
        </div>

        {/* Hebrew name */}
        <div className="font-mono-data text-[8px]" style={{ color: '#4a6a7a', direction: 'rtl', textAlign: 'left' }}>
          {item.data}
        </div>
      </div>

      {/* Time */}
      <div className="flex flex-col items-end flex-shrink-0">
        {showTime ? (
          <span className="font-mono-data text-[8px]" style={{ color: '#4a6a7a' }}>
            {formatAlertTime(item.alertDate)}
          </span>
        ) : (
          <span className="font-mono-data text-[8px]" style={{ color: '#4a6a7a' }}>
            {timeAgoShort(item.alertDate)}
          </span>
        )}
      </div>
    </div>
  )
}
