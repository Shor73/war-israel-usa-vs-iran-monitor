// Simple in-process rate limiter — per IP, per endpoint
// Not distributed (resets on restart) but effective against single-source abuse

interface Bucket { count: number; resetAt: number }
const store = new Map<string, Bucket>()

// Clean up old entries every 10 minutes to avoid memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of store) {
    if (now > bucket.resetAt) store.delete(key)
  }
}, 10 * 60 * 1000)

export function rateLimit(
  req: Request,
  maxRequests: number,
  windowMs: number,
): { ok: boolean; retryAfter: number } {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const key = `${new URL(req.url).pathname}:${ip}`
  const now = Date.now()
  const bucket = store.get(key)

  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }

  if (bucket.count >= maxRequests) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count++
  return { ok: true, retryAfter: 0 }
}

// Validate and sanitize URLs — block javascript: / data: / file: schemes
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return '#'
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) return '#'
    return url
  } catch {
    return '#'
  }
}

// Strip HTML tags from text — prevents XSS from RSS content rendered in JSX
export function stripHtml(input: string | undefined | null): string {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, '')           // remove tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim()
}

// Validate ISO 3166-1 alpha-2 country codes (exactly 2 letters)
export function isValidIso2(code: string): boolean {
  return /^[A-Za-z]{2}$/.test(code)
}

