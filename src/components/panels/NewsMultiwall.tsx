'use client'
import { useState, useEffect, useCallback } from 'react'
import { timeAgo } from '@/lib/utils'
import type { NewsItem } from '@/lib/types'

const COLUMNS = [
  { id: 'WIRE', label: 'Wire / BBC', color: '#c8d6e5' },
  { id: 'ISRAELI', label: 'Israeli Media', color: '#2196f3' },
  { id: 'ARAB', label: 'Arab Media', color: '#ffc107' },
  { id: 'DEFENSE', label: 'Defense', color: '#00e676' },
  { id: 'OSINT', label: 'OSINT', color: '#ab47bc' },
  { id: 'FINANCIAL', label: 'Markets', color: '#ff6b35' },
]

const AI_TAG_COLORS: Record<string, string> = {
  MILITARY: '#ff2d2d', DIPLOMATIC: '#2196f3', ECONOMIC: '#ffc107',
  HUMANITARIAN: '#00e676', INTELLIGENCE: '#ab47bc',
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block border-b hover:bg-white/5 transition-colors p-2"
      style={{ borderColor: '#0d1520', textDecoration: 'none' }}
    >
      <div className="flex items-center gap-1 mb-0.5">
        {item.isBreaking && (
          <span className="font-military text-[8px] border px-0.5" style={{ color: '#ff2d2d', borderColor: '#ff2d2d' }}>
            BREAKING
          </span>
        )}
        <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>{item.source}</span>
        <span className="text-[8px]" style={{ color: '#2a4a6b' }}>·</span>
        <span className="font-mono-data text-[8px]" style={{ color: '#2a4a6b' }}>{timeAgo(item.pubDate)}</span>
        {item.aiTag && (
          <span
            className="font-military text-[7px] border px-0.5 ml-auto"
            style={{ color: AI_TAG_COLORS[item.aiTag] || '#4a6a7a', borderColor: `${AI_TAG_COLORS[item.aiTag]}50` }}
          >
            {item.aiTag}
          </span>
        )}
      </div>
      <div className="font-sans text-[9px] leading-tight" style={{ color: '#c8d6e5' }}>
        {item.title}
      </div>
    </a>
  )
}

function NewsColumn({ category, label, color }: { category: string; label: string; color: string }) {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`/api/news?category=${category}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.slice(0, 20))
      }
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [category])

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [fetch_])

  return (
    <div className="flex flex-col border-r" style={{ borderColor: '#1e2d3d', minWidth: 0 }}>
      <div
        className="flex-shrink-0 px-2 py-1 border-b font-military text-[9px]"
        style={{ borderColor: '#1e2d3d', color, background: '#0d1520' }}
      >
        {label}
        {!loading && <span className="ml-1" style={{ color: '#4a6a7a' }}>({items.length})</span>}
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-2 font-military text-[8px]" style={{ color: '#2a4a6b' }}>LOADING...</div>
        ) : items.length === 0 ? (
          <div className="p-2 font-military text-[8px]" style={{ color: '#2a4a6b' }}>NO FEED</div>
        ) : (
          items.map((item) => <NewsCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  )
}

export default function NewsMultiwall() {
  return (
    <div className="grid h-full" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
      {COLUMNS.map(col => (
        <NewsColumn key={col.id} category={col.id} label={col.label} color={col.color} />
      ))}
    </div>
  )
}
