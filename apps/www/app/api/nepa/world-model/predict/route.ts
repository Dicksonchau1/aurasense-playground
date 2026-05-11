import { NextRequest, NextResponse } from 'next/server'
import { envelope, sha256 } from '@/lib/nepa'
import { decideGate } from '@/lib/nepa/gating'
import { inferFrameSafe, inferVideoSafe } from '@/lib/runtime'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = Number(process.env.NEPA_MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024)

/**
 * World-model prediction view. Returns the world_model slice plus the gate
 * decision so callers can act without re-running the gating layer.
 * Replaces the pre-audit jitter() mock (AUDIT_2026_05.md §1).
 */
export async function POST(req: NextRequest) {
  const t = Date.now()
  let filename = 'unknown'
  let bytes = 0
  let mediaSha = ''
  let kind: 'image' | 'video' = 'image'
  let buf = Buffer.alloc(0)

  try {
    const form = await req.formData()
    const image = form.get('image') as File | null
    const video = form.get('video') as File | null
    const file = image ?? video
    if (file) {
      kind = image ? 'image' : 'video'
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
  } catch { /* */ }

  const result = bytes === 0
    ? null
    : kind === 'image'
      ? await inferFrameSafe(buf, { source: 'world-model-route', region: 'FULL' })
      : await inferVideoSafe(buf, { filename })

  const gate = result ? decideGate(result) : null

  return NextResponse.json(envelope({
    pipeline: 'world-model',
    filename,
    bytes,
    media_kind: kind,
    media_sha256: mediaSha,
    world_model: result?.world_model ?? null,
    gate,
    runtime: result?.runtime ?? 'none',
    note: 'Latent dynamics prior · spatiotemporal rollout.',
  }, t))
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    hint: 'POST multipart/form-data with field "image" or "video"',
    max_bytes: MAX_BYTES,
  })
}
