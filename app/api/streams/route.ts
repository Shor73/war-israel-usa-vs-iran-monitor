import { NextResponse } from 'next/server'

// Channel IDs are stable (don't change unlike video IDs)
// Video IDs change every time a live stream restarts — resolved dynamically via RSS
const CHANNELS = [
  { key: 'i24',       name: 'i24 News English',  channelId: 'UCvHDpsWKADrDia0c99X37vg', fallback: 'arQQHsgw2Ek', label: 'IL',   color: '#2196f3' },
  { key: 'sky',       name: 'Sky News',           channelId: 'UCoMdktPbSTixAyNGwb-UYkQ', fallback: 'uvviIF4725I', label: 'NEWS', color: '#ab47bc' },
  { key: 'france24',  name: 'France 24 English',  channelId: 'UCQfwfsi5VrQ8yKZ-UWmAEFg', fallback: 'Ap-UM1O9RBU', label: 'NEWS', color: '#2196f3' },
  { key: 'bbc',       name: 'BBC News',           channelId: 'UC16niRr50-MSBwiO3YDb3RA', fallback: 'bjgQzJzCZKs', label: 'NEWS', color: '#ff6b35' },
  { key: 'dw',        name: 'DW News',            channelId: 'UCknLrEdhRCp1aegoMqRaCZg', fallback: 'LuKwFajn37U', label: 'NEWS', color: '#ffc107' },
  { key: 'arabiya',   name: 'Al Arabiya',         channelId: '',                          fallback: 'n7eQejkXbnM', label: 'ARAB', color: '#00e676' },
]

// Cache: refreshes every 30 minutes (live streams restart, video IDs change)
let cache: { streams: StreamInfo[]; ts: number } | null = null
const CACHE_TTL = 30 * 60 * 1000

export interface StreamInfo {
  key: string
  name: string
  videoId: string
  label: string
  color: string
}

async function resolveVideoId(channelId: string, fallback: string): Promise<string> {
  if (!channelId) return fallback
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) return fallback
    const xml = await res.text()
    const match = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)
    return match?.[1] || fallback
  } catch {
    return fallback
  }
}

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.streams)
  }

  const streams = await Promise.all(
    CHANNELS.map(async (ch) => ({
      key: ch.key,
      name: ch.name,
      label: ch.label,
      color: ch.color,
      videoId: await resolveVideoId(ch.channelId, ch.fallback),
    }))
  )

  cache = { streams, ts: Date.now() }
  return NextResponse.json(streams)
}
