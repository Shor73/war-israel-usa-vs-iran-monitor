'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import CommandHeader from '@/components/layout/CommandHeader'
import IntelTicker from '@/components/layout/IntelTicker'
import StatusBar from '@/components/layout/StatusBar'
import PanelContainer from '@/components/layout/PanelContainer'
import AgencyIntelFeed from '@/components/panels/AgencyIntelFeed'
import LiveOpsTracker from '@/components/panels/LiveOpsTracker'
import MissileStats from '@/components/panels/MissileStats'
import EconomicImpact from '@/components/panels/EconomicImpact'
import AirspacePanel from '@/components/panels/AirspacePanel'
import GulfStatesMonitor from '@/components/panels/GulfStatesMonitor'
import CommsIntercept from '@/components/panels/CommsIntercept'
import StrategicAssets from '@/components/panels/StrategicAssets'
import ConflictTimeline from '@/components/panels/ConflictTimeline'
import NewsMultiwall from '@/components/panels/NewsMultiwall'
import NuclearWatch from '@/components/panels/NuclearWatch'
import CommandBrief from '@/components/panels/CommandBrief'
import ZevaAdom from '@/components/panels/ZevaAdom'
import MobileNav, { type MobileTab } from '@/components/layout/MobileNav'
import ExpandedBottomPanel from '@/components/panels/ExpandedBottomPanel'
import { useMobile } from '@/hooks/useMobile'

// Dynamic imports (client-only / heavy)
const TheaterMap = dynamic(() => import('@/components/map/TheaterMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full" style={{ background: '#0a0e14' }}>
      <span className="font-military text-[10px]" style={{ color: '#00ff88' }}>LOADING THEATER MAP...</span>
    </div>
  )
})

const LiveBroadcasts = dynamic(() => import('@/components/panels/LiveBroadcasts'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full" style={{ background: '#0a0e14' }}>
      <span className="font-military text-[10px]" style={{ color: '#00ff88' }}>LOADING STREAMS...</span>
    </div>
  )
})

// Desktop tab configs
const BOTTOM_TABS = [
  { id: 'summary',    label: 'WAR SUMMARY',       color: '#ff2d2d' },
  { id: 'casualties', label: 'CASUALTIES',         color: '#ff6b35' },
  { id: 'news',       label: 'NEWS MULTIWALL',    color: '#c8d6e5' },
  { id: 'timeline',   label: 'CONFLICT TIMELINE', color: '#ffc107' },
  { id: 'broadcasts', label: 'LIVE BROADCASTS',   color: '#ff2d2d' },
  { id: 'missiles',   label: 'STRIKE STATS',      color: '#ff5722' },
  { id: 'economy',    label: 'ECONOMIC IMPACT',   color: '#ff6b35' },
  { id: 'airspace',   label: 'AIRSPACE/NOTAM',    color: '#2196f3' },
]

const CENTER_TABS = [
  { id: 'map',    label: 'THEATER MAP',      color: '#00ff88' },
  { id: 'gulf',   label: 'GULF MONITOR',     color: '#ffc107' },
  { id: 'assets', label: 'STRATEGIC ASSETS', color: '#2196f3' },
  { id: 'sigint', label: 'SIGINT TERMINAL',  color: '#00ff41' },
]

// ─────────────────────────────────────────────────────────────
// MOBILE PANEL — single fullscreen panel, bottom tab nav
// ─────────────────────────────────────────────────────────────
function MobileDashboard() {
  const [activeTab, setActiveTab] = useState<MobileTab>('map')
  const [mobileNewsTab, setMobileNewsTab] = useState<'news' | 'timeline' | 'broadcasts'>('news')
  const [mobileSigintTab, setMobileSigintTab] = useState<'sigint' | 'gulf' | 'assets' | 'missiles' | 'economy' | 'airspace'>('sigint')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',     // dynamic viewport height (handles mobile URL bar)
        width: '100vw',
        background: '#0a0e14',
        overflow: 'hidden',
      }}
    >
      {/* Condensed header for mobile */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-3"
        style={{ background: '#060c12', borderBottom: '1px solid #1e2d3d', height: 44 }}
      >
        <div>
          <div className="font-military text-[10px]" style={{ color: '#ff6b35' }}>OPERATION ULTIMATUM</div>
          <div className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>DEFCON 2 · FPCON CHARLIE</div>
        </div>
        <MobileClockDefcon />
      </div>

      {/* Ticker */}
      <div className="flex-shrink-0">
        <IntelTicker />
      </div>

      {/* Active panel — fills remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'map' && <TheaterMap />}

        {activeTab === 'intel' && (
          <PanelContainer title="AGENCY INTEL FEED" isLive scrollable={false} className="h-full">
            <AgencyIntelFeed />
          </PanelContainer>
        )}

        {activeTab === 'alerts' && <ZevaAdom />}

        {activeTab === 'news' && (
          <div className="flex flex-col h-full">
            {/* Sub-tabs */}
            <div className="flex flex-shrink-0 border-b" style={{ borderColor: '#1e2d3d', background: '#060c12' }}>
              {[
                { id: 'news' as const,       label: '📰 NEWS',      color: '#c8d6e5' },
                { id: 'timeline' as const,   label: '⏱ TIMELINE',  color: '#ffc107' },
                { id: 'broadcasts' as const, label: '📺 LIVE TV',   color: '#ff2d2d' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setMobileNewsTab(t.id)}
                  className="flex-1 font-military text-[8px] py-1.5 transition-colors"
                  style={{
                    color: mobileNewsTab === t.id ? t.color : '#4a6a7a',
                    borderBottom: mobileNewsTab === t.id ? `2px solid ${t.color}` : '2px solid transparent',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              {mobileNewsTab === 'news' && <MobileNewsFeed />}
              {mobileNewsTab === 'timeline' && (
                <div className="h-full overflow-y-auto" style={{ background: '#0a0e14' }}>
                  <ConflictTimeline />
                </div>
              )}
              {mobileNewsTab === 'broadcasts' && (
                <div className="h-full" style={{ background: '#0a0e14' }}>
                  <LiveBroadcasts />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ops' && (
          <PanelContainer title="LIVE OPS TRACKER" isLive scrollable={false} className="h-full">
            <LiveOpsTracker />
          </PanelContainer>
        )}

        {activeTab === 'sigint' && (
          <div className="flex flex-col h-full">
            {/* Sub-tabs */}
            <div className="flex flex-shrink-0 overflow-x-auto border-b" style={{ borderColor: '#1e2d3d', background: '#060c12' }}>
              {[
                { id: 'sigint' as const,   label: '📡 SIGINT',   color: '#ab47bc' },
                { id: 'gulf' as const,     label: '🌍 GULF',     color: '#ffc107' },
                { id: 'assets' as const,   label: '⚔ ASSETS',   color: '#2196f3' },
                { id: 'missiles' as const, label: '🚀 STRIKES',  color: '#ff5722' },
                { id: 'economy' as const,  label: '💹 ECONOMY',  color: '#ff6b35' },
                { id: 'airspace' as const, label: '✈ AIRSPACE', color: '#2196f3' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setMobileSigintTab(t.id)}
                  className="flex-shrink-0 font-military text-[8px] px-3 py-1.5 transition-colors"
                  style={{
                    color: mobileSigintTab === t.id ? t.color : '#4a6a7a',
                    borderBottom: mobileSigintTab === t.id ? `2px solid ${t.color}` : '2px solid transparent',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              {mobileSigintTab === 'sigint'   && <CommsIntercept />}
              {mobileSigintTab === 'gulf'     && <div className="h-full overflow-y-auto"><GulfStatesMonitor /></div>}
              {mobileSigintTab === 'assets'   && <div className="h-full overflow-y-auto"><StrategicAssets /></div>}
              {mobileSigintTab === 'missiles' && <div className="h-full overflow-y-auto" style={{ background: '#0a0e14' }}><MissileStats /></div>}
              {mobileSigintTab === 'economy'  && <div className="h-full overflow-y-auto" style={{ background: '#0a0e14' }}><EconomicImpact /></div>}
              {mobileSigintTab === 'airspace' && <div className="h-full overflow-y-auto" style={{ background: '#0a0e14' }}><AirspacePanel /></div>}
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <MobileNav active={activeTab} onChange={setActiveTab} />

      {/* Modals */}
      <NuclearWatch />
      <CommandBrief />
    </div>
  )
}

// Mobile clock + DEFCON badge (lightweight, no full CommandHeader)
function MobileClockDefcon() {
  const [time, setTime] = useState('--:--:--Z')
  useEffect(() => {
    const update = () => setTime(new Date().toUTCString().slice(17, 25) + 'Z')
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex items-center gap-2">
      <div className="font-mono-data text-[10px]" style={{ color: '#00ff88' }}>{time}</div>
      <div
        className="font-military text-[9px] border px-1 py-0.5"
        style={{ color: '#ff6b35', borderColor: '#ff6b35', background: 'rgba(255,107,53,0.1)' }}
      >
        DEFCON 2
      </div>
    </div>
  )
}

// Mobile news feed: single column, scrollable
function MobileNewsFeed() {
  const [items, setItems] = useState<{ title: string; source: string; link: string; isBreaking?: boolean }[]>([])

  useEffect(() => {
    fetch('/api/news?category=WIRE')
      .then(r => r.json())
      .then((d: { title: string; source: string; link: string; isBreaking?: boolean }[]) => setItems(d.slice(0, 30)))
      .catch(() => {})
  }, [])

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#0a0e14' }}>
      {items.map((item, i) => (
        <a
          key={i}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block border-b p-3"
          style={{ borderColor: '#1e2d3d', textDecoration: 'none' }}
        >
          <div className="flex items-center gap-1 mb-1">
            {item.isBreaking && (
              <span className="font-military text-[8px] border px-0.5" style={{ color: '#ff2d2d', borderColor: '#ff2d2d' }}>BREAKING</span>
            )}
            <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>{item.source}</span>
          </div>
          <div className="font-sans text-[11px] leading-snug" style={{ color: '#c8d6e5' }}>{item.title}</div>
        </a>
      ))}
      {items.length === 0 && (
        <div className="p-4 font-military text-[9px] text-center" style={{ color: '#4a6a7a' }}>LOADING...</div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// DESKTOP DASHBOARD — original 3-column grid
// ─────────────────────────────────────────────────────────────
function DesktopDashboard() {
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null)
  const [centerTab, setCenterTab] = useState('map')
  const [rightTab, setRightTab] = useState<'ops' | 'alerts'>('ops')

  return (
    <div className="dashboard-grid">
      <CommandHeader />
      <IntelTicker />

      {/* Col 1: Agency Intel Feed */}
      <div style={{ gridColumn: '1', gridRow: '3', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <PanelContainer title="AGENCY INTEL FEED" isLive scrollable={false} className="flex-1">
          <AgencyIntelFeed />
        </PanelContainer>
      </div>

      {/* Col 2: Center tabbed panel */}
      <div style={{ gridColumn: '2', gridRow: '3', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="flex flex-shrink-0 border-b" style={{ borderColor: '#1e2d3d', background: '#0d1520' }}>
          {CENTER_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setCenterTab(t.id)}
              className="font-military text-[8px] px-3 py-1.5 flex-1 transition-colors"
              style={{
                color: centerTab === t.id ? t.color : '#4a6a7a',
                backgroundColor: centerTab === t.id ? `${t.color}10` : 'transparent',
                borderBottom: centerTab === t.id ? `1px solid ${t.color}` : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          {centerTab === 'map'    && <TheaterMap />}
          {centerTab === 'gulf'   && <div className="h-full" style={{ background: '#0d1520' }}><GulfStatesMonitor /></div>}
          {centerTab === 'assets' && <div className="h-full" style={{ background: '#0d1520' }}><StrategicAssets /></div>}
          {centerTab === 'sigint' && <div className="h-full"><CommsIntercept /></div>}
        </div>
      </div>

      {/* Col 3: Live Ops / Tzeva Adom */}
      <div style={{ gridColumn: '3', gridRow: '3', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="flex flex-shrink-0 border-b" style={{ borderColor: '#1e2d3d', background: '#060c12' }}>
          <button
            onClick={() => setRightTab('ops')}
            className="font-military text-[8px] px-3 py-1.5 flex-1 transition-colors"
            style={{
              color: rightTab === 'ops' ? '#00ff88' : '#4a6a7a',
              backgroundColor: rightTab === 'ops' ? 'rgba(0,255,136,0.08)' : 'transparent',
              borderBottom: rightTab === 'ops' ? '1px solid #00ff88' : 'none',
            }}
          >
            ⚡ LIVE OPS
          </button>
          <button
            onClick={() => setRightTab('alerts')}
            className="font-military text-[8px] px-3 py-1.5 flex-1 transition-colors"
            style={{
              color: rightTab === 'alerts' ? '#ff2d2d' : '#4a6a7a',
              backgroundColor: rightTab === 'alerts' ? 'rgba(255,45,45,0.08)' : 'transparent',
              borderBottom: rightTab === 'alerts' ? '1px solid #ff2d2d' : 'none',
            }}
          >
            🔴 TZEVA ADOM
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          {rightTab === 'ops'    && <PanelContainer title="LIVE OPS TRACKER" isLive scrollable={false} className="h-full"><LiveOpsTracker /></PanelContainer>}
          {rightTab === 'alerts' && <ZevaAdom />}
        </div>
      </div>

      {/* Row 4: Bottom tab bar — click any tab to expand fullscreen */}
      <div style={{ gridColumn: '1 / -1', gridRow: '4', display: 'flex', alignItems: 'stretch', overflow: 'hidden', background: '#060c12', borderTop: '1px solid #1e2d3d' }}>
        {BOTTOM_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setExpandedPanel(t.id)}
            className="font-military text-[8px] px-3 flex-1 transition-colors"
            style={{
              color: expandedPanel === t.id ? t.color : '#4a6a7a',
              backgroundColor: expandedPanel === t.id ? `${t.color}10` : 'transparent',
              borderBottom: expandedPanel === t.id ? `2px solid ${t.color}` : '2px solid transparent',
              borderRight: '1px solid #1e2d3d',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            {t.label}
          </button>
        ))}
        <div
          className="font-military text-[7px] px-3 flex items-center flex-shrink-0"
          style={{ color: '#2a4a6b', borderLeft: '1px solid #1e2d3d' }}
        >
          CLICK TO EXPAND
        </div>
      </div>

      <StatusBar />
      <NuclearWatch />
      <CommandBrief />

      {/* Fullscreen panel overlay */}
      {expandedPanel && (
        <ExpandedBottomPanel
          initialTab={expandedPanel}
          onClose={() => setExpandedPanel(null)}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ROOT — switch based on viewport
// ─────────────────────────────────────────────────────────────
export default function Page() {
  const isMobile = useMobile()
  return isMobile ? <MobileDashboard /> : <DesktopDashboard />
}
