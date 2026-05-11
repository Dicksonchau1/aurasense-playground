import { NextRequest, NextResponse } from 'next/server'
import { envelope, sha256 } from '@/lib/nepa'
import { inferFrameSafe, inferVideoSafe } from '@/lib/runtime'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = Number(process.env.NEPA_MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024)

/**
 * Visual-only view: returns detections from the perception runtime.
 * Replaces the pre-audit mock that always returned jitter() values
 * (AUDIT_2026_05.md §1).
 */
export async function POST(req: NextRequest) {
  const t = Date.now()
  let filename = 'unknown'
  let bytes = 0
  let mediaSha = ''
  let kind: 'image' | 'video' = 'video'
  let buf = Buffer.alloc(0)

  try {
    const form = await req.formData()
    const image = form.get('image') as File | null
    const video = form.get('video') as File | null
    const file = video ?? image
    if (file) {
      kind = video ? 'video' : 'image'
      filename = file.name
      buf = Buffer.from(await file.arrayBuffer())
      bytes = buf.length
      if (bytes > MAX_BYTES) {
        return NextResponse.json(
          { ok: false, error: 'payload_too_large', max_bytes: MAX_BYTES, bytes },
          { status: 413 },
        )
      }
      mediaSha = sha256(buf)
    }
  } catch { /* not multipart */ }

  const result = bytes === 0
    ? null
    : kind === 'video'
      ? await inferVideoSafe(buf, { filename })
      : await inferFrameSafe(buf, { source: 'visual-route', region: 'FULL' })

  return NextResponse.json(envelope({
    pipeline: 'visual',
    filename,
    bytes,
    media_kind: kind,
    media_sha256: mediaSha,
    detections: result?.detections ?? [],
    runtime: result?.runtime ?? 'none',
    note: 'No biometric / facial recognition performed.',
  }, t))
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    hint: 'POST multipart/form-data with field "image" or "video"',
    max_bytes: MAX_BYTES,
  })
}
