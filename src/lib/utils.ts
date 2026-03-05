import { format } from 'date-fns'
import type { ThreatLevel, ClassLevel, AgencyType, OpsType } from './types'

// DTG format: 041650ZMAR2026
export function toDTG(date: Date = new Date()): string {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const mins = String(date.getUTCMinutes()).padStart(2, '0')
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  const month = months[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${day}${hours}${mins}Z${month}${year}`
}

// Short DTG: [041650Z MAR26]
export function toShortDTG(date: Date = new Date()): string {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const mins = String(date.getUTCMinutes()).padStart(2, '0')
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  const month = months[date.getUTCMonth()]
  const year = String(date.getUTCFullYear()).slice(2)
  return `[${day}${hours}${mins}Z ${month}${year}]`
}

// UTC display: 04 MAR 2026 16:50:16Z
export function toMilTime(date: Date = new Date()): string {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  const month = months[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  const time = format(date, 'HH:mm:ss')
  return `${day} ${month} ${year} ${time}Z`
}

// Relative time
export function timeAgo(dateStr: string): string {
  const now = new Date()
  const then = new Date(dateStr)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

// Threat level colors
export function threatColor(level: ThreatLevel): string {
  switch (level) {
    case 'CRITICAL': return '#ff2d2d'
    case 'HIGH': return '#ff6b35'
    case 'ELEVATED': return '#ff6b35'
    case 'WATCH': return '#ffc107'
    case 'UNKNOWN': return '#7f8c9b'
    default: return '#00e676'
  }
}

export function threatBg(level: ThreatLevel): string {
  switch (level) {
    case 'CRITICAL': return 'rgba(255,45,45,0.15)'
    case 'HIGH':
    case 'ELEVATED': return 'rgba(255,107,53,0.1)'
    case 'WATCH': return 'rgba(255,193,7,0.1)'
    default: return 'rgba(0,230,118,0.08)'
  }
}

// DEFCON color
export function defconColor(level: number): string {
  switch (level) {
    case 1: return '#ff2d2d'
    case 2: return '#ff6b35'
    case 3: return '#ffc107'
    case 4: return '#00e676'
    case 5: return '#2196f3'
    default: return '#7f8c9b'
  }
}

// Agency styles
export function agencyColor(agency: AgencyType): string {
  switch (agency) {
    case 'CIA': return '#1a73e8'
    case 'MOSSAD': return '#ffd700'
    case 'AMAN': return '#00c853'
    case 'OSINT': return '#ab47bc'
    case 'IRGC': return '#ff5722'
    default: return '#7f8c9b'
  }
}

// Classification color
export function classColor(level: ClassLevel): string {
  switch (level) {
    case 'TOP SECRET': return '#ff6b35'
    case 'SECRET': return '#ff2d2d'
    case 'CONFIDENTIAL': return '#ffc107'
    case 'UNCLASSIFIED': return '#00e676'
    default: return '#7f8c9b'
  }
}

// Op type color
export function opsColor(type: OpsType): string {
  switch (type) {
    case 'STRIKE': return '#ff2d2d'
    case 'INTERCEPT': return '#00e676'
    case 'LAUNCH': return '#ff6b35'
    case 'RECON': return '#2196f3'
    case 'NAVAL': return '#00bcd4'
    case 'CYBER': return '#ab47bc'
    case 'DIPLOMATIC': return '#ffc107'
    default: return '#7f8c9b'
  }
}

// Event type color
export function eventTypeColor(type: string): string {
  switch (type) {
    case 'military': return '#ff2d2d'
    case 'diplomatic': return '#2196f3'
    case 'economic': return '#ffc107'
    case 'intelligence': return '#ab47bc'
    case 'humanitarian': return '#00e676'
    default: return '#7f8c9b'
  }
}

// Severity emoji
export function severityEmoji(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return '🔴'
    case 'HIGH': return '🟠'
    case 'MEDIUM': return '🟡'
    case 'LOW': return '🟢'
    default: return '⚪'
  }
}

// Format number with + sign
export function formatDelta(n: number): string {
  return n > 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`
}

// Format price
export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`
}

// Short number
export function shortNum(n: number): string {
  if (n >= 1000) return `${(n/1000).toFixed(1)}k`
  return String(n)
}
