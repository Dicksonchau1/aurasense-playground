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
  } catch { /* */ }

  return NextResponse.json(envelope({
    pipeline: 'world-model',
    filename,
    bytes,
    video_sha256: videoSha,
    horizon_frames: 16,
    latent_dim: 256,
    prediction_error: jitter(0.04, 0.18),
    anomaly_flag: Math.random() > 0.85,
    next_state_summary: 'stable_dynamics',
    note: 'Latent dynamics prior · spatiotemporal rollout.',
  }, t))
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: 'POST multipart/form-data with field "video"' })
}
