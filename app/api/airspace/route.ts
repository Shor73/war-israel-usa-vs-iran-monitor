import { NextResponse } from 'next/server'
import { NOTAM_ENTRIES, AIRLINE_STATUS } from '@/lib/constants'

// Mock military flight data (would be OpenSky Network in production)
const MIL_FLIGHTS = [
  { callsign: 'DOOM21', type: 'B-52H', origin: 'Al Udeid AB, Qatar', status: 'AIRBORNE', mission: 'Strike', lat: 28.5, lng: 55.2 },
  { callsign: 'JAKE11', type: 'B-52H', origin: 'Al Udeid AB, Qatar', status: 'RTB', mission: 'Strike', lat: 30.2, lng: 52.1 },
  { callsign: 'COBRA31', type: 'RC-135W', origin: 'RAF Akrotiri, Cyprus', status: 'AIRBORNE', mission: 'SIGINT', lat: 34.5, lng: 38.8 },
  { callsign: 'SWIFT41', type: 'KC-135', origin: 'Al Dhafra AB, UAE', status: 'AIRBORNE', mission: 'Refueling', lat: 27.3, lng: 52.4 },
  { callsign: 'ATLAS21', type: 'C-17', origin: 'Dover AFB', status: 'AIRBORNE', mission: 'Airlift/Resupply', lat: 35.0, lng: 44.0 },
  { callsign: 'POSEIDON11', type: 'P-8A', origin: 'NSA Bahrain', status: 'AIRBORNE', mission: 'Maritime Patrol', lat: 25.8, lng: 54.2 },
]

export async function GET() {
  return NextResponse.json({
    notams: NOTAM_ENTRIES,
    airlines: AIRLINE_STATUS,
    milFlights: MIL_FLIGHTS,
    timestamp: new Date().toISOString(),
  })
}
