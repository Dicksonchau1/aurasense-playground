import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (code) {
    const sb = await createClient()
    await sb.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(new URL('/portal', req.url))
}
