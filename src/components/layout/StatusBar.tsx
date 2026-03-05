'use client'
import { useEffect, useState } from 'react'

export default function StatusBar() {
  const [lastUpdate, setLastUpdate] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setLastUpdate(`${String(now.getUTCHours()).padStart(2,'0')}:${String(now.getUTCMinutes()).padStart(2,'0')}Z`)
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])

  const systems = [
    { label: 'RSS', status: 'OK' },
    { label: 'MAP', status: 'OK' },
    { label: 'MARKETS', status: 'OK' },
    { label: 'SSE', status: 'OK' },
  ]

  return (
    <div
      className="flex items-center justify-between px-3"
      style={{
        background: '#060c12',
        borderTop: '1px solid #1e2d3d',
        height: '18px',
        gridColumn: '1 / -1',
        gridRow: '5',
      }}
    >
      <div className="flex items-center gap-4">
        {systems.map(({ label, status }) => (
          <div key={label} className="flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: status === 'OK' ? '#00e676' : '#ff2d2d' }}
            />
            <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>{label}</span>
          </div>
        ))}
        <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>FEEDS: 35 ACTIVE</span>
      </div>
      <div className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>
        LAST UPDATE: {lastUpdate} | UNCLASSIFIED // OSINT AGGREGATION
      </div>
      <div className="flex items-center gap-3 font-military text-[8px]">
        <span style={{ color: '#4a6a7a' }}>
          WAR START: 28 FEB 2026 | D+{Math.floor((new Date().getTime() - new Date('2026-02-28').getTime()) / 86400000)}
        </span>
        <span style={{ color: '#2a4a6b' }}>|</span>
        <span style={{ color: '#4a6a7a' }}>
          DEV BY{' '}
          <span style={{ color: '#c8d6e5' }}>ANGELO DI VEROLI</span>
          {' '}· IDEA BY{' '}
          <span style={{ color: '#c8d6e5' }}>DAVID DI TIVOLI</span>
          {' '}·{' '}
          <a
            href="https://github.com/Shor73/war-israel-usa-vs-iran-monitor"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#00ff88', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            GitHub
          </a>
          {' '}· GEO DATA:{' '}
          <a
            href="https://github.com/koala73/worldmonitor"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2196f3', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            koala73/worldmonitor
          </a>
        </span>
      </div>
    </div>
  )
}
