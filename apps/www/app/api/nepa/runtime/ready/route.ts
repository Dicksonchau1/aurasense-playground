import { NextResponse } from 'next/server'
import { pickRuntime } from '@/lib/runtime'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const rt = pickRuntime()
  try {
    // Perform a real dependency check, e.g., call health() or DB ping
    const h = await rt.health()
    if (!h.ok) throw new Error('Dependency not ready')
    return NextResponse.json({ ok: true, adapter: rt.name })
  } catch (e) {
    return NextResponse.json({ ok: false, adapter: rt.name, error: (e as Error).message }, { status: 503 })
  }
}
