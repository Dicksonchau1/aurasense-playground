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
  } catch { /* not multipart */ }

  return NextResponse.json(envelope({
    pipeline: 'visual',
    filename,
    bytes,
    video_sha256: videoSha,
    detections: [
      { class: 'movement', score: jitter(0.7, 0.95), bbox: [120, 80, 320, 240] },
      { class: 'object',   score: jitter(0.6, 0.9),  bbox: [400, 100, 200, 180] },
    ],
    fps: jitter(28, 32),
    note: 'No biometric / facial recognition performed.',
  }, t))
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: 'POST multipart/form-data with field "video"' })
}
