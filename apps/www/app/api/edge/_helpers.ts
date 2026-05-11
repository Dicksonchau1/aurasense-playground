import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { admin } from '@/lib/supabase/admin'
import { planForUser, type PlanKey } from '@/lib/billing/plans'

export interface EdgeContext {
  userId: string
  plan: PlanKey
}

export async function requireEdgeContext(): Promise<
  { ok: true; ctx: EdgeContext } | { ok: false; res: NextResponse }
> {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    return {
      ok: false,
      res: NextResponse.json({ ok: false, error: 'unauthenticated' }, { status: 401 }),
    }
  }
  const { data: row } = await admin()
    .from('user_plans')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle()
  return {
    ok: true,
    ctx: { userId: user.id, plan: planForUser(row?.plan) },
  }
}

export async function relayJson(upstream: Response): Promise<NextResponse> {
  const contentType = upstream.headers.get('content-type') || 'application/json'
  const text = await upstream.text()
  return new NextResponse(text, {
    status: upstream.status,
    headers: { 'content-type': contentType },
  })
}
