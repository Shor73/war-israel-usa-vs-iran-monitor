import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:",  // MapLibre GL: WASM + dynamic workers
  "worker-src blob: 'self'",                                  // MapLibre GL Web Workers (blob: URLs)
  "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
  "img-src 'self' https: data: blob:",                       // flagcdn.com + map tiles + MapLibre sprites
  "font-src 'self' fonts.gstatic.com fonts.googleapis.com data:",
  "connect-src 'self' https: wss: blob:",                    // API routes + map tiles + SSE + MapLibre
  "frame-src 'self' https://www.youtube.com https://youtube.com",
  "media-src 'self' https://www.youtube.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(self), payment=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Cross-Origin-Opener-Policy',   value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy',  value: 'cross-origin' },  // cross-origin needed for flagcdn.com images + map tiles
          { key: 'Content-Security-Policy',   value: CSP },
        ],
      },
    ]
  },
}

export default nextConfig;
