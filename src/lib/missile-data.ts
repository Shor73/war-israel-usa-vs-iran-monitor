import type { StrikeGroup, DailyStrikeData, MissileArc } from './types'

export const STRIKE_GROUPS: StrikeGroup[] = [
  {
    actor: 'Iran',
    direction: 'Iran → Israel',
    totalLaunched: 630,
    totalIntercepted: 515,
    totalHit: 115,
    overallHitRate: 18.3,
    systems: [
      { name: 'Fattah-1', type: 'HYPERSONIC', range: 1400, payload: 500, launched: 12, intercepted: 8, hit: 4, hitRate: 33.3, actor: 'Iran', interceptedBy: 'Arrow-3' },
      { name: 'Shahab-3', type: 'BALLISTIC', range: 1300, payload: 760, launched: 45, intercepted: 38, hit: 7, hitRate: 15.6, actor: 'Iran', interceptedBy: 'Arrow-2' },
      { name: 'Emad', type: 'BALLISTIC', range: 1700, payload: 750, launched: 18, intercepted: 14, hit: 4, hitRate: 22.2, actor: 'Iran', interceptedBy: 'Arrow-2' },
      { name: 'Ghadr-110', type: 'BALLISTIC', range: 1950, payload: 650, launched: 22, intercepted: 19, hit: 3, hitRate: 13.6, actor: 'Iran', interceptedBy: 'Arrow-3' },
      { name: 'Sejjil', type: 'BALLISTIC', range: 2000, payload: 500, launched: 8, intercepted: 6, hit: 2, hitRate: 25.0, actor: 'Iran', interceptedBy: 'Arrow-3' },
      { name: 'Kheibar Shekan', type: 'BALLISTIC', range: 1450, payload: 500, launched: 15, intercepted: 12, hit: 3, hitRate: 20.0, actor: 'Iran', interceptedBy: 'Arrow-2' },
      { name: 'Shahed-136', type: 'DRONE', range: 2500, payload: 50, launched: 380, intercepted: 323, hit: 57, hitRate: 15.0, actor: 'Iran', interceptedBy: 'Iron Dome' },
      { name: 'Shahed-238', type: 'DRONE', range: 1500, payload: 85, launched: 85, intercepted: 63, hit: 22, hitRate: 25.9, actor: 'Iran', interceptedBy: 'Iron Dome' },
      { name: 'Mohajer-6', type: 'DRONE', range: 200, payload: 40, launched: 45, intercepted: 32, hit: 13, hitRate: 28.9, actor: 'Iran', interceptedBy: 'Iron Dome' },
    ]
  },
  {
    actor: 'Hezbollah',
    direction: 'Lebanon → Israel',
    totalLaunched: 545,
    totalIntercepted: 438,
    totalHit: 107,
    overallHitRate: 19.6,
    systems: [
      { name: 'Fajr-5', type: 'BALLISTIC', range: 75, launched: 45, intercepted: 38, hit: 7, hitRate: 15.6, actor: 'Hezbollah', interceptedBy: 'Iron Dome' },
      { name: 'Fateh-110', type: 'BALLISTIC', range: 300, launched: 8, intercepted: 6, hit: 2, hitRate: 25.0, actor: 'Hezbollah', interceptedBy: "David's Sling" },
      { name: 'Zelzal-2', type: 'BALLISTIC', range: 200, launched: 12, intercepted: 10, hit: 2, hitRate: 16.7, actor: 'Hezbollah', interceptedBy: 'Iron Dome' },
      { name: 'Katyusha / misc', type: 'BALLISTIC', range: 40, launched: 480, intercepted: 384, hit: 96, hitRate: 20.0, actor: 'Hezbollah', interceptedBy: 'Iron Dome' },
    ]
  },
  {
    actor: 'Houthi',
    direction: 'Yemen → Red Sea/Israel',
    totalLaunched: 62,
    totalIntercepted: 49,
    totalHit: 13,
    overallHitRate: 21.0,
    systems: [
      { name: 'Toofan cruise', type: 'CRUISE', range: 800, launched: 8, intercepted: 7, hit: 1, hitRate: 12.5, actor: 'Houthi', interceptedBy: 'SM-2' },
      { name: 'Shahed-136', type: 'DRONE', range: 2500, payload: 50, launched: 28, intercepted: 22, hit: 6, hitRate: 21.4, actor: 'Houthi', interceptedBy: 'SM-6' },
      { name: 'Quds-series', type: 'CRUISE', range: 1200, launched: 8, intercepted: 6, hit: 2, hitRate: 25.0, actor: 'Houthi', interceptedBy: 'SM-2' },
      { name: 'Badr-1 ballistic', type: 'BALLISTIC', range: 800, launched: 10, intercepted: 8, hit: 2, hitRate: 20.0, actor: 'Houthi', interceptedBy: 'Patriot' },
      { name: 'Asef UAV', type: 'DRONE', range: 1500, launched: 8, intercepted: 6, hit: 2, hitRate: 25.0, actor: 'Houthi', interceptedBy: 'SM-6' },
    ]
  },
  {
    actor: 'IDF',
    direction: 'Israel → Iran',
    totalLaunched: 255,
    totalIntercepted: 18,
    totalHit: 188,
    overallHitRate: 92.2,
    systems: [
      { name: 'F-35I Adir strikes', type: 'BALLISTIC', range: 2000, launched: 120, intercepted: 5, hit: 108, hitRate: 95.0, actor: 'IDF', interceptedBy: 'S-300/Bavar' },
      { name: 'F-15I Ra\'am strikes', type: 'BALLISTIC', range: 1800, launched: 80, intercepted: 6, hit: 71, hitRate: 92.5, actor: 'IDF' },
      { name: 'LORA SRBM', type: 'BALLISTIC', range: 400, launched: 12, intercepted: 1, hit: 11, hitRate: 91.7, actor: 'IDF' },
      { name: 'Delilah cruise', type: 'CRUISE', range: 250, launched: 25, intercepted: 3, hit: 22, hitRate: 88.0, actor: 'IDF' },
      { name: 'Harop loitering', type: 'DRONE', range: 1000, launched: 18, intercepted: 3, hit: 15, hitRate: 83.3, actor: 'IDF' },
    ]
  },
  {
    actor: 'USA',
    direction: 'USA → Iran',
    totalLaunched: 298,
    totalIntercepted: 9,
    totalHit: 289,
    overallHitRate: 97.0,
    systems: [
      { name: 'Tomahawk TLAM', type: 'CRUISE', range: 2500, launched: 150, intercepted: 5, hit: 142, hitRate: 94.7, actor: 'USA' },
      { name: 'JASSM-ER', type: 'CRUISE', range: 980, launched: 80, intercepted: 3, hit: 76, hitRate: 95.0, actor: 'USA' },
      { name: 'B-2 GBU-57 MOP', type: 'BALLISTIC', range: 0, launched: 16, intercepted: 0, hit: 16, hitRate: 100.0, actor: 'USA' },
      { name: 'F-35A/C carrier strikes', type: 'BALLISTIC', range: 1200, launched: 52, intercepted: 1, hit: 55, hitRate: 95.0, actor: 'USA' },
    ]
  }
]

export const DAILY_STRIKES: DailyStrikeData[] = [
  { date: 'D+0 28Feb', iran: 200, idf: 120, usa: 166, hezbollah: 0,   houthi: 0  },
  { date: 'D+1 01Mar', iran: 145, idf: 80,  usa: 90,  hezbollah: 0,   houthi: 8  },
  { date: 'D+2 02Mar', iran: 58,  idf: 40,  usa: 30,  hezbollah: 100, houthi: 14 },
  { date: 'D+3 03Mar', iran: 35,  idf: 15,  usa: 12,  hezbollah: 210, houthi: 14 },
  { date: 'D+4 04Mar', iran: 105, idf: 38,  usa: 22,  hezbollah: 150, houthi: 14 },
  { date: 'D+5 05Mar', iran: 87,  idf: 55,  usa: 35,  hezbollah: 85,  houthi: 12 }, // ONGOING
]

// ── Arsenal Depletion Status (D+5) ──────────────────────────────────────────

export const ARSENAL_STATUS = {
  Iran: {
    mrbm:    { label: 'IRAN MRBM/IRBM',  preWar: 1450, launched: 120, groundDestroyed: 310, remaining: 1020, pct: 70, color: '#ff2d2d' },
    drones:  { label: 'IRAN DRONES',     preWar: 2200, launched: 510, groundDestroyed: 130, remaining: 1560, pct: 71, color: '#ff5722' },
    fattah1: { label: 'FATTAH-1 HYPRSN', preWar: 21,   launched: 12,  groundDestroyed: 1,   remaining: 8,    pct: 38, color: '#ab47bc' },
  },
  Hezbollah: {
    rockets: { label: 'HEZBOLLAH RCKT',  preWar: 150000, launched: 545, groundDestroyed: 800, remaining: 148655, pct: 99, color: '#ab47bc' },
  },
  Houthi: {
    missiles: { label: 'HOUTHI MSLS',    preWar: 420,  launched: 62,  groundDestroyed: 28,  remaining: 330,  pct: 79, color: '#ffc107' },
  },
}

// ── Israeli/Coalition Defense Ammo Status (D+5) ─────────────────────────────

export const DEFENSE_AMMO_STATUS = [
  { system: 'Iron Dome',     operator: 'IDF',   pct: 40, status: 'CRITICAL', color: '#ff2d2d',  detail: '~1,600 Tamir remaining (40%)' },
  { system: "David's Sling", operator: 'IDF',   pct: 30, status: 'LOW',      color: '#ff6b35',  detail: '~360 Stunner remaining (30%)' },
  { system: 'Arrow-2',       operator: 'IDF',   pct: 40, status: 'LOW',      color: '#ffc107',  detail: '~320 interceptors (40%)' },
  { system: 'Arrow-3',       operator: 'IDF',   pct: 30, status: 'LOW',      color: '#ffc107',  detail: '~120 interceptors (30%)' },
  { system: 'THAAD',         operator: 'USA',   pct: 95, status: 'FULL',     color: '#00e676',  detail: 'Full — US resupply active' },
  { system: 'Patriot PAC-3', operator: 'USA/Gulf', pct: 72, status: 'OK',   color: '#2196f3',  detail: '~288 PAC-3 MSE remaining' },
]

// ── Casualty Data (D+5) ──────────────────────────────────────────────────────

export interface CasualtyEntry {
  nation: string
  flag: string
  role: string
  militaryKIA: number
  civilianKIA: number
  militaryWIA: number
  civilianWIA: number
  color: string
}

export const CASUALTY_DATA: CasualtyEntry[] = [
  { nation: 'Iran',       flag: '🇮🇷', role: 'ATTACKER',    militaryKIA: 620,  civilianKIA: 1200, militaryWIA: 2800, civilianWIA: 1800, color: '#ff2d2d' },
  { nation: 'Israel',     flag: '🇮🇱', role: 'DEFENDER',    militaryKIA: 220,  civilianKIA: 120,  militaryWIA: 890,  civilianWIA: 380,  color: '#2196f3' },
  { nation: 'Lebanon',    flag: '🇱🇧', role: 'HEZBOLLAH',   militaryKIA: 35,   civilianKIA: 145,  militaryWIA: 120,  civilianWIA: 160,  color: '#ab47bc' },
  { nation: 'Yemen',      flag: '🇾🇪', role: 'HOUTHI',      militaryKIA: 12,   civilianKIA: 68,   militaryWIA: 55,   civilianWIA: 85,   color: '#ffc107' },
  { nation: 'USA',        flag: '🇺🇸', role: 'COALITION',   militaryKIA: 6,    civilianKIA: 0,    militaryWIA: 18,   civilianWIA: 0,    color: '#00e676' },
  { nation: 'Iraq',       flag: '🇮🇶', role: 'CONTESTED',   militaryKIA: 4,    civilianKIA: 2,    militaryWIA: 12,   civilianWIA: 8,    color: '#7f8c9b' },
  { nation: 'Saudi Arabia', flag: '🇸🇦', role: 'WATCH',     militaryKIA: 0,    civilianKIA: 3,    militaryWIA: 0,    civilianWIA: 14,   color: '#7f8c9b' },
]

export const DAILY_CASUALTIES = [
  { date: 'D+0', label: '28 Feb', iran: 520,  israel: 85,  lebanon: 0,   usa: 6, yemen: 0,  total: 611  },
  { date: 'D+1', label: '01 Mar', iran: 920,  israel: 140, lebanon: 0,   usa: 6, yemen: 15, total: 1081 },
  { date: 'D+2', label: '02 Mar', iran: 1200, israel: 250, lebanon: 82,  usa: 6, yemen: 45, total: 1583 },
  { date: 'D+3', label: '03 Mar', iran: 1450, israel: 310, lebanon: 140, usa: 6, yemen: 65, total: 1971 },
  { date: 'D+4', label: '04 Mar', iran: 1680, israel: 330, lebanon: 160, usa: 6, yemen: 75, total: 2251 },
  { date: 'D+5', label: '05 Mar', iran: 1820, israel: 340, lebanon: 180, usa: 6, yemen: 80, total: 2426 },
]

export const INTERCEPTION_COSTS = [
  { system: 'Arrow-3', cost: 3500000, operator: 'Israel', target: 'Hypersonic/Long-range ballistic' },
  { system: 'Arrow-2', cost: 2800000, operator: 'Israel', target: 'MRBM/IRBM' },
  { system: "David's Sling", cost: 1000000, operator: 'Israel', target: 'Medium-range ballistic' },
  { system: 'Iron Dome', cost: 50000, operator: 'Israel', target: 'Rockets/drones/cruise' },
  { system: 'Patriot PAC-3', cost: 4000000, operator: 'USA/Gulf', target: 'Ballistic missiles' },
  { system: 'THAAD', cost: 12000000, operator: 'USA', target: 'ICBMs/MRBMs exo-atm' },
  { system: 'SM-2', cost: 650000, operator: 'US Navy', target: 'Cruise/anti-ship' },
]

export const MISSILE_ARCS: MissileArc[] = [
  // Iran → Israel (wave 1)
  { from: [49.35, 33.38], to: [34.78, 31.04], weaponType: 'BALLISTIC', actor: 'Iran', date: '2026-02-28T06:00:00Z', intercepted: false },
  { from: [48.1, 35.2], to: [35.1, 31.8], weaponType: 'HYPERSONIC', actor: 'Iran', date: '2026-02-28T06:30:00Z', intercepted: false },
  { from: [49.0, 32.5], to: [34.9, 32.1], weaponType: 'DRONE', actor: 'Iran', date: '2026-02-28T07:00:00Z', intercepted: true },
  // Iran → Israel (wave 2)
  { from: [47.5, 33.9], to: [34.6, 31.5], weaponType: 'BALLISTIC', actor: 'Iran', date: '2026-03-01T00:30:00Z', intercepted: false },
  { from: [50.1, 32.7], to: [35.2, 32.5], weaponType: 'DRONE', actor: 'Iran', date: '2026-03-01T01:00:00Z', intercepted: true },
  // Iran → Israel (wave 3 - Fattah-1 vs airbases)
  { from: [46.8, 34.1], to: [34.88, 31.21], weaponType: 'HYPERSONIC', actor: 'Iran', date: '2026-03-03T02:00:00Z', intercepted: false },
  { from: [47.2, 33.5], to: [34.66, 31.23], weaponType: 'HYPERSONIC', actor: 'Iran', date: '2026-03-03T02:10:00Z', intercepted: false },
  // Hezbollah → Israel
  { from: [35.6, 33.2], to: [35.5, 33.1], weaponType: 'BALLISTIC', actor: 'Hezbollah', date: '2026-03-02T02:00:00Z', intercepted: false },
  { from: [35.4, 33.3], to: [35.2, 32.7], weaponType: 'BALLISTIC', actor: 'Hezbollah', date: '2026-03-02T03:00:00Z', intercepted: true },
  // IDF → Iran
  { from: [34.88, 31.21], to: [51.73, 33.72], weaponType: 'CRUISE', actor: 'IDF', date: '2026-02-28T04:30:00Z', intercepted: false },
  { from: [34.88, 31.21], to: [51.58, 34.88], weaponType: 'BALLISTIC', actor: 'IDF', date: '2026-02-28T05:00:00Z', intercepted: false },
  // US Tomahawks
  { from: [56.0, 26.5], to: [51.73, 33.72], weaponType: 'CRUISE', actor: 'USA', date: '2026-02-28T04:00:00Z', intercepted: false },
  { from: [56.0, 26.5], to: [49.24, 34.38], weaponType: 'CRUISE', actor: 'USA', date: '2026-02-28T04:15:00Z', intercepted: false },
  // Houthis
  { from: [42.9, 14.8], to: [56.0, 26.0], weaponType: 'CRUISE', actor: 'Houthi', date: '2026-03-02T20:00:00Z', intercepted: true },
]
