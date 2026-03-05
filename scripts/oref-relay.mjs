/**
 * OREF Israeli IP Relay Server
 * Run this on your Israeli home machine — it proxies OREF requests with your IP.
 *
 * Usage:
 *   node scripts/oref-relay.mjs
 *   # In another terminal:
 *   npx localtunnel --port 3003
 *   # Copy the tunnel URL (e.g. https://abc123.loca.lt)
 *   # On the server, set OREF_RELAY_URL and restart:
 *   echo "OREF_RELAY_URL=https://abc123.loca.lt" >> /root/warops-dashboard/.env.local
 *   pm2 restart warops-dashboard --update-env
 */

import { createServer } from 'http'
import { get as httpsGet } from 'https'

const PORT = 3003

const OREF_LIVE_URL     = 'https://www.oref.org.il/WarningMessages/alert/alerts.json'
const OREF_HISTORY_URL  = 'https://www.oref.org.il/Shared/Ajax/GetAlertsHistory.aspx?lang=en&fromDate={DATE}&toDate={DATE}&area=0'
const OREF_HISTORY_ALT  = 'https://alerts-history.oref.org.il/Shared/Ajax/GetAlarmsHistory.aspx?lang=en&fromDate={DATE}&toDate={DATE}&area=0'

const OREF_HEADERS = {
  'Referer': 'https://www.oref.org.il/',
  'X-Requested-With': 'XMLHttpRequest',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8',
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-cache, no-store')
}

function proxyGet(url, res) {
  const req = httpsGet(url, { headers: OREF_HEADERS }, (upstream) => {
    let body = ''
    upstream.on('data', chunk => { body += chunk })
    upstream.on('end', () => {
      cors(res)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(body || '[]')
      const preview = body.slice(0, 120).replace(/\n/g, ' ')
      console.log(`[${new Date().toISOString()}] OK  ${url.split('?')[0].split('/').pop()} → ${upstream.statusCode} — ${preview}`)
    })
  })
  req.setTimeout(8000, () => {
    req.destroy()
    if (res.headersSent) return
    cors(res)
    res.writeHead(504, { 'Content-Type': 'application/json' })
    res.end('{"error":"upstream timeout"}')
    console.warn(`[${new Date().toISOString()}] TIMEOUT ${url}`)
  })
  req.on('error', (err) => {
    if (res.headersSent) return
    cors(res)
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
    console.error(`[${new Date().toISOString()}] ERR ${url} — ${err.message}`)
  })
}

function todayStr() {
  // Returns dd-MM-yyyy for OREF API
  return new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
}

const server = createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    cors(res)
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url === '/live') {
    proxyGet(OREF_LIVE_URL, res)
  } else if (req.url === '/history') {
    const date = todayStr()
    proxyGet(OREF_HISTORY_URL.replace(/{DATE}/g, date), res)
  } else if (req.url === '/history-alt') {
    const date = todayStr()
    proxyGet(OREF_HISTORY_ALT.replace(/{DATE}/g, date), res)
  } else if (req.url === '/ping') {
    cors(res)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, ts: Date.now(), msg: 'OREF relay online' }))
  } else {
    cors(res)
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end('{"error":"not found — use /live /history /ping"}')
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log('')
  console.log('  OREF Relay Server — running on port ' + PORT)
  console.log('  Endpoints: /live  /history  /ping')
  console.log('')
  console.log('  Step 1 — expose publicly (pick one):')
  console.log('    npx localtunnel --port ' + PORT)
  console.log('    npx ngrok http ' + PORT)
  console.log('')
  console.log('  Step 2 — on the Hetzner server, set env var and restart:')
  console.log('    echo "OREF_RELAY_URL=https://YOUR-TUNNEL-URL" >> /root/warops-dashboard/.env.local')
  console.log('    pm2 restart warops-dashboard --update-env')
  console.log('')
})
