/**
 * Proxy: POST /api/v1/coach/voice → NEPA ElevenLabs proxy.
 * Streams the upstream `audio/mpeg` body. Returns 501 / 503 when the
 * upstream voice path is disabled / unavailable.
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
    const r = await fetch(`${base}/api/v1/coach/voice`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      signal: ctrl.signal,
      cache: 'no-store',
    })
    clearTimeout(t)
    if (!r.ok || !r.body) {
      const txt = await r.text().catch(() => '')
      return new NextResponse(txt || JSON.stringify({ ok: false, error: 'voice_unavailable' }), {
        status: r.status || 501,
        headers: { 'content-type': r.headers.get('content-type') ?? 'application/json' },
      })
    }
    return new NextResponse(r.body, {
      status: 200,
      headers: { 'content-type': r.headers.get('content-type') ?? 'audio/mpeg' },
    })
  } catch {
    clearTimeout(t)
    return NextResponse.json({ ok: false, error: 'nepa_unavailable' }, { status: 503 })
  }
}
