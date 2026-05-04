import { NextResponse } from 'next/server'
import { envelope } from '@/lib/nepa'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const t = Date.now()
  return NextResponse.json(envelope({
    units: [
      { id: 'UAV-001', model: 'AuraWing-X1', status: 'in_mission', battery: 78, region: 'hk-kln-1' },
      { id: 'UAV-002', model: 'AuraWing-X1', status: 'in_mission', battery: 64, region: 'hk-kln-1' },
      { id: 'UAV-003', model: 'AuraWing-X2', status: 'alert',      battery: 41, region: 'hk-kln-1' },
      { id: 'UAV-004', model: 'AuraWing-X2', status: 'idle',       battery: 96, region: 'hk-kln-1' },
    ],
  }, t))
}
