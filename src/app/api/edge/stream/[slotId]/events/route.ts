import { NextRequest } from 'next/server'
import { edgeFetch } from '@/lib/edge-client'
import { requireEdgeContext } from '../../../_helpers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Proxy GET /stream/{slot_id}/events. Streams the SSE body straight through
 * so the browser sees a normal text/event-stream response.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await ctx.params
  const auth = await requireEdgeContext()
  if (!auth.ok) return auth.res

  const upstream = await edgeFetch({
    userId: auth.ctx.userId,
    plan: auth.ctx.plan,
    path: `/stream/${encodeURIComponent(slotId)}/events`,
    method: 'GET',
    ttlSeconds: 1800,
    headers: { accept: 'text/event-stream' },
    signal: req.signal,
  })

  if (!upstream.body) {
    const text = await upstream.text().catch(() => '')
    return new Response(text || 'no upstream stream', { status: upstream.status || 502 })
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'text/event-stream',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  })
}
