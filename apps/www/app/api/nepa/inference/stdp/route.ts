import { NextRequest, NextResponse } from 'next/server'
import { envelope, sha256 } from '@/lib/nepa'
import { inferFrameSafe, inferVideoSafe } from '@/lib/runtime'
import { logger, getRequestId } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = Number(process.env.NEPA_MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024)

/**
 * STDP-only view of a media upload.
 *
 * Accepts either field "image" (single frame) or "video" (clip), runs the
 * configured perception runtime via `inferFrameSafe` / `inferVideoSafe`, and
 * returns just the STDP slice of the result. The previous version of this
 * route returned pure jitter() noise even when a real runtime was wired —
 * see AUDIT_2026_05.md §1.
 */
  const t = Date.now()
  const requestId = getRequestId(req)
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
        logger.warn({ msg: 'stdp_payload_too_large', filename, bytes, requestId })
        return NextResponse.json(
          { ok: false, error: 'payload_too_large', max_bytes: MAX_BYTES, bytes, requestId },
          { status: 413, headers: { 'x-request-id': requestId } },
        )
      }
      mediaSha = sha256(buf)
    }
  } catch (e) {
    logger.error({ msg: 'stdp_form_error', error: (e as Error).message, requestId })
  }

  const result = bytes === 0
    ? null
    : kind === 'image'
      ? await inferFrameSafe(buf, { source: 'stdp-route', region: 'FULL' })
      : await inferVideoSafe(buf, { filename })

  logger.info({ msg: 'stdp_post', filename, bytes, kind, requestId })
  return NextResponse.json(envelope({
    pipeline: 'stdp',
    filename,
    bytes,
    media_kind: kind,
    media_sha256: mediaSha,
    stdp: result?.stdp ?? null,
    runtime: result?.runtime ?? 'none',
    note: 'Online STDP weight updates · no backprop · no labels.',
    requestId,
  }, t), { headers: { 'x-request-id': requestId } })
}

  logger.info({ msg: 'stdp_get', requestId: undefined })
  return NextResponse.json({
    ok: true,
    hint: 'POST multipart/form-data with field "image" or "video"',
    max_bytes: MAX_BYTES,
    requestId: undefined,
  }, { headers: { 'x-request-id': undefined } })
}
