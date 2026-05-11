/**
 * Proxy: GET /api/v1/tier/resolve?email=foo@bar.com → NEPA tier_policy.
 *
 * Used by the auth callback / login flow to preview the tier a user will
 * land on. Returns a structured 503 if NEPA is unavailable so the UI can
 * fall back to the local domain-router.
 */
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TIMEOUT_MS = 1500

export async function GET(req: NextRequest) {
  const base = process.env.NEPA_BASE_URL || 'http://localhost:8000'
  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ ok: false, error: 'email_required' }, { status: 400 })
  }
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const r = await fetch(`${base}/api/v1/tier/resolve`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: ctrl.signal,
      cache: 'no-store',
    })
    clearTimeout(t)
    const body = await r.text()
    return new NextResponse(body, {
      status: r.status,
      headers: { 'content-type': r.headers.get('content-type') ?? 'application/json' },
    })
  } catch {
    clearTimeout(t)
    return NextResponse.json(
      { ok: false, error: 'nepa_unavailable', tier: 'free' },
      { status: 503 }
    )
  }
}
