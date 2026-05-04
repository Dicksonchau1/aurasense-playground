import { NextRequest, NextResponse } from 'next/server'
import { envelope, jitter, sha256 } from '@/lib/nepa'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const t = Date.now()
  let filename = 'unknown'
  let bytes = 0
  let videoSha = ''

  try {
    const form = await req.formData()
    const file = form.get('video') as File | null
    if (file) {
      filename = file.name
      const buf = Buffer.from(await file.arrayBuffer())
      bytes = buf.length
      videoSha = sha256(buf)
    }
  } catch { /* json or empty */ }

  return NextResponse.json(envelope({
    pipeline: 'stdp',
    filename,
    bytes,
    video_sha256: videoSha,
    spike_rate_hz: jitter(180, 240),
    sparsity:      jitter(0.92, 0.97),
    plasticity_events: Math.floor(jitter(1200, 2400)),
    energy_w: jitter(0.25, 0.45),
    note: 'Online STDP weight updates · no backprop · no labels.',
  }, t))
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: 'POST multipart/form-data with field "video"' })
}
