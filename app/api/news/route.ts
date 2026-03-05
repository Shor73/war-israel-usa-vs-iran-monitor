import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { RSS_FEEDS } from '@/lib/feeds'
import type { NewsItem } from '@/lib/types'
import { rateLimit, sanitizeUrl, stripHtml } from '@/lib/rate-limit'

const VALID_CATEGORIES = new Set(['ALL', 'WIRE', 'WESTERN', 'ISRAELI', 'IRANIAN', 'ARAB', 'DEFENSE', 'FINANCIAL', 'OSINT'])
const MAX_FEED_SIZE = 5 * 1024 * 1024 // 5 MB per feed — prevents memory exhaustion

const parser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
})

// Simple in-memory cache
interface CacheEntry { data: NewsItem[]; ts: number }
const cache: Map<string, CacheEntry> = new Map()
const TTL = 5 * 60 * 1000 // 5 min

const BREAKING_KEYWORDS = [
  'strike', 'attack', 'missile', 'launch', 'intercept', 'explosion', 'killed', 'bomb',
  'drone', 'rocket', 'ceasefire', 'escalation', 'retaliation', 'nuclear', 'hypersonic',
  'iron dome', 'arrow', 'hezbollah', 'houthi', 'irgc', 'mossad', 'cia', 'centcom'
]

const AI_TAGS: Record<string, NewsItem['aiTag']> = {
  strike: 'MILITARY', attack: 'MILITARY', missile: 'MILITARY', bomb: 'MILITARY',
  drone: 'MILITARY', rocket: 'MILITARY', intercept: 'MILITARY', soldier: 'MILITARY',
  ceasefire: 'DIPLOMATIC', talks: 'DIPLOMATIC', UN: 'DIPLOMATIC', sanction: 'DIPLOMATIC',
  oil: 'ECONOMIC', price: 'ECONOMIC', market: 'ECONOMIC', trade: 'ECONOMIC',
  refugee: 'HUMANITARIAN', hospital: 'HUMANITARIAN', civilian: 'HUMANITARIAN',
}

function detectTag(title: string): NewsItem['aiTag'] {
  const lower = title.toLowerCase()
  for (const [kw, tag] of Object.entries(AI_TAGS)) {
    if (lower.includes(kw.toLowerCase())) return tag
  }
  return 'MILITARY'
}

function isBreaking(title: string): boolean {
  const lower = title.toLowerCase()
  return BREAKING_KEYWORDS.some(kw => lower.includes(kw))
}

async function fetchFeed(feed: typeof RSS_FEEDS[0]): Promise<NewsItem[]> {
  try {
    // Size-limited fetch to prevent memory exhaustion from malicious RSS servers
    const controller = new AbortController()
    const res = await fetch(feed.url, {
      signal: AbortSignal.any([AbortSignal.timeout(8000), controller.signal]),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    })
    if (!res.ok || !res.body) return []

    // Check Content-Length — reject oversized feeds immediately
    const cl = res.headers.get('content-length')
    if (cl && parseInt(cl) > MAX_FEED_SIZE) return []

    // Stream with hard size cap
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      if (buffer.length > MAX_FEED_SIZE) { controller.abort(); reader.cancel(); return [] }
    }

    const parsed = await parser.parseString(buffer)
    return (parsed.items || []).slice(0, 5).map((item, idx) => ({
      id: `${feed.name}-${idx}-${Date.now()}`,
      title: stripHtml(item.title) || 'Untitled',           // strip HTML tags
      link: sanitizeUrl(item.link),                          // block javascript: URIs
      pubDate: item.pubDate || new Date().toISOString(),
      source: feed.name,
      category: feed.category,
      isBreaking: isBreaking(stripHtml(item.title) || ''),
      aiTag: detectTag(stripHtml(item.title) || ''),
      snippet: stripHtml(item.contentSnippet)?.slice(0, 120),
    }))
  } catch {
    return []
  }
}

export async function GET(req: Request) {
  // Rate limit: 30 req/min per IP
  const rl = rateLimit(req, 30, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, {
      status: 429,
      headers: { 'Retry-After': String(rl.retryAfter) },
    })
  }

  const { searchParams } = new URL(req.url)
  const rawCategory = searchParams.get('category') || 'ALL'
  // Whitelist validation — reject unknown categories
  const category = VALID_CATEGORIES.has(rawCategory) ? rawCategory : 'ALL'
  const cacheKey = `news_${category}`

  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json(cached.data)
  }

  const feedsToFetch = category === 'ALL'
    ? RSS_FEEDS
    : RSS_FEEDS.filter(f => f.category === category)

  // Batch fetch — 6 feeds at a time
  const results: NewsItem[] = []
  const batchSize = 6
  for (let i = 0; i < Math.min(feedsToFetch.length, 24); i += batchSize) {
    const batch = feedsToFetch.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(batch.map(fetchFeed))
    batchResults.forEach(r => {
      if (r.status === 'fulfilled') results.push(...r.value)
    })
  }

  // Deduplicate by title similarity and sort by date
  const seen = new Set<string>()
  const deduped = results.filter(item => {
    const key = item.title.slice(0, 60).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  deduped.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const final = deduped.slice(0, 100)
  cache.set(cacheKey, { data: final, ts: Date.now() })

  return NextResponse.json(final, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' }
  })
}
