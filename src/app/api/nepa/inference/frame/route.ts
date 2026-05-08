import { NextRequest, NextResponse } from 'next/server'
import { envelope, sha256 } from '@/lib/nepa'
import { decideGate } from '@/lib/nepa/gating'
import { inferFrameSafe } from '@/lib/runtime'
import { publish } from '@/lib/runtime/anomaly-bus'
import { checkQuota, recordUsage } from '@/lib/billing/quota'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HAS_SUPABASE = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function POST(req: NextRequest) {
  const t = Date.now()
  let userId: string | undefined

  if (HAS_SUPABASE) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const sb = await createClient()
      const { data } = await sb.auth.getUser()
      userId = data?.user?.id
    } catch { /* anon */ }
  }

  // Pre-flight quota check (1 frame, bytes unknown yet → estimate 0)
  const q = await checkQuota(userId, 1, 0)
  if (!q.allowed) {
    return NextResponse.json({
      ok: false, error: 'quota_exceeded', reason: q.reason, plan: q.plan,
      used: q.used, limits: q.limits,
      upgrade_url: '/portal?upgrade=1',
    }, { status: 429 })
  }

  let buf = Buffer.alloc(0), bytes = 0, imgSha = '', source = 'unknown', region = 'FULL', imagePath: string | undefined

  try {
    const form = await req.formData()
    const file = form.get('image') as File | null
    source = (form.get('source') as string) ?? source
    region = (form.get('region') as string) ?? region
    if (file) {
      buf = Buffer.from(await file.arrayBuffer())
      bytes = buf.length
      imgSha = sha256(buf)

      if (HAS_SUPABASE && userId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const { admin } = await import('@/lib/supabase/admin')
          const path = `${userId}/${Date.now()}_${imgSha.slice(0, 12)}.jpg`
          const { error } = await admin().storage.from('nepa-frames')                                                                                                         .upload(path, buf, { contentType: 'image/jpeg', upsert: false })
          if (!error) imagePath = path
        } catch { /* skip storage */ }
      }
    }
  } catch { /* */ }

  // Real runtime (with mock fallback)
  const result = await inferFrameSafe(buf, { source, region, userId })
  const gate = decideGate(result)

  const data = {
    pipeline: 'frame-multi' as const,
    source, region, bytes,
    image_sha256: imgSha,
    image_path: imagePath,
    detections:  result.detections,
    stdp:        result.stdp,
    world_model: result.world_model,
    runtime:     result.runtime,
    gate,
    note: 'No biometric / facial recognition.',
  }

  // Audit chain
  let audit_row: any = null
  if (HAS_SUPABASE && userId) {
    try {
      const { appendAudit } = await import('@/lib/audit-chain')
      audit_row = await appendAudit({
        user_id: userId, pipeline: data.pipeline, source, region,
        image_sha256: imgSha, image_path: imagePath, bytes,
        detections: data.detections, stdp: data.stdp, world_model: data.world_model,
        latency_ms: Date.now() - t,
      })
    } catch (e) { console.error('[audit] append failed', (e as Error).message) }
  }

  // Record usage AFTER successful inference
  if (userId) await recordUsage(userId, 1, bytes, 0)

  // Live-publish anomaly: either world-model anomaly_flag OR a hard gate decision
  if (data.world_model.anomaly_flag || gate.state === 'interrupt_for_safety') {
    publish(userId ?? 'anon-local', {
      id: 'anom_' + crypto.randomBytes(4).toString('hex'),
      kind: gate.state === 'interrupt_for_safety' ? 'gate_interrupt' : 'prediction_error_spike',
      score: gate.top_detection_score,
      region, source, ts_ms: Date.now(),
      pred_err: data.world_model.prediction_error,
    })
  }

  return NextResponse.json({
    ...envelope(data, t),
    plan: q.plan,
    quota: { used: { ...q.used, frames: q.used.frames + 1 }, limits: q.limits, remaining_frames: q.remaining_frames === -1 ? -1 : q.remaining_frames - 1 },
    audit_row_hash: audit_row?.row_hash ?? null,
    persisted: !!audit_row,
    authenticated: !!userId,
    supabase_configured: HAS_SUPABASE,
  })
}
