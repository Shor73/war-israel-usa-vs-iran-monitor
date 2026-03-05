import { NextResponse } from 'next/server'
import { STRIKE_GROUPS, DAILY_STRIKES, INTERCEPTION_COSTS, MISSILE_ARCS } from '@/lib/missile-data'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'all'

  switch (type) {
    case 'groups':
      return NextResponse.json(STRIKE_GROUPS)
    case 'daily':
      return NextResponse.json(DAILY_STRIKES)
    case 'costs':
      return NextResponse.json(INTERCEPTION_COSTS)
    case 'arcs':
      return NextResponse.json(MISSILE_ARCS)
    default:
      return NextResponse.json({
        groups: STRIKE_GROUPS,
        daily: DAILY_STRIKES,
        costs: INTERCEPTION_COSTS,
        arcs: MISSILE_ARCS,
        summary: {
          totalLaunched: STRIKE_GROUPS.reduce((s, g) => s + g.totalLaunched, 0),
          totalIntercepted: STRIKE_GROUPS.reduce((s, g) => s + g.totalIntercepted, 0),
          totalHit: STRIKE_GROUPS.reduce((s, g) => s + g.totalHit, 0),
          daysOfConflict: Math.floor((Date.now() - new Date('2026-02-28').getTime()) / 86400000),
        }
      })
  }
}
