'use client'

export type MobileTab = 'map' | 'intel' | 'alerts' | 'news' | 'ops' | 'sigint'

export const MOBILE_TABS: { id: MobileTab; icon: string; label: string; color: string }[] = [
  { id: 'map',    icon: '🗺',  label: 'MAP',    color: '#00ff88' },
  { id: 'intel',  icon: '📡',  label: 'INTEL',  color: '#ffd700' },
  { id: 'alerts', icon: '🔴',  label: 'ALERTS', color: '#ff2d2d' },
  { id: 'news',   icon: '📰',  label: 'NEWS',   color: '#c8d6e5' },
  { id: 'ops',    icon: '⚡',  label: 'OPS',    color: '#00e676' },
  { id: 'sigint', icon: '📊',  label: 'SIGINT', color: '#ab47bc' },
]

interface MobileNavProps {
  active: MobileTab
  onChange: (tab: MobileTab) => void
}

export default function MobileNav({ active, onChange }: MobileNavProps) {
  return (
    <nav
      className="flex border-t"
      style={{
        borderColor: '#1e2d3d',
        background: '#060c12',
        height: 56,
        flexShrink: 0,
      }}
    >
      {MOBILE_TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
          style={{
            background: active === t.id ? `${t.color}12` : 'transparent',
            borderTop: active === t.id ? `2px solid ${t.color}` : '2px solid transparent',
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>{t.icon}</span>
          <span
            className="font-military text-[7px]"
            style={{ color: active === t.id ? t.color : '#4a6a7a' }}
          >
            {t.label}
          </span>
        </button>
      ))}
    </nav>
  )
}
