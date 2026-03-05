'use client'
import type { ClassLevel, AgencyType } from '@/lib/types'
import { classColor, agencyColor } from '@/lib/utils'

interface ClassifiedBadgeProps {
  level: ClassLevel
  className?: string
}
export function ClassifiedBadge({ level, className = '' }: ClassifiedBadgeProps) {
  return (
    <span
      className={`text-[9px] font-military border px-1 py-0.5 ${className}`}
      style={{ color: classColor(level), borderColor: classColor(level) }}
    >
      {level}
    </span>
  )
}

interface AgencyBadgeProps {
  agency: AgencyType
  className?: string
}
export function AgencyBadge({ agency, className = '' }: AgencyBadgeProps) {
  return (
    <span
      className={`text-[9px] font-military border px-1 py-0.5 ${className}`}
      style={{ color: agencyColor(agency), borderColor: agencyColor(agency) }}
    >
      {agency}
    </span>
  )
}

interface LiveDotProps {
  color?: string
  pulse?: boolean
}
export function LiveDot({ color = '#ff2d2d', pulse = true }: LiveDotProps) {
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full ${pulse ? 'live-dot' : ''}`}
      style={{ backgroundColor: color }}
    />
  )
}

interface ThreatDotProps {
  level: string
  size?: 'sm' | 'md'
}
export function ThreatDot({ level, size = 'sm' }: ThreatDotProps) {
  const colors: Record<string, string> = {
    CRITICAL: '#ff2d2d', HIGH: '#ff6b35', ELEVATED: '#ff6b35',
    WATCH: '#ffc107', LOW: '#00e676', UNKNOWN: '#7f8c9b'
  }
  const sz = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'
  return (
    <span
      className={`inline-block ${sz} rounded-full live-dot`}
      style={{ backgroundColor: colors[level] || '#7f8c9b' }}
    />
  )
}
