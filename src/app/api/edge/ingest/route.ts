import { NextRequest } from 'next/server'
import { edgeFetch } from '@/lib/edge-client'
import { relayJson, requireEdgeContext } from '../_helpers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Proxy POST /ingest/url on the edge service. */
export async function POST(req: NextRequest) {
  const auth = await requireEdgeContext()
  if (!auth.ok) return auth.res
  const body = await req.json().catch(() => ({}))
  const upstream = await edgeFetch({
    userId: auth.ctx.userId,
    plan: auth.ctx.plan,
    path: '/ingest/url',
    method: 'POST',
    body,
  })
  return relayJson(upstream)
}
