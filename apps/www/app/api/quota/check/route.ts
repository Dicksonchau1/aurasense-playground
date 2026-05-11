import { NextRequest, NextResponse } from 'next/server'
import { checkQuota } from '@/lib/billing/quota'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HAS_SUPABASE = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function GET(req: NextRequest) {
  let userId: string | undefined
  if (HAS_SUPABASE) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const sb = await createClient()
      const { data } = await sb.auth.getUser()
      userId = data?.user?.id
    } catch {}
  }
  const q = await checkQuota(userId, 0, 0)
  return NextResponse.json({ ok: true, authenticated: !!userId, ...q })
}
