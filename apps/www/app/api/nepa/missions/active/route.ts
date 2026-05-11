import { NextResponse } from 'next/server'
import { envelope } from '@/lib/nepa'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const t = Date.now()
  return NextResponse.json(envelope({
    in_flight: [
      { id: 'm-2041', name: 'Perimeter Sweep · Kwun Tong', uav: 'UAV-001', eta_s: 412 },
      { id: 'm-2042', name: 'Rooftop Inspection · ICC',    uav: 'UAV-002', eta_s: 188 },
    ],
    queued: [
      { id: 'm-2043', name: 'Night Patrol · Kowloon Bay', uav: 'UAV-004', scheduled: '2026-05-04T01:30:00+08:00' },
    ],
  }, t))
}
