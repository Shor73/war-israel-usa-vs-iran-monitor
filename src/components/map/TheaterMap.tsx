'use client'
import { useEffect, useRef, useState } from 'react'
import { useDashboardStore } from '@/store/dashboard'
import { threatColor } from '@/lib/utils'
import { flagImg } from '@/components/ui/Flag'

// Dynamic import for maplibre (client-only)
export default function TheaterMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const { mapLayers } = useDashboardStore()

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let map: unknown
    let MapLibreGL: typeof import('maplibre-gl')

    const initMap = async () => {
      try {
        MapLibreGL = await import('maplibre-gl')

        map = new MapLibreGL.Map({
          container: mapRef.current!,
          style: {
            version: 8,
            sources: {
              osm: {
                type: 'raster',
                tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© CartoDB © OpenStreetMap',
                maxzoom: 19,
              },
            },
            layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
          },
          center: [48, 30],
          zoom: 4.5,
          minZoom: 3,
          maxZoom: 12,
        })

        const mapObj = map as { on: (event: string, cb: () => void) => void; addSource: (id: string, opts: unknown) => void; addLayer: (opts: unknown) => void; getSource: (id: string) => unknown; remove: () => void }

        mapObj.on('load', () => {
          setMapLoaded(true)
          addCountryHighlights(mapObj)
          addDataLayers(mapObj)
        })

        mapInstanceRef.current = map
      } catch (err) {
        console.error('Map init failed:', err)
      }
    }

    // ISO codes → conflict role mapping (NO Gaza - zero rockets since 28 Feb 2026)
    const COUNTRY_ROLES: Record<string, { role: string; label: string }> = {
      // ACTIVE ATTACKERS
      'IR': { role: 'attacker', label: `${flagImg('ir')} IRAN — ACTIVE AGGRESSOR` },
      'LB': { role: 'attacker', label: `${flagImg('lb')} LEBANON / HEZBOLLAH — ACTIVE SINCE D+2` },
      'YE': { role: 'attacker', label: `${flagImg('ye')} YEMEN / HOUTHI — ACTIVE SINCE D+3` },
      // DEFENDERS / ATTACKED
      'IL': { role: 'defender', label: `${flagImg('il')} ISRAEL — PRIMARY TARGET` },
      'IQ': { role: 'defender', label: `${flagImg('iq')} IRAQ — US BASES ATTACKED (PMF/IRGC)` },
      'SA': { role: 'defender', label: `${flagImg('sa')} SAUDI ARABIA — HOUTHI ATTACKS` },
      'AE': { role: 'defender', label: `${flagImg('ae')} UAE — HOUTHI THREATS + US BASES` },
      'BH': { role: 'defender', label: `${flagImg('bh')} BAHRAIN — NSA 5TH FLEET THREATENED` },
      'QA': { role: 'defender', label: `${flagImg('qa')} QATAR — AL UDEID AB (CENTCOM) THREATENED` },
      'JO': { role: 'defender', label: `${flagImg('jo')} JORDAN — INTERCEPTED IRANIAN DRONES` },
      'KW': { role: 'defender', label: `${flagImg('kw')} KUWAIT — US ARMY STAGING AREA THREATENED` },
      // STAGING / THREATENED
      'CY': { role: 'defender', label: `${flagImg('cy')} CYPRUS — RAF AKROTIRI (UK SBA) · ISR OPS · IRAN THREATS` },
      // TRANSIT / STRUCK
      'SY': { role: 'transit', label: `${flagImg('sy')} SYRIA — IRGC CORRIDOR / IDF STRIKES` },
    }

    const addCountryHighlights = async (mapObj: { addSource: (id: string, opts: unknown) => void; addLayer: (opts: unknown, before?: string) => void }) => {
      try {
        // Load full precision GeoJSON from worldmonitor (258 countries, ISO3166-1-Alpha-2)
        const res = await fetch('/data/countries.geojson')
        const fullGeojson: { type: string; features: Array<{ type: string; properties: Record<string, string>; geometry: unknown }> } = await res.json()

        // Filter only conflict countries and inject role property
        const conflictFeatures = fullGeojson.features
          .map(feat => {
            const iso = feat.properties['ISO3166-1-Alpha-2']
            const roleData = COUNTRY_ROLES[iso]
            if (!roleData) return null
            return {
              ...feat,
              properties: { ...feat.properties, role: roleData.role, conflictLabel: roleData.label }
            }
          })
          .filter(Boolean)

        const conflictGeojson = { type: 'FeatureCollection', features: conflictFeatures }

        mapObj.addSource('conflict-countries', { type: 'geojson', data: conflictGeojson })

        // Semi-transparent fill
        mapObj.addLayer({
          id: 'country-fill',
          type: 'fill',
          source: 'conflict-countries',
          paint: {
            'fill-color': [
              'match', ['get', 'role'],
              'attacker', '#ff2d2d',
              'defender', '#00e676',
              'transit',  '#ffc107',
              '#7f8c9b'
            ],
            'fill-opacity': 0.20,
          },
        })

        // Border line — bright, crisp
        mapObj.addLayer({
          id: 'country-border',
          type: 'line',
          source: 'conflict-countries',
          paint: {
            'line-color': [
              'match', ['get', 'role'],
              'attacker', '#ff2d2d',
              'defender', '#00e676',
              'transit',  '#ffc107',
              '#7f8c9b'
            ],
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              3, ['match', ['get', 'role'], 'attacker', 1.5, 'defender', 1.2, 0.8],
              7, ['match', ['get', 'role'], 'attacker', 3.0, 'defender', 2.5, 1.5]
            ],
            'line-opacity': 0.95,
          },
        })

      } catch (err) {
        console.warn('Country highlights failed:', err)
      }
    }

    const addDataLayers = (mapObj: { addSource: (id: string, opts: unknown) => void; addLayer: (opts: unknown) => void }) => {
      // USA military bases
      const usaBases = [
        { id: 'udeid', name: 'Al Udeid AB (CENTCOM HQ)', lng: 51.315, lat: 25.117, color: '#2196f3' },
        { id: 'dhafra', name: 'Al Dhafra AB (F-35A/THAAD)', lng: 54.548, lat: 24.248, color: '#2196f3' },
        { id: 'bahrain', name: 'NSA Bahrain (5th Fleet)', lng: 50.592, lat: 26.237, color: '#2196f3' },
        { id: 'diego', name: 'Diego Garcia (B-2/SSGN)', lng: 72.411, lat: -7.316, color: '#2196f3' },
        { id: 'lemonnier', name: 'Camp Lemonnier (Djibouti)', lng: 43.153, lat: 11.547, color: '#2196f3' },
        { id: 'ainasad', name: 'Ain al-Asad AB (Iraq)', lng: 42.442, lat: 33.799, color: '#2196f3' },
      ]

      // IDF bases
      const idfBases = [
        { id: 'nevatim', name: 'Nevatim AB (F-35I)', lng: 34.882, lat: 31.208, color: '#00e676' },
        { id: 'hatzerim', name: 'Hatzerim AB (F-16I)', lng: 34.662, lat: 31.233, color: '#00e676' },
        { id: 'ramatdavid', name: 'Ramat David AB (F-15I)', lng: 35.183, lat: 32.665, color: '#00e676' },
        { id: 'palmachim', name: 'Palmachim (Arrow/Jericho)', lng: 34.691, lat: 31.898, color: '#00e676' },
      ]

      // Iran nuclear sites
      const nuclearSites = [
        { id: 'natanz', name: 'Natanz FEP (DAMAGED)', lng: 51.727, lat: 33.724, color: '#ff2d2d' },
        { id: 'fordow', name: 'Fordow (DAMAGED)', lng: 51.580, lat: 34.880, color: '#ff6b35' },
        { id: 'isfahan', name: 'Isfahan UCF (STRUCK)', lng: 51.678, lat: 32.682, color: '#ffc107' },
        { id: 'bushehr', name: 'Bushehr NPP (INTACT)', lng: 50.886, lat: 28.831, color: '#00e676' },
      ]

      // US Naval Forces — full order of battle
      const navalAssets = [
        {
          id: 'cvn69', symbol: '⛵', color: '#1a73e8', lng: 56.2, lat: 26.5,
          name: 'CVN-69 USS Eisenhower',
          detail: `
            <div style="color:#ffc107;margin-bottom:6px;font-size:11px;">CARRIER STRIKE GROUP 2</div>
            <div style="color:#2196f3;">📍 Persian Gulf — Active Ops</div>
            <div style="margin:6px 0;border-top:1px solid #1e2d3d;padding-top:6px;">
              <div style="color:#4a6a7a;margin-bottom:3px;">COMPOSITION:</div>
              <div>✈ CVN-69 USS Eisenhower (Nimitz-class)</div>
              <div style="color:#7f8c9b;">  └ 70x F/A-18E/F + EA-18G + E-2D + MH-60R</div>
              <div>🛡 CG-55 USS Leyte Gulf (Ticonderoga)</div>
              <div>⚓ DDG-76 USS Higgins</div>
              <div>⚓ DDG-83 USS Howard</div>
              <div>⚓ DDG-113 USS John Finn</div>
              <div>🔱 SSN-784 USS North Dakota (Virginia-class)</div>
              <div>⛽ USNS Supply (T-AOE)</div>
            </div>
            <div style="color:#ff2d2d;margin-top:6px;">STATUS: ACTIVE STRIKE OPS</div>
            <div style="color:#7f8c9b;font-size:9px;">Tomahawk + F/A-18 strikes on Iran · D+0→D+5</div>
          `
        },
        {
          id: 'cvn72', symbol: '⛵', color: '#1a73e8', lng: 63.5, lat: 19.8,
          name: 'CVN-72 USS Abraham Lincoln',
          detail: `
            <div style="color:#ffc107;margin-bottom:6px;font-size:11px;">CARRIER STRIKE GROUP 12</div>
            <div style="color:#2196f3;">📍 Arabian Sea — Active Ops</div>
            <div style="margin:6px 0;border-top:1px solid #1e2d3d;padding-top:6px;">
              <div style="color:#4a6a7a;margin-bottom:3px;">COMPOSITION:</div>
              <div>✈ CVN-72 USS Abraham Lincoln (Nimitz-class)</div>
              <div style="color:#7f8c9b;">  └ 70x F/A-18E/F + EA-18G + E-2D + MH-60R</div>
              <div>🛡 CG-54 USS Antietam (Ticonderoga)</div>
              <div>⚓ DDG-52 USS Barry</div>
              <div>⚓ DDG-63 USS Stethem</div>
              <div>⚓ DDG-107 USS Gravely</div>
              <div>🔱 SSN-780 USS California (Virginia-class)</div>
              <div>⛽ USNS Rainier (T-AOE)</div>
            </div>
            <div style="color:#ff2d2d;margin-top:6px;">STATUS: ACTIVE STRIKE OPS</div>
            <div style="color:#7f8c9b;font-size:9px;">Deep strike Iran + Houthi suppression · Arabian Sea</div>
          `
        },
        {
          id: 'lhd7', symbol: '🚢', color: '#00bcd4', lng: 43.8, lat: 14.5,
          name: 'LHD-7 USS Iwo Jima',
          detail: `
            <div style="color:#ffc107;margin-bottom:6px;font-size:11px;">AMPHIBIOUS READY GROUP 4</div>
            <div style="color:#00bcd4;">📍 Red Sea — Standby</div>
            <div style="margin:6px 0;border-top:1px solid #1e2d3d;padding-top:6px;">
              <div style="color:#4a6a7a;margin-bottom:3px;">COMPOSITION:</div>
              <div>🚢 LHD-7 USS Iwo Jima (Wasp-class)</div>
              <div style="color:#7f8c9b;">  └ AV-8B Harrier + CH-53E + MV-22 Osprey</div>
              <div>🚢 LPD-20 USS Green Bay (San Antonio)</div>
              <div>🚢 LSD-46 USS Tortuga (Whidbey Island)</div>
              <div>⚓ DDG-95 USS James E. Williams (escort)</div>
              <div>🟢 26th MEU — 2,200 Marines embarked</div>
            </div>
            <div style="color:#ffc107;margin-top:6px;">STATUS: STANDBY — NONCOMBATANT EVAC READY</div>
            <div style="color:#7f8c9b;font-size:9px;">NEO posture for US nationals · Red Sea patrol</div>
          `
        },
        {
          id: 'ohio', symbol: '🔱', color: '#ab47bc', lng: 58.5, lat: 24.0,
          name: 'SSGN-726 USS Ohio',
          detail: `
            <div style="color:#ffc107;margin-bottom:6px;font-size:11px;">GUIDED MISSILE SUBMARINE</div>
            <div style="color:#ab47bc;">📍 Persian Gulf / Gulf of Oman — CLASSIFIED</div>
            <div style="margin:6px 0;border-top:1px solid #1e2d3d;padding-top:6px;">
              <div style="color:#4a6a7a;margin-bottom:3px;">CAPABILITIES:</div>
              <div>🎯 154x Tomahawk TLAM (BGM-109)</div>
              <div>👥 66x Navy SEALs (2x DDS)</div>
              <div style="color:#ff5722;margin-top:4px;">⚡ PRIMARY TOMAHAWK PLATFORM D+0</div>
              <div style="color:#7f8c9b;font-size:9px;">Estimated 90+ TLAMs expended vs Iran D+0→D+3</div>
            </div>
            <div style="color:#ff2d2d;margin-top:6px;">STATUS: DEPLOYED — POSITION CLASSIFIED</div>
            <div style="color:#7f8c9b;font-size:9px;">Ohio-class converted SSBN → SSGN (2002)</div>
          `
        },
        {
          id: 'ddg107', symbol: '⚓', color: '#42a5f5', lng: 44.5, lat: 12.5,
          name: 'DDG-107 USS Gravely',
          detail: `
            <div style="color:#ffc107;margin-bottom:6px;font-size:11px;">ARLEIGH BURKE-CLASS DESTROYER</div>
            <div style="color:#42a5f5;">📍 Red Sea — Active Defense</div>
            <div style="margin:6px 0;border-top:1px solid #1e2d3d;padding-top:6px;">
              <div>🛡 SM-2MR / SM-6 air defense</div>
              <div>🎯 56x Tomahawk TLAM</div>
              <div>🔫 5-inch/62 Mk 45 gun</div>
              <div style="color:#ff6b35;margin-top:4px;">⚡ D+3: Intercepted Houthi cruise missile</div>
              <div style="color:#00e676;">  SM-2 intercept — no damage to vessel</div>
            </div>
            <div style="color:#ffc107;margin-top:6px;">STATUS: ACTIVE — HOUTHI SUPPRESSION</div>
          `
        },
        {
          id: 'p8', symbol: '✈', color: '#00bcd4', lng: 51.3, lat: 25.1,
          name: 'P-8A Poseidon Det. — Al Udeid',
          detail: `
            <div style="color:#ffc107;margin-bottom:6px;font-size:11px;">MARITIME PATROL AIRCRAFT</div>
            <div style="color:#00bcd4;">📍 Al Udeid AB, Qatar — Rotating patrols</div>
            <div style="margin:6px 0;border-top:1px solid #1e2d3d;padding-top:6px;">
              <div>🔍 ASW + ISR patrol — Persian Gulf</div>
              <div>🔍 IRGC submarine tracking</div>
              <div>🔍 Fast attack craft monitoring (Hormuz)</div>
              <div style="color:#7f8c9b;font-size:9px;">3x P-8A assigned, 24/7 coverage rotation</div>
            </div>
            <div style="color:#00e676;margin-top:6px;">STATUS: ACTIVE PATROLS</div>
          `
        },
      ]

      // Chokepoints
      const chokepoints = [
        { id: 'hormuz', name: 'Strait of Hormuz ⚠ RESTRICTED', lng: 56.25, lat: 26.56, color: '#ff2d2d' },
        { id: 'bab', name: 'Bab-el-Mandeb ⚠ HOSTILE', lng: 43.33, lat: 12.58, color: '#ff6b35' },
        { id: 'suez', name: 'Suez Canal', lng: 32.33, lat: 30.42, color: '#ffc107' },
      ]

      const addMarkers = (markers: Array<{ id: string; name: string; lng: number; lat: number; color: string }>, symbol: string) => {
        markers.forEach(m => {
          const el = document.createElement('div')
          el.innerHTML = symbol
          el.title = m.name
          el.style.cssText = `
            cursor: pointer;
            font-size: 14px;
            filter: drop-shadow(0 0 3px ${m.color});
          `
          const popup = new (MapLibreGL as typeof import('maplibre-gl')).Popup({ offset: 15, closeButton: false })
            .setHTML(`<div style="background:#0d1520;border:1px solid ${m.color};padding:8px;color:#c8d6e5;font-family:monospace;font-size:10px;max-width:200px;">
              <div style="color:${m.color};font-weight:bold;margin-bottom:4px;">${m.name}</div>
            </div>`)

          new (MapLibreGL as typeof import('maplibre-gl')).Marker({ element: el })
            .setLngLat([m.lng, m.lat])
            .setPopup(popup)
            .addTo(map as import('maplibre-gl').Map)
        })
      }

      addMarkers(usaBases, '✈')
      addMarkers(idfBases, '⭐')
      addMarkers(nuclearSites, '☢')
      addMarkers(chokepoints, '⚠')

      // Naval assets — custom symbols + rich popups
      navalAssets.forEach(asset => {
        const el = document.createElement('div')
        el.style.cssText = `cursor: pointer; width: 22px; height: 22px;`

        const inner = document.createElement('span')
        inner.textContent = asset.symbol
        inner.title = asset.name
        inner.style.cssText = `
          display: inline-block;
          font-size: 16px;
          filter: drop-shadow(0 0 4px ${asset.color});
          transition: transform 0.15s;
          transform-origin: center center;
        `
        el.appendChild(inner)
        el.onmouseenter = () => { inner.style.transform = 'scale(1.4)' }
        el.onmouseleave = () => { inner.style.transform = 'scale(1)' }

        const popup = new (MapLibreGL as typeof import('maplibre-gl')).Popup({ offset: 15, closeButton: true, maxWidth: '280px' })
          .setHTML(`<div style="background:#0d1520;border:1px solid ${asset.color};padding:10px;color:#c8d6e5;font-family:monospace;font-size:10px;line-height:1.6;">
            <div style="color:${asset.color};font-weight:bold;font-size:12px;margin-bottom:4px;">⚓ ${asset.name}</div>
            ${asset.detail}
          </div>`)

        new (MapLibreGL as typeof import('maplibre-gl')).Marker({ element: el })
          .setLngLat([asset.lng, asset.lat])
          .setPopup(popup)
          .addTo(map as import('maplibre-gl').Map)
      })
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        const m = mapInstanceRef.current as { remove?: () => void }
        m.remove?.()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full" style={{ background: '#0a0e14' }}>
      <div ref={mapRef} className="w-full h-full" />

      {/* Layer legend */}
      <div
        className="absolute bottom-2 left-2 font-military text-[8px] space-y-1"
        style={{ background: 'rgba(10,14,20,0.9)', padding: '6px 8px', border: '1px solid #1e2d3d' }}
      >
        <div className="font-military text-[7px] mb-1" style={{ color: '#4a6a7a' }}>— CONFLICT ZONES —</div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span style={{ display:'inline-block', width:12, height:3, background:'#ff2d2d', borderRadius:1 }}/>
          <span style={{ color: '#ff2d2d' }}>ATTACKER (IR · LB · YE)</span>
        </div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span style={{ display:'inline-block', width:12, height:3, background:'#00e676', borderRadius:1 }}/>
          <span style={{ color: '#00e676' }}>ATTACKED/STAGING (IL·IQ·SA·AE·BH·QA·JO·KW·CY)</span>
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <span style={{ display:'inline-block', width:12, height:3, background:'#ffc107', borderRadius:1 }}/>
          <span style={{ color: '#ffc107' }}>TRANSIT/STRUCK (SY)</span>
        </div>
        <div className="font-military text-[7px] mb-1" style={{ color: '#4a6a7a' }}>— ASSETS —</div>
        <div className="flex items-center gap-1"><span style={{ color: '#2196f3' }}>✈</span><span style={{ color: '#4a6a7a' }}>US Bases</span></div>
        <div className="flex items-center gap-1"><span style={{ color: '#00e676' }}>⭐</span><span style={{ color: '#4a6a7a' }}>IDF Bases</span></div>
        <div className="flex items-center gap-1"><span style={{ color: '#ff2d2d' }}>☢</span><span style={{ color: '#4a6a7a' }}>Nuclear Sites</span></div>
        <div className="flex items-center gap-1"><span style={{ color: '#1a73e8' }}>⛵</span><span style={{ color: '#4a6a7a' }}>Carrier (CSG)</span></div>
        <div className="flex items-center gap-1"><span style={{ color: '#00bcd4' }}>🚢</span><span style={{ color: '#4a6a7a' }}>Amphibious (ARG)</span></div>
        <div className="flex items-center gap-1"><span style={{ color: '#ab47bc' }}>🔱</span><span style={{ color: '#4a6a7a' }}>Submarine (SSGN)</span></div>
        <div className="flex items-center gap-1"><span style={{ color: '#42a5f5' }}>⚓</span><span style={{ color: '#4a6a7a' }}>Destroyer (DDG)</span></div>
        <div className="flex items-center gap-1"><span style={{ color: '#ffc107' }}>⚠</span><span style={{ color: '#4a6a7a' }}>Chokepoints</span></div>
      </div>

      {/* Map overlay info */}
      <div
        className="absolute top-2 right-2 font-military text-[8px]"
        style={{ background: 'rgba(10,14,20,0.85)', padding: '4px 8px', border: '1px solid #1e2d3d' }}
      >
        <div style={{ color: '#00ff88' }}>CENTCOM THEATER</div>
        <div style={{ color: '#4a6a7a' }}>Egypt → Pakistan | 5,200km</div>
      </div>

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#0a0e14' }}>
          <div className="font-military text-[10px]" style={{ color: '#00ff88' }}>
            LOADING THEATER MAP...
          </div>
        </div>
      )}
    </div>
  )
}
