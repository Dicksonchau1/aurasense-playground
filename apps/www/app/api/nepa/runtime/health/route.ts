import { NextResponse } from 'next/server'
import { pickRuntime } from '@/lib/runtime'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const rt = pickRuntime()
  try {
    const h = await rt.health()
    return NextResponse.json({ adapter: rt.name, ...h })
  } catch (e) {
    return NextResponse.json({ adapter: rt.name, ok: false, error: (e as Error).message }, { status: 503 })
  }
}
