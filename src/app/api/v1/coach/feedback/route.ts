/**
 * Proxy: POST /api/v1/coach/feedback → NEPA coach_feedback service.
 *
 * On any failure (network, timeout, non-2xx, missing backend) returns a
 * structured 503 so the AuraCoach client can render its templated
 * fallback without spamming the console.
 */
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TIMEOUT_MS = 1500

export async function POST(req: NextRequest) {
  const base = process.env.NEPA_BASE_URL || 'http://localhost:8000'
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const body = await req.text()
    const r = await fetch(`${base}/api/v1/coach/feedback`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      signal: ctrl.signal,
      cache: 'no-store',
    })
    clearTimeout(t)
    const out = await r.text()
    return new NextResponse(out, {
      status: r.status,
      headers: { 'content-type': r.headers.get('content-type') ?? 'application/json' },
    })
  } catch {
    clearTimeout(t)
    return NextResponse.json({ ok: false, error: 'nepa_unavailable' }, { status: 503 })
  }
}
