import { NextRequest } from 'next/server'
import { edgeFetch } from '@/lib/edge-client'
import { relayJson, requireEdgeContext } from '../../../_helpers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await ctx.params
  const auth = await requireEdgeContext()
  if (!auth.ok) return auth.res
  const upstream = await edgeFetch({
    userId: auth.ctx.userId,
    plan: auth.ctx.plan,
    path: `/stream/${encodeURIComponent(slotId)}/close`,
    method: 'POST',
  })
  return relayJson(upstream)
}
