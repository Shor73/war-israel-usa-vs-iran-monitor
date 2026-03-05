'use client'
import type { ReactNode } from 'react'
import { LiveDot } from '@/components/ui/ClassifiedBadge'

interface PanelContainerProps {
  title: string
  children: ReactNode
  className?: string
  headerRight?: ReactNode
  isLive?: boolean
  accentColor?: string
  scrollable?: boolean
}

export default function PanelContainer({
  title, children, className = '', headerRight, isLive = false, accentColor, scrollable = true
}: PanelContainerProps) {
  return (
    <div className={`mil-panel flex flex-col ${className}`}>
      <div className="mil-panel-header flex-shrink-0">
        <div className="flex items-center gap-1.5">
          {isLive && <LiveDot />}
          <span style={accentColor ? { color: accentColor } : undefined}>{title}</span>
        </div>
        {headerRight && <div>{headerRight}</div>}
      </div>
      <div className={`flex-1 min-h-0 ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {children}
      </div>
    </div>
  )
}
