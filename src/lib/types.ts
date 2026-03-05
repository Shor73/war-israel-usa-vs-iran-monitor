// ── Core Types ──────────────────────────────────────────────────────────────

export type ThreatLevel = 'WATCH' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'UNKNOWN'
export type AgencyType = 'CIA' | 'MOSSAD' | 'AMAN' | 'OSINT' | 'IRGC' | 'ALL'
export type ClassLevel = 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL' | 'UNCLASSIFIED'
export type OpsType = 'STRIKE' | 'INTERCEPT' | 'LAUNCH' | 'RECON' | 'NAVAL' | 'CYBER' | 'DIPLOMATIC'
export type EventType = 'military' | 'diplomatic' | 'economic' | 'intelligence' | 'humanitarian'
export type WeaponCategory = 'BALLISTIC' | 'CRUISE' | 'DRONE' | 'HYPERSONIC'
export type Actor = 'Iran' | 'IDF' | 'USA' | 'Hezbollah' | 'Houthi'

// ── News & Intel ─────────────────────────────────────────────────────────────

export interface NewsItem {
  id: string
  title: string
  link: string
  pubDate: string
  source: string
  category: 'WIRE' | 'WESTERN' | 'ISRAELI' | 'IRANIAN' | 'ARAB' | 'DEFENSE' | 'FINANCIAL' | 'OSINT'
  isBreaking?: boolean
  aiTag?: 'MILITARY' | 'DIPLOMATIC' | 'ECONOMIC' | 'HUMANITARIAN' | 'INTELLIGENCE'
  snippet?: string
}

export interface IntelEntry {
  id: string
  dtg: string            // e.g. "041650ZMAR2026"
  originator: string     // e.g. "CIA/DO/NE"
  agency: AgencyType
  classification: ClassLevel
  source: string         // e.g. "SIGINT", "HUMINT", "OSINT"
  subject: string
  body: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN'
  isBreaking?: boolean
}

export interface OpsLogEntry {
  id: string
  dtg: string
  type: OpsType
  location: string
  description: string
  status: 'ACTIVE' | 'SUCCESS' | 'FAILED' | 'TRACKING' | 'AIRBORNE' | 'MONITOR'
  actor: string
}

export interface TickerItem {
  id: string
  severity: 'CRITICAL' | 'ELEVATED' | 'WATCH'
  dtg: string
  text: string
}

// ── Conflict & Strikes ───────────────────────────────────────────────────────

export interface WeaponSystem {
  name: string
  type: WeaponCategory
  range: number          // km
  payload?: number       // kg
  launched: number
  intercepted: number
  hit: number
  hitRate: number        // percentage
  actor: Actor
  interceptedBy?: string
}

export interface StrikeGroup {
  actor: Actor
  direction: string       // e.g. "Iran → Israel"
  systems: WeaponSystem[]
  totalLaunched: number
  totalIntercepted: number
  totalHit: number
  overallHitRate: number
}

export interface DailyStrikeData {
  date: string
  iran: number
  idf: number
  usa: number
  hezbollah: number
  houthi: number
}

export interface ConflictEvent {
  id: number
  date: string
  type: EventType
  actor: string
  title: string
  detail: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
}

// ── Map & Geographic ─────────────────────────────────────────────────────────

export interface MilitaryBase {
  id: string
  name: string
  country: string
  lat: number
  lng: number
  type: string
  assets: string
  status: string
  threat: string
  faction: 'usa' | 'idf' | 'irgc' | 'hezbollah' | 'houthi'
}

export interface NuclearSite {
  id: string
  name: string
  lat: number
  lng: number
  type: string
  status: string
  detail: string
  enrichment?: string
  threat: string
}

export interface Chokepoint {
  id: string
  name: string
  lat: number
  lng: number
  status: 'OPEN' | 'RESTRICTED' | 'HOSTILE' | 'CLOSED'
  dailyTrafficMMBD: number
  threatLevel: ThreatLevel
  detail: string
}

export interface MissileArc {
  from: [number, number]
  to: [number, number]
  weaponType: WeaponCategory
  actor: Actor
  date: string
  intercepted: boolean
}

// ── Economic & Markets ───────────────────────────────────────────────────────

export interface OilPrice {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  timestamp: string
}

export interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  sector: 'defense' | 'energy' | 'regional'
}

export interface SanctionEvent {
  date: string
  actor: string
  type: string
  description: string
}

// ── Airspace ─────────────────────────────────────────────────────────────────

export interface NotamEntry {
  fir: string
  firCode: string
  status: 'CLOSED' | 'RESTRICTED' | 'CAUTION' | 'NORMAL'
  country: string
  detail: string
}

export interface AirlineStatus {
  name: string
  iata: string
  status: 'SUSPENDED' | 'REROUTING' | 'NORMAL' | 'ENHANCED'
  routes: string
  extraHours?: number
  extraCost?: number
}

// ── Gulf States ──────────────────────────────────────────────────────────────

export interface GulfState {
  code: string
  name: string
  flag: string
  threat: ThreatLevel
  stance: 'ALLY' | 'CAUTIOUS' | 'NEUTRAL' | 'CONTESTED' | 'HOSTILE' | 'MEDIATOR'
  usBases: string[]
  keyFactor: string
  latestDevelopment?: string
}

// ── System ───────────────────────────────────────────────────────────────────

export interface SystemStatus {
  rss: 'OK' | 'DEGRADED' | 'ERROR'
  map: 'OK' | 'DEGRADED' | 'ERROR'
  markets: 'OK' | 'DEGRADED' | 'ERROR'
  sse: 'OK' | 'DEGRADED' | 'ERROR'
  feedCount: number
  lastUpdate: string
}

export interface DashboardState {
  threatLevel: ThreatLevel
  defcon: number
  fpcon: 'NORMAL' | 'ALPHA' | 'BRAVO' | 'CHARLIE' | 'DELTA'
  activeTheater: 'CENTCOM' | 'EUCOM' | 'FULL'
  soundEnabled: boolean
  activePanel: string | null
  nuclearWatchOpen: boolean
  briefOpen: boolean
  agencyFilter: AgencyType
  newsCategory: string
  mapLayers: {
    usaBases: boolean
    idfBases: boolean
    irgcSites: boolean
    nuclearSites: boolean
    missileArcs: boolean
    ironDome: boolean
    carriers: boolean
    noFlyZones: boolean
    pipelines: boolean
    chokepoints: boolean
  }
}
