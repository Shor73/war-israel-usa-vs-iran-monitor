// Flag image component — uses flagcdn.com (free CDN, no API key needed)
// ISO 3166-1 alpha-2 codes, lowercase: "il" -> https://flagcdn.com/w20/il.png
// Works on ALL platforms including Windows (no emoji rendering dependency)

interface FlagProps {
  iso: string        // e.g. "IL", "IR", "US" — converted to lowercase internally
  size?: number      // width in px, height is auto-proportioned (4:3 ratio)
  className?: string
  style?: React.CSSProperties
}

export function Flag({ iso, size = 18, className = '', style }: FlagProps) {
  const code = iso.toLowerCase()
  return (
    <img
      src={`https://flagcdn.com/w20/${code}.png`}
      srcSet={`https://flagcdn.com/w40/${code}.png 2x`}
      width={size}
      height={Math.round(size * 0.75)}
      alt={iso.toUpperCase()}
      className={className}
      style={{ verticalAlign: 'middle', display: 'inline-block', objectFit: 'cover', borderRadius: 1, ...style }}
      loading="lazy"
    />
  )
}

// Inline helper for use in HTML strings (MapLibre popups, innerHTML)
// Returns a plain <img> tag string — no React needed
export function flagImg(iso: string, size = 16): string {
  // Strict ISO 3166-1 alpha-2 validation — prevents HTML injection via iso param
  if (!/^[A-Za-z]{2}$/.test(iso)) return ''
  const code = iso.toLowerCase()
  const h = Math.round(size * 0.75)
  return `<img src="https://flagcdn.com/w20/${code}.png" srcset="https://flagcdn.com/w40/${code}.png 2x" width="${size}" height="${h}" alt="${iso.toUpperCase()}" style="vertical-align:middle;display:inline-block;border-radius:1px;margin-right:4px;" loading="lazy" />`
}

// ISO code lookup for threat sources
export const THREAT_ISO: Record<string, string> = {
  HAMAS:     'ps',
  HEZBOLLAH: 'lb',
  IRAN:      'ir',
  HOUTHI:    'ye',
  USA:       'us',
  IDF:       'il',
  UK:        'gb',
  RUSSIA:    'ru',
  CHINA:     'cn',
  UNKNOWN:   'un',
}

// ISO3 (alpha-3) → ISO2 (alpha-2) for Gulf states monitor
export const ISO3_TO_ISO2: Record<string, string> = {
  UAE: 'ae', SAU: 'sa', QAT: 'qa', BHR: 'bh', KWT: 'kw',
  OMN: 'om', IRQ: 'iq', YEM: 'ye', LBN: 'lb', SYR: 'sy',
  JOR: 'jo', ISR: 'il', IRN: 'ir', USA: 'us', GBR: 'gb',
}

// Actor/faction name → ISO2 (for ops tracker, missile stats)
export const ACTOR_ISO: Record<string, string> = {
  USA:   'us', USAF: 'us', USN: 'us', USMC: 'us',
  IDF:   'il',
  IRGC:  'ir', Iran: 'ir', IRAN: 'ir',
  HEZ:   'lb', Hezbollah: 'lb', HEZBOLLAH: 'lb',
  Houthi: 'ye', HOUTHI: 'ye',
  UK:    'gb', RAF: 'gb',
  DIPLOMATIC: '',
}
