import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { edgeIngestUrl } from '@/lib/edge'
import { QUOTAS, planForUser } from '@/lib/billing/plans'
import { admin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  // Resolve current plan from subscriptions table
  const { data: sub } = await sb
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle()
  let plan = (sub?.plan as string) ?? 'starter'
  const { data: row } = await admin()
    .from('user_plans')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle()
  plan = planForUser(row?.plan)
  const quota = QUOTAS[plan]
  if (!quota.features.rtsp_ingest) {
    return NextResponse.json(
      { error: 'rtsp_ingest is a paid feature', upgrade: '/pricing' },
      { status: 402 },
    )
  }

  const body = await req.json().catch(() => null)
  const url: string | undefined = body?.url
  if (!url || !/^(rtsp|srt|rtsps|rtmp):/.test(url)) {
    return NextResponse.json({ error: 'url must be a valid RTSP/SRT/RTMP URI' }, { status: 400 })
  }

  let slot
  try {
    slot = await edgeIngestUrl(user.id, plan, url, {
      width: body?.width,
      height: body?.height,
      target_fps: body?.target_fps,
    })
  } catch (e: any) {
    const status = e.status === 402 ? 402 : e.status === 429 ? 429 : 502
    return NextResponse.json({ error: e.message, detail: e.detail }, { status })
  }

  // Log stream to Supabase for account history
  await sb.from('streams').insert({
    user_id: user.id,
    kind: 'rtsp',
    source_url: url,
    edge_session_id: slot.slot_id,
    status: 'active',
    metadata: { plan, target_fps: body?.target_fps ?? 15 },
  })
  // Best-effort log to streams table; ignored if table is missing.
  try {
    await admin().from('streams').insert({
      user_id: user.id,
      kind: 'rtsp',
      source_url: url,
      edge_session_id: slot.slot_id,
      status: 'active',
      metadata: { plan, target_fps: body?.target_fps ?? 15 },
    })
  } catch {}

  return NextResponse.json({ slot_id: slot.slot_id })
}
