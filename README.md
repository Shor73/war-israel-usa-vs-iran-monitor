# Israel / USA vs Iran — War Monitor 2026

![ISR](https://flagcdn.com/w40/il.png) ![USA](https://flagcdn.com/w40/us.png) **vs** ![IRN](https://flagcdn.com/w40/ir.png)

> **Real-time OSINT war room dashboard** tracking **Operation Ultimatum** — the Israel/USA vs Iran conflict that began on **28 February 2026**. Built as a permanent historical archive: when the war ends, this site stays online with final statistics, achieved objectives, and a complete conflict record.

**Live at:** [usaisrviran2026.com](https://usaisrviran2026.com) *(coming soon)*
**GitHub:** [Shor73/war-israel-usa-vs-iran-monitor](https://github.com/Shor73/war-israel-usa-vs-iran-monitor)

---

## What is this?

A "Pentagon Situation Room" style dashboard aggregating public OSINT data into a single real-time interface. Every panel is designed around actual military briefing formats — DTG timestamps, classification banners, threat color codes, NATO terminology.

This is **not** a general-purpose conflict tracker. It covers one specific conflict: the Iran-Israel-USA war that started 28 Feb 2026, with granular data from Day 0 through the end of hostilities.

---

## Exclusive Features

### 🚨 Tzeva Adom — Live Israeli Rocket Alerts
The most unique feature of this dashboard. A **live feed of Israeli Home Front Command (OREF) rocket/missile alerts** displayed in real time.

- Connects to the official OREF alert API (`oref.org.il`) via a relay server running in Israel
- Displays **active alerts** with city names, threat type, and countdown timers
- **Alert history** with timestamp, location, and threat classification
- **Statistics**: total alerts by city, region heatmap, alert frequency per day
- **localStorage caching** — data loads instantly on page open, refreshes in background
- Relay architecture: Node.js relay on Israeli IP → SSH reverse tunnel → server → dashboard

> The relay script is included at `scripts/oref-relay.mjs`. To use it you need a machine with an Israeli IP address (VPN, Israeli server, or home PC in Israel).

---

### 🗺️ Theater Map — Interactive CENTCOM Operations Map
Built with **MapLibre GL** on a CartoDB dark basemap, centered on the Middle East theater (Egypt → Pakistan).

**Clickable assets:**
- **US Naval Forces** — full order of battle with rich popups:
  - CVN-69 USS Eisenhower CSG (Persian Gulf) — 7-ship group composition, F/A-18 strike ops
  - CVN-72 USS Abraham Lincoln CSG (Arabian Sea) — full escort list
  - LHD-7 USS Iwo Jima ARG (Red Sea) — 26th MEU, 2,200 Marines embarked
  - SSGN-726 USS Ohio (classified position) — 154x Tomahawk, Navy SEALs
  - DDG-107 USS Gravely (Red Sea) — Houthi intercept D+3
  - P-8A Poseidon detachment (Al Udeid) — ASW/ISR patrols
- **US Air Bases** — Al Udeid, Al Dhafra, NSA Bahrain, Diego Garcia, Camp Lemonnier, Ain al-Asad
- **IDF Bases** — Nevatim (F-35I), Hatzerim (F-16I), Ramat David (F-15I), Palmachim (Arrow/Jericho)
- **Iranian Nuclear Sites** — Natanz (DAMAGED), Fordow (DAMAGED), Isfahan, Bushehr
- **Chokepoints** — Strait of Hormuz (RESTRICTED), Bab-el-Mandeb (HOSTILE), Suez

**Country highlighting** with conflict role:
- Red fill — Active attackers (Iran, Lebanon/Hezbollah, Yemen/Houthi)
- Green fill — Defenders/Coalition (Israel, Iraq, Saudi Arabia, UAE, Bahrain, Qatar, Jordan, Kuwait, Cyprus)
- Yellow fill — Transit/struck (Syria)

GeoJSON borders: 258 countries, full ISO3166-1-Alpha-2 precision — source: [koala73/worldmonitor](https://github.com/koala73/worldmonitor)

---

### 📊 War Summary Panel
Macro overview inspired by CIA war room briefing format:
- **Total projectiles fired** across all actors (1,800+)
- **Enemy intercept rate** with live computation from strike data
- **Coalition strike success rate**
- **Arsenal depletion bars** — Iran MRBM/IRBM, Iran Drones, Hezbollah rockets, Houthi missiles, Fattah-1 hypersonics — % remaining at D+5
- **Defense ammo status** — Iron Dome (CRITICAL ~40%), David's Sling (LOW ~30%), Arrow-2, Arrow-3, THAAD (FULL), Patriot PAC-3
- **Casualties by nation** with proportional bars — Iran 1,800+, Israel 340+, Lebanon 180+, Yemen 80+, USA 6

---

### ☠️ Casualty Tracker
3-tab panel with granular casualty data:
- **TOTAL** — stacked horizontal bars per nation (military vs. civilian breakdown)
- **BY DAY** — Recharts AreaChart, cumulative D+0 → D+5 progression per nation, toggle KIA/WIA/TOTAL
- **HUMANITARIAN** — displacement (Israel 250K north, Lebanon 400K+), UN OCHA EMERGENCY status, hospitals under pressure

---

### 🎯 Missile & Strike Statistics
Complete order of battle for all projectile systems from 28 Feb 2026:

| Actor | Systems | Total Launched | Intercepted | Hit |
|-------|---------|---------------|-------------|-----|
| Iran | Fattah-1, Shahab-3, Emad, Ghadr, Sejjil, Kheibar Shekan, Shahed-136 (380x), Shahed-238 (85x), Mohajer-6 (45x) | 630 | 515 | 115 |
| Hezbollah | Fajr-5, Fateh-110, Zelzal-2, Katyusha (480x) | 545 | 437 | 108 |
| Houthi | Toofan, Shahed-136, Quds, Badr-1, Asef UAV | 62 | 49 | 13 |
| IDF | F-35I Adir, F-15I Ra'am, LORA SRBM, Delilah cruise, Harop loitering | 255+ sorties | — | 188+ targets |
| USA | Tomahawk TLAM (150+), JASSM-ER (80+), GBU-57 MOP (B-2), F-35A/C carrier | 298+ | — | 289 |

5 Recharts graphs: daily launches, hit/intercept donut, weapon type breakdown, daily trend, cost-per-intercept.

---

### 💰 Economic Impact
- **Live oil prices** — Brent, WTI, Natural Gas, Kerosene via Yahoo Finance proxy (5min cache)
- **Defense stocks** — RTX, LMT, NOC, GD, BA, ESLT with sparklines
- **Chokepoint monitor** — Hormuz (RESTRICTED, -14% traffic), Bab-el-Mandeb (HOSTILE, -30%), Suez
- **Sanctions timeline** — 2018 JCPOA → 2022 SWIFT → 2026 emergency package
- **War Risk Premium** — shipping insurance surge (+3.5-5% hull value)

---

### ✈️ Airspace / NOTAM
- Active NOTAMs: OIIX Tehran FIR (CLOSED), ORBB Baghdad (RESTRICTED), OLBB Beirut (RESTRICTED), OYSC Yemen (CLOSED)
- Airline impact table — El Al, Emirates, Qatar, Turkish, Lufthansa, Air France
- Military flight types tracked — B-52H, RC-135W Rivet Joint, KC-135, E-8 JSTARS, P-8 Poseidon

---

### 📰 News Multiwall
6-column live news feed aggregating 35+ RSS sources:
- Wire: Reuters, AP, France 24, BBC, Sky News, DW, Guardian
- Israeli: Times of Israel, Haaretz, i24 News, Jerusalem Post, Ynet
- Arab/Regional: Al Jazeera, Al Arabiya, Middle East Eye, Arab News
- Defense: Defense News, Breaking Defense, War on the Rocks, The Drive/War Zone
- OSINT/Think Tank: Bellingcat, Foreign Policy, CSIS, 38North, Arms Control
- Financial: Bloomberg, CNBC, OilPrice

Iranian state media sources are flagged with `[IRANIAN STATE MEDIA]` badge. OSINT Telegram sources flagged as `[UNVERIFIED OSINT]`.

---

### 🕐 Conflict Timeline
Horizontal scrollable timeline from 28 Feb 2026 with 20+ events, click for full detail:
- D+0: Operation Ultimatum strikes (B-2 GBU-57 on Fordow, Tomahawks, F-35I on Natanz)
- D+0: Iran first ballistic wave (80+ missiles, 80% intercept rate)
- D+2: Hezbollah enters — first rocket barrage
- D+3: Iran Fattah-1 hypersonics target IDF airbases
- D+3: Natanz 60-70% above-ground destruction confirmed (Planet Labs/Maxar)
- D+4: UN OCHA 2,400+ civilian casualties
- ...and more

---

### 🌊 Gulf States Monitor
11-country cards with real-time status:
- Threat level, political stance, US bases present, key strategic factor
- Countries: UAE, Saudi Arabia, Qatar, Bahrain, Kuwait, Oman, Iraq, Yemen, Lebanon, Syria, Jordan
- Flag images via [flagcdn.com](https://flagcdn.com) (cross-platform, works on Windows)

---

### 📡 Agency Intel Feed
Classified-brief-style intelligence formatted like real CIA/Mossad/AMAN documents:
- Classification banners: `TOP SECRET // SI // NOFORN`
- DTG timestamps in NATO format
- Originator, source reliability, confidence level
- Tab filter: ALL | CIA | MOSSAD | AMAN | OSINT | IRGC MONITOR

---

### 🔴 Live Operations Tracker
Real-time ops log in DTG military format:
```
[041650Z MAR26] STRIKE     | Fordow, Iran         | IDF F-35I 4-ship | ACTIVE
[041648Z MAR26] INTERCEPT  | Tel Aviv sector      | Arrow-3 vs Fattah-1 | SUCCESS
```
Filters: ALL | STRIKE | INTERCEPT | LAUNCH | RECON | NAVAL | CYBER

---

### 📺 Live Broadcasts
Embedded YouTube live streams — Al Jazeera, Sky News, France 24, i24 NEWS, DW, WION. Each with live/offline status badge.

---

### ☢️ Nuclear Watch
Modal overlay tracking Iran nuclear program status post-strikes:
- Natanz FEP: ~60-70% above-ground destruction
- Fordow FFEP: underground damage TBD
- Isfahan UCF: struck
- Bushehr NPP: intact (not targeted)
- Breakout time assessment, IAEA status

---

### ⚡ AI SITREP Brief
6-hour AI-generated situation report via **Groq API** (llama-3.3-70b):
- Situation summary, threat assessment, key developments, economic warfare, 24-48h forecast
- Typing animation (terminal effect)
- Fallback: OpenRouter

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS variables |
| Map | MapLibre GL JS |
| Charts | Recharts + custom SVG |
| State | Zustand |
| Real-time | Server-Sent Events (SSE) |
| RSS | rss-parser (server-side, no CORS) |
| Video | react-player |
| Date | date-fns |
| AI | Groq API (llama-3.3-70b) |
| Flags | flagcdn.com (cross-platform PNG) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn

### Install & Run

```bash
git clone https://github.com/Shor73/war-israel-usa-vs-iran-monitor.git
cd war-israel-usa-vs-iran-monitor
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables (optional)

Create `.env.local`:

```env
# Groq API — for AI SITREP brief
GROQ_API_KEY=your_groq_api_key

# Tzeva Adom relay — URL of your Israeli IP relay
OREF_RELAY_URL=http://localhost:3003

# Finnhub — for live defense stocks
FINNHUB_API_KEY=your_finnhub_key
```

The dashboard works without any API keys — all panels fall back to realistic hardcoded D+5 data.

### Tzeva Adom Relay Setup

To receive live Israeli rocket alerts you need a machine with an Israeli IP:

**On the Israeli machine:**
```bash
# Terminal 1 — start the relay
node scripts/oref-relay.mjs

# Terminal 2 — open SSH tunnel to your server
ssh -R 3003:localhost:3003 user@your-server-ip -N
```

**On your server:**
```bash
echo "OREF_RELAY_URL=http://localhost:3003" >> .env.local
pm2 restart warops-dashboard --update-env
```

---

## Project Structure

```
src/
├── components/
│   ├── layout/        # CommandHeader, IntelTicker, StatusBar
│   ├── map/           # TheaterMap (MapLibre + naval assets)
│   ├── panels/        # All 14 content panels
│   └── ui/            # Flag, ClassifiedBadge
├── lib/
│   ├── missile-data.ts   # Complete strike database + arsenal/casualty data
│   ├── constants.ts      # Military bases, chokepoints, gulf states
│   ├── feeds.ts          # 35+ RSS feed URLs
│   └── types.ts          # TypeScript interfaces
├── store/
│   └── dashboard.ts      # Zustand global state
app/
└── api/               # Next.js API routes (news, oil, markets, airspace, brief...)
public/
└── data/
    ├── countries.geojson        # 258-country borders (koala73/worldmonitor)
    ├── conflict-events.json     # Timeline 28 Feb 2026
    ├── conflict-countries.json  # Country roles in conflict
    ├── military-bases.json      # US/IDF base coordinates
    └── nuclear-sites.json       # Iranian nuclear facilities
```

---

## Contributing

Pull requests and suggestions welcome. Areas where contributions would be most valuable:

- **More missile systems** — additional Iranian/Hezbollah/Houthi weapons with accurate specs
- **Historical accuracy** — corrections to strike counts, casualty figures, timeline events
- **New data sources** — additional RSS feeds, especially non-English sources
- **Map layers** — additional military assets, IRGC positions, pipeline routes
- **Mobile layout** — current design is optimized for 1920x1080 desktop
- **Translations** — UI localization (Hebrew, Arabic, Persian, French)

Please open an issue before starting significant work so we can coordinate.

---

## Data Sources & Accuracy

All data is sourced from **open public sources**:
- IDF Spokesperson official statements
- CENTCOM press releases
- Reuters, AP, BBC, Times of Israel reporting
- OSINT analysis (Bellingcat, 38North, Arms Control Association)
- Planet Labs / Maxar satellite imagery reporting
- UN OCHA humanitarian reports

Strike counts and casualty figures are **estimates** based on reported data as of D+5 (05 Mar 2026). Figures marked with `~` or `EST.` are assessments, not confirmed numbers. Iranian state media sources are flagged and treated with additional scrutiny.

This dashboard is an **informational OSINT aggregator**. It has no operational military capability and contains no classified information.

---

## Credits

**Developed by** Angelo Di Veroli
**Original concept by** David Di Tivoli
**GeoJSON country borders** [koala73/worldmonitor](https://github.com/koala73/worldmonitor)
**Flag images** [flagcdn.com](https://flagcdn.com)

---

## License

MIT — free to use, fork, and build upon. If you build something from this, a mention would be appreciated.

---

*This project will remain online after the conflict ends as a permanent historical archive with final statistics, confirmed objectives, and a complete record of Operation Ultimatum.*
