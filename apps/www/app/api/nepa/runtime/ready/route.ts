import { NextResponse } from 'next/server'
import { pickRuntime } from '@/lib/runtime'
import { logger, getRequestId } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

  const requestId = undefined // No req in GET signature, so undefined
  const rt = pickRuntime()
  try {
    // Perform a real dependency check, e.g., call health() or DB ping
    const h = await rt.health()
    if (!h.ok) throw new Error('Dependency not ready')
    logger.info({ msg: 'runtime_ready_get', adapter: rt.name, ok: true, requestId })
    return NextResponse.json({ ok: true, adapter: rt.name, requestId }, { headers: { 'x-request-id': requestId } })
  } catch (e) {
    logger.error({ msg: 'runtime_ready_error', adapter: rt.name, error: (e as Error).message, requestId })
    return NextResponse.json({ ok: false, adapter: rt.name, error: (e as Error).message, requestId }, { status: 503, headers: { 'x-request-id': requestId } })
  }
}
