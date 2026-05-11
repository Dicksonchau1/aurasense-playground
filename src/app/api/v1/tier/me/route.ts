/**
 * Proxy: GET /api/v1/tier/me → NEPA tier_policy service.
 * Forwards cookies; returns 503 graceful fallback on failure.
 */
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TIMEOUT_MS = 1500

export async function GET(req: NextRequest) {
  const base = process.env.NEPA_BASE_URL || 'http://localhost:8000'
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const r = await fetch(`${base}/api/v1/tier/me`, {
      method: 'GET',
      headers: { cookie: req.headers.get('cookie') ?? '' },
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
