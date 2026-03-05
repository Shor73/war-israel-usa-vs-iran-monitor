import { NextResponse } from 'next/server'
import { DEFENSE_STOCKS } from '@/lib/constants'
import type { StockQuote } from '@/lib/types'

let cache: { data: StockQuote[]; ts: number } | null = null
const TTL = 5 * 60 * 1000

// Post-war simulated defense sector surge (28 Feb 2026)
const STOCK_BASELINES: Record<string, { price: number; change: number }> = {
  RTX:  { price: 138.45, change: 11.8 },
  LMT:  { price: 562.10, change: 14.2 },
  NOC:  { price: 498.75, change: 10.9 },
  GD:   { price: 298.30, change: 8.4 },
  BA:   { price: 182.55, change: 9.1 },
  LHX:  { price: 236.80, change: 7.6 },
  ESLT: { price: 318.20, change: 22.4 }, // Israeli defense — biggest gainer
  XOM:  { price: 124.90, change: 6.8 },
  CVX:  { price: 178.35, change: 7.2 },
  COP:  { price: 138.60, change: 8.9 },
}

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data)
  }

  const data: StockQuote[] = DEFENSE_STOCKS.map(s => {
    const base = STOCK_BASELINES[s.symbol] || { price: 100, change: 5 }
    const variation = (Math.random() - 0.5) * 2
    return {
      symbol: s.symbol,
      name: s.name,
      price: base.price + variation,
      change: variation,
      changePercent: base.change + (Math.random() - 0.5) * 0.3,
      sector: s.sector,
    }
  })

  cache = { data, ts: Date.now() }
  return NextResponse.json(data)
}
