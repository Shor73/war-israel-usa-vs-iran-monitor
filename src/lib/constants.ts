import type { Chokepoint, GulfState, NotamEntry, AirlineStatus } from './types'

export const CHOKEPOINTS: Chokepoint[] = [
  {
    id: 'hormuz', name: 'Strait of Hormuz', lat: 26.56, lng: 56.25,
    status: 'RESTRICTED', dailyTrafficMMBD: 18.0, threatLevel: 'CRITICAL',
    detail: 'IRGC fast attack craft deployed. Mine-laying vessels detected. US MCM assets en route. ~14% reduction from pre-war 21 MMBD.'
  },
  {
    id: 'bab', name: 'Bab-el-Mandeb', lat: 12.58, lng: 43.33,
    status: 'HOSTILE', dailyTrafficMMBD: 3.5, threatLevel: 'HIGH',
    detail: 'Houthi anti-ship cruise missile threat ongoing. US Navy escort operations active. 30% reduction from baseline.'
  },
  {
    id: 'suez', name: 'Suez Canal', lat: 30.42, lng: 32.33,
    status: 'OPEN', dailyTrafficMMBD: 5.5, threatLevel: 'WATCH',
    detail: 'Operational but diversions increasing. Some insurers refusing coverage. Egypt on heightened alert.'
  },
  {
    id: 'turkish', name: 'Turkish Straits', lat: 41.12, lng: 29.07,
    status: 'OPEN', dailyTrafficMMBD: 3.0, threatLevel: 'WATCH',
    detail: 'Operational. Turkey monitoring situation. Montreux Convention naval passage restrictions under review.'
  }
]

export const GULF_STATES: GulfState[] = [
  {
    code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪',
    threat: 'HIGH', stance: 'ALLY',
    usBases: ['Al Dhafra AB (F-35A, KC-135, THAAD)', 'NSA Jebel Ali'],
    keyFactor: 'Critical F-35 hub. Direct Hormuz exposure. Abraham Accords with Israel — first test.',
    latestDevelopment: 'Activated national emergency committee. THAAD fully operational.'
  },
  {
    code: 'SAU', name: 'Saudi Arabia', flag: '🇸🇦',
    threat: 'WATCH', stance: 'CAUTIOUS',
    usBases: ['Eskan Village (AFCENT)', 'Prince Sultan AB'],
    keyFactor: 'OPEC leadership. Houthi threat from Yemen. Normalization with Israel suspended.',
    latestDevelopment: 'Increased OPEC+ production to offset Hormuz shortfall. Back-channel with Iran ongoing.'
  },
  {
    code: 'QAT', name: 'Qatar', flag: '🇶🇦',
    threat: 'WATCH', stance: 'MEDIATOR',
    usBases: ['Al Udeid AB (CENTCOM Forward HQ, B-52H, 10,000+ personnel)'],
    keyFactor: 'Hosts CENTCOM while simultaneously mediating with Iran/Hamas. Unique dual role.',
    latestDevelopment: 'Qatar Foreign Ministry in contact with Iranian counterpart. Al Jazeera operations continue.'
  },
  {
    code: 'BHR', name: 'Bahrain', flag: '🇧🇭',
    threat: 'HIGH', stance: 'ALLY',
    usBases: ['NSA Bahrain (5th Fleet HQ)', 'USS Bataan LHD berthed'],
    keyFactor: 'Shia majority (70%). Iranian-backed opposition. Key naval hub — hardest to defend.',
    latestDevelopment: 'Full military lockdown. Shia protests suppressed. Iran state media calling for uprising.'
  },
  {
    code: 'KWT', name: 'Kuwait', flag: '🇰🇼',
    threat: 'WATCH', stance: 'ALLY',
    usBases: ['Camp Arifjan (ARCENT)', 'Ali Al Salem AB'],
    keyFactor: 'Iraq border exposure. Significant US Army staging area. PMF activity in S. Iraq concerning.',
    latestDevelopment: 'Border with Iraq reinforced. Consulting with ARCENT on force protection.'
  },
  {
    code: 'OMN', name: 'Oman', flag: '🇴🇲',
    threat: 'WATCH', stance: 'NEUTRAL',
    usBases: ['Limited: Muscat Air Base access'],
    keyFactor: 'Traditional Iran backchannel. Positioned Strait of Hormuz. Strategic mediator role.',
    latestDevelopment: 'Oman FM met Iranian counterpart in Muscat. Back-channel to US relayed.'
  },
  {
    code: 'IRQ', name: 'Iraq', flag: '🇮🇶',
    threat: 'ELEVATED', stance: 'CONTESTED',
    usBases: ['Ain al-Asad AB', 'Baghdad Embassy Complex', 'Erbil AB'],
    keyFactor: 'Pro-Iran PMF militia could activate against US bases. Government torn between US alliance and Iran.',
    latestDevelopment: 'PMF (Kataib Hezbollah) placed on alert. 2 rocket attacks on Ain al-Asad intercepted.'
  },
  {
    code: 'YEM', name: 'Yemen (Houthi-controlled)', flag: '🇾🇪',
    threat: 'CRITICAL', stance: 'HOSTILE',
    usBases: ['None (Camp Lemonnier nearby in Djibouti)'],
    keyFactor: 'Active Houthi launch sites attacking Red Sea shipping and Israel. Backed by IRGC supply chain.',
    latestDevelopment: 'US/UK strikes on Hudaydah Houthi launch infrastructure. 25 missiles launched since 28 Feb.'
  },
  {
    code: 'LBN', name: 'Lebanon (Hezbollah)', flag: '🇱🇧',
    threat: 'ELEVATED', stance: 'HOSTILE',
    usBases: ['None (US Embassy Beirut on lockdown)'],
    keyFactor: 'Hezbollah opened second front Mar 2. 185+ projectiles in 3 days. IDF ground operation imminent.',
    latestDevelopment: 'South Lebanon IDF buffer zone expanded. Civilians evacuating Tyre and Sidon.'
  },
  {
    code: 'SYR', name: 'Syria', flag: '🇸🇾',
    threat: 'ELEVATED', stance: 'CONTESTED',
    usBases: ['Al Tanf Garrison (SOF/MRF-D)'],
    keyFactor: 'IRGC uses Syrian territory for overland resupply to Hezbollah. IDF strike corridor.',
    latestDevelopment: 'IDF struck IRGC weapons depot near Damascus. Al Tanf garrison on REDCON-2.'
  },
  {
    code: 'JOR', name: 'Jordan', flag: '🇯🇴',
    threat: 'WATCH', stance: 'ALLY',
    usBases: ['Muwaffaq Salti AB (limited USAF)'],
    keyFactor: 'Allowed IDF overflight during strikes. Large Palestinian refugee population (70%). Domestic pressure.',
    latestDevelopment: 'Jordanian PAF shot down 2 Iranian drones in Apr 2024. Similar role expected. Internal protests growing.'
  },
]

export const NOTAM_ENTRIES: NotamEntry[] = [
  { fir: 'Tehran FIR', firCode: 'OIIX', status: 'CLOSED', country: 'Iran', detail: 'Complete closure. Active combat operations.' },
  { fir: 'Baghdad FIR', firCode: 'ORBB', status: 'RESTRICTED', country: 'Iraq', detail: 'Military operations. Civilian restricted to FL200+.' },
  { fir: 'Beirut FIR', firCode: 'OLBB', status: 'RESTRICTED', country: 'Lebanon', detail: 'Active conflict. Civil aviation suspended.' },
  { fir: 'Sanaa FIR', firCode: 'OYSC', status: 'CLOSED', country: 'Yemen', detail: 'Houthi control. Hostile fire risk. Closed.' },
  { fir: 'Damascus FIR', firCode: 'OSTT', status: 'RESTRICTED', country: 'Syria', detail: 'IDF strike operations. Extreme caution.' },
  { fir: 'Tel Aviv FIR', firCode: 'LLLL', status: 'RESTRICTED', country: 'Israel', detail: 'Combat operations. ELAL flights only w/ IDF escort.' },
]

export const AIRLINE_STATUS: AirlineStatus[] = [
  { name: 'El Al', iata: 'LY', status: 'ENHANCED', routes: 'Operating with IDF fighter escort and anti-missile systems. Limited international routes.' },
  { name: 'Emirates', iata: 'EK', status: 'REROUTING', routes: 'No Iran/Iraq overflight. EU-Asia via Central Asia. +3h per flight.', extraHours: 3, extraCost: 15000 },
  { name: 'Qatar Airways', iata: 'QR', status: 'REROUTING', routes: 'Hub (Doha) operational. No Iranian airspace. Longer routes.', extraHours: 2.5, extraCost: 12000 },
  { name: 'Turkish Airlines', iata: 'TK', status: 'SUSPENDED', routes: 'Tehran routes suspended. Rerouting Istanbul-India via Georgia/Central Asia.', extraHours: 2, extraCost: 10000 },
  { name: 'Lufthansa', iata: 'LH', status: 'SUSPENDED', routes: 'Frankfurt-Asia via northern route (Russia if open) or via Arabian Sea.', extraHours: 3.5, extraCost: 18000 },
  { name: 'Air France', iata: 'AF', status: 'SUSPENDED', routes: 'Paris-Asia rerouting. Iran/Iraq airspace closed.', extraHours: 3, extraCost: 15000 },
  { name: 'ITA Airways', iata: 'AZ', status: 'SUSPENDED', routes: 'Middle East routes suspended. Tel Aviv suspended.', extraHours: 0 },
]

export const DEFENSE_STOCKS = [
  { symbol: 'RTX', name: 'RTX Corp (Raytheon/Patriot)', sector: 'defense' as const },
  { symbol: 'LMT', name: 'Lockheed Martin (F-35/HIMARS)', sector: 'defense' as const },
  { symbol: 'NOC', name: 'Northrop Grumman (B-2/GBSD)', sector: 'defense' as const },
  { symbol: 'GD', name: 'General Dynamics', sector: 'defense' as const },
  { symbol: 'BA', name: 'Boeing (F-15/JDAM)', sector: 'defense' as const },
  { symbol: 'LHX', name: 'L3Harris (ISR/Comms)', sector: 'defense' as const },
  { symbol: 'ESLT', name: 'Elbit Systems (Israel)', sector: 'defense' as const },
  { symbol: 'XOM', name: 'ExxonMobil', sector: 'energy' as const },
  { symbol: 'CVX', name: 'Chevron', sector: 'energy' as const },
  { symbol: 'COP', name: 'ConocoPhillips', sector: 'energy' as const },
]

export const STRATEGIC_ASSETS_US = [
  { name: 'CVN-69 USS Eisenhower CSG', type: 'Carrier Strike Group', location: 'Persian Gulf', status: 'ACTIVE OPS', assets: 'F/A-18E/F, E-2D, EA-18G, 7 escorts' },
  { name: 'CVN-72 USS Abraham Lincoln CSG', type: 'Carrier Strike Group', location: 'Arabian Sea', status: 'ACTIVE OPS', assets: 'F/A-18E/F, 6 escorts' },
  { name: 'LHD-7 USS Iwo Jima ARG', type: 'Amphibious Ready Group', location: 'Red Sea', status: 'STANDBY', assets: 'USMC 22nd MEU, AV-8B, MV-22' },
  { name: 'SSGN-726 USS Ohio', type: 'Guided Missile Sub', location: 'Classified (est. Persian Gulf)', status: 'DEPLOYED', assets: '154x Tomahawk TLAM' },
  { name: 'B-2A Spirit (509th BW)', type: 'Stealth Bomber', location: 'Diego Garcia / Whiteman rotations', status: 'ACTIVE ROTATIONS', assets: 'GBU-57 MOP, JDAM, B61-12' },
  { name: 'B-52H (5th BW)', type: 'Strategic Bomber', location: 'Al Udeid AB, Qatar', status: 'ACTIVE', assets: 'JASSM-ER, JSOW, conventional' },
  { name: 'F-35A (388th FW)', type: 'Stealth Fighter', location: 'Al Dhafra AB, UAE', status: 'ACTIVE', assets: 'JSOW, SDB, JDAM' },
  { name: 'RC-135W Rivet Joint', type: 'SIGINT Aircraft', location: 'Al Udeid / Cyprus rotations', status: 'AIRBORNE', assets: 'Full SIGINT collection suite' },
  { name: 'USS Devastator + USS Chief', type: 'MCM Squadron', location: 'Strait of Hormuz', status: 'DEPLOYED', assets: 'Mine countermeasures operations' },
]

export const STRATEGIC_ASSETS_IDF = [
  { name: 'F-35I Adir (140 + 116 Sqn)', type: 'Stealth Multi-Role', status: 'ACTIVE OPS — Iran strikes', note: 'JSOW, SDB-II, Spice 2000' },
  { name: 'F-15I Ra\'am (69 Sqn)', type: 'Strike Fighter', status: 'ACTIVE OPS — Iran strikes', note: 'Popeye Turbo, Rampage, JDAM' },
  { name: 'Arrow-3 System', type: 'Exo-atmospheric BMD', status: 'OPERATIONAL — engaging', note: 'Highest tier defense vs Fattah-1' },
  { name: 'Arrow-2 System', type: 'Endo-atmospheric BMD', status: 'OPERATIONAL — engaging', note: 'vs MRBM/IRBM' },
  { name: 'Iron Dome (10 batteries)', type: 'Short-range Air Defense', status: 'FULLY DEPLOYED', note: 'Covering all population centers' },
  { name: "David's Sling", type: 'Medium-range Air Defense', status: 'OPERATIONAL', note: 'vs Fateh-110, Zelzal' },
  { name: 'INS Dolphin class (3 subs)', type: 'Submarine', status: '1+ DEPLOYED eastern Med', note: 'Nuclear-capable Popeye Turbo (unconfirmed)' },
]

export const STRATEGIC_ASSETS_IRAN = [
  { name: 'IRGC Aerospace Force', type: 'Missile Brigades', status: 'ACTIVELY LAUNCHING — 3rd wave prep', note: '~65% stockpile remaining est.' },
  { name: 'Shahed-136 stockpile', type: 'Kamikaze UAV', status: 'DEPLETING', note: '~40% remaining est. (~800 of ~2000)' },
  { name: 'Fattah-1 hypersonic', type: 'Hypersonic MRBM', status: 'LIMITED STOCK', note: '~20 remaining est.' },
  { name: 'IRIAF F-14 Tomcat', type: 'Air Superiority', status: 'GROUNDED (parts unavailable)', note: 'Minimal operational capability' },
  { name: 'Kilo-class submarines (3)', type: 'Submarine', status: 'PATROL — Persian Gulf', note: 'Threat to shipping, anti-access' },
  { name: 'IRGC Fast Attack Craft', type: 'Naval (100+ craft)', status: 'STRAIT OF HORMUZ — swarm ready', note: 'Anti-access/area denial threat' },
  { name: 'Hezbollah (proxy)', type: 'Non-state actor', status: 'ACTIVE — South Lebanon front', note: '185+ projectiles in 3 days' },
  { name: 'Houthis (proxy)', type: 'Non-state actor', status: 'ACTIVE — Red Sea/Yemen', note: 'Anti-ship, Israel long-range strikes' },
  { name: 'PMF Iraq (proxy)', type: 'Non-state actor', status: 'WATCH — potential activation', note: 'Kataib Hezbollah on alert' },
]
