// Next.js 16 renamed `middleware.ts` → `proxy.ts`. This file refreshes the
// Supabase auth session for protected paths and lets unauthenticated
// requests fall through (route handlers/pages still enforce 401 themselves).
//
// See AUDIT_2026_05.md §14.
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return NextResponse.next()

  const response = NextResponse.next({ request })
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(list) {
        list.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  // Touch the session so cookies refresh; ignore the result.
  try { await supabase.auth.getUser() } catch { /* no-op */ }

  return response
}

export const config = {
  matcher: [
    '/portal/:path*',
    '/account/:path*',
    '/api/billing/:path*',
    '/api/edge/:path*',
  ],
}
