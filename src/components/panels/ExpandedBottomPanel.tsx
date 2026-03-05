'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import NewsMultiwall from '@/components/panels/NewsMultiwall'
import ConflictTimeline from '@/components/panels/ConflictTimeline'
import MissileStats from '@/components/panels/MissileStats'
import EconomicImpact from '@/components/panels/EconomicImpact'
import AirspacePanel from '@/components/panels/AirspacePanel'
import WarSummary from '@/components/panels/WarSummary'
import CasualtyTracker from '@/components/panels/CasualtyTracker'

const LiveBroadcasts = dynamic(() => import('@/components/panels/LiveBroadcasts'), { ssr: false })

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

interface Props {
  initialTab: string
  onClose: () => void
}

export default function ExpandedBottomPanel({ initialTab, onClose }: Props) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [closing, setClosing] = useState(false)

  const close = () => {
    setClosing(true)
    setTimeout(onClose, 190) // wait for close animation
  }

  // ESC key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`panel-overlay-backdrop${closing ? ' closing' : ''}`}
        onClick={close}
      />

      {/* Panel */}
      <div className={`panel-overlay-container${closing ? ' closing' : ''}`}>
        {/* Header: tab bar + close */}
        <div className="panel-overlay-header">
          {BOTTOM_TABS.map(t => (
            <button
              key={t.id}
              className="panel-overlay-tab"
              onClick={() => setActiveTab(t.id)}
              style={{
                color: activeTab === t.id ? t.color : '#4a6a7a',
                backgroundColor: activeTab === t.id ? `${t.color}12` : 'transparent',
                borderBottom: activeTab === t.id ? `2px solid ${t.color}` : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
          <button className="panel-overlay-close" onClick={close}>
            ESC ✕ COLLAPSE
          </button>
        </div>

        {/* Content */}
        <div className="panel-overlay-content">
          {activeTab === 'summary'    && <div className="h-full" style={{ background: '#0a0e14' }}><WarSummary /></div>}
          {activeTab === 'casualties' && <div className="h-full" style={{ background: '#0a0e14' }}><CasualtyTracker /></div>}
          {activeTab === 'news'       && <NewsMultiwall />}
          {activeTab === 'timeline'   && <div className="h-full" style={{ background: '#0a0e14' }}><ConflictTimeline /></div>}
          {activeTab === 'broadcasts' && <div className="h-full" style={{ background: '#0a0e14' }}><LiveBroadcasts /></div>}
          {activeTab === 'missiles'   && <div className="h-full" style={{ background: '#0a0e14' }}><MissileStats /></div>}
          {activeTab === 'economy'    && <div className="h-full" style={{ background: '#0a0e14' }}><EconomicImpact /></div>}
          {activeTab === 'airspace'   && <div className="h-full" style={{ background: '#0a0e14' }}><AirspacePanel /></div>}
        </div>
      </div>
    </>
  )
}
