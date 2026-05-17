import { NextRequest } from 'next/server'
import { logger, getRequestId } from '@/lib/logger'
import { pickRuntime } from '@/lib/runtime'
import { subscribe, ensureUpstream } from '@/lib/runtime/anomaly-bus'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function getUserIdSafe(req: NextRequest): Promise<string> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const sb = await createClient()
      const { data } = await sb.auth.getUser()
      if (data?.user?.id) return data.user.id
    } catch (e) {
      console.warn('[anomalies/live] supabase unavailable, anon mode:', (e as Error).message)
    }
  }
  return 'anon-' + (req.headers.get('x-forwarded-for') ?? 'local')
}

  const requestId = getRequestId(req)
  const userId = await getUserIdSafe(req)
  const rt = pickRuntime()
  ensureUpstream(userId, rt)

  logger.info({ msg: 'anomalies_live_stream', userId, runtime: rt.name, requestId })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: any) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify({ ...data, requestId })}\n\n`))

      send('hello', { userId, runtime: rt.name, ts: Date.now() })
      const unsub = subscribe(userId, (a) => send('anomaly', a))

      const hb = setInterval(() => {
        try { controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`)) } catch {}
      }, 25_000)

      const abort = () => { clearInterval(hb); unsub(); try { controller.close() } catch {} }
      req.signal.addEventListener('abort', abort)
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      'connection': 'keep-alive',
      'x-accel-buffering': 'no',
      'x-request-id': requestId,
    },
  })
}
