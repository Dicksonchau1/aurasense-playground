import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { edgeClose } from '@/lib/edge'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slotId: string }> },
) {
  const { slotId } = await params
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { data: sub } = await sb
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle()
  const plan = (sub?.plan as string) ?? 'starter'

  try {
    await edgeClose(user.id, plan, slotId)
  } catch {
    // Best-effort — still mark ended in DB
  }

  await sb
    .from('streams')
    .update({ status: 'ended', ended_at: new Date().toISOString() })
    .eq('edge_session_id', slotId)
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
