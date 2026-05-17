import { NextResponse } from 'next/server'
import { pickRuntime } from '@/lib/runtime'
import { logger, getRequestId } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

  const requestId = undefined // No req in GET signature, so undefined
  const rt = pickRuntime()
  try {
    const h = await rt.health()
    logger.info({ msg: 'runtime_health_get', adapter: rt.name, ok: h.ok, requestId })
    return NextResponse.json({ adapter: rt.name, ...h, requestId }, { headers: { 'x-request-id': requestId } })
  } catch (e) {
    logger.error({ msg: 'runtime_health_error', adapter: rt.name, error: (e as Error).message, requestId })
    return NextResponse.json({ adapter: rt.name, ok: false, error: (e as Error).message, requestId }, { status: 503, headers: { 'x-request-id': requestId } })
  }
}
