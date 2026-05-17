import { NextResponse } from 'next/server'
import { envelope, jitter } from '@/lib/nepa'
import { logger, getRequestId } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

  const t = Date.now()
  // For static GET, simulate requestId as undefined
  logger.info({ msg: 'nepa_status_get', requestId: undefined })
  return NextResponse.json(
    envelope({
      runtime: 'NEPA',
      version: '0.4.1',
      uptime_s: Math.floor(process.uptime()),
      modules: {
        world_model: { status: 'online', latency_ms: jitter(6, 12) },
        stdp:        { status: 'online', latency_ms: jitter(2, 5)  },
        voda:        { status: 'online', queue: 0 },
        coda:        { status: 'online', queue: 0 },
      },
      region: 'hk-kln-1',
      requestId: undefined,
    }, t),
    { headers: { 'x-request-id': undefined } }
  )
}
