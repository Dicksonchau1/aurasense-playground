/**
 * Proxy: GET /api/v1/coach/health → NEPA coach_feedback service.
 * Useful for the beta smoke script and a future status-bar pill.
 */
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TIMEOUT_MS = 1500

export async function GET() {
  const base = process.env.NEPA_BASE_URL || 'http://localhost:8000'
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const r = await fetch(`${base}/api/v1/coach/health`, {
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
    return NextResponse.json({ ok: false, error: 'nepa_unavailable' }, { status: 503 })
  }
}
