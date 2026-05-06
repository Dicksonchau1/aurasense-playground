import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { edgeStats } from '@/lib/edge'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
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
    const stats = await edgeStats(user.id, plan, slotId)
    return NextResponse.json(stats)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 })
  }
}
