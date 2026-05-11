import { NextRequest } from 'next/server'
import { edgeFetch } from '@/lib/edge-client'
import { relayJson, requireEdgeContext } from '../../../_helpers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await ctx.params
  const auth = await requireEdgeContext()
  if (!auth.ok) return auth.res
  const body = await req.json().catch(() => ({}))
  const upstream = await edgeFetch({
    userId: auth.ctx.userId,
    plan: auth.ctx.plan,
    path: `/stream/${encodeURIComponent(slotId)}/control`,
    method: 'POST',
    body,
  })
  return relayJson(upstream)
}
