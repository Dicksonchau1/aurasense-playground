import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseServiceClient } from '@/lib/supabase/service'
import { logger, getRequestId } from '@/lib/logger'

  const requestId = getRequestId(req)
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    logger.warn({ msg: 'session_post_unauthorized', requestId })
    return NextResponse.json({ error: 'Unauthorized', requestId }, { status: 401, headers: { 'x-request-id': requestId } })
  }

  const body = await req.json()
  const {
    lane = 'rehearse',
    envelope,
    consistency,
    lanes,
    snapshot_url,
    duration_sec = 0,
    override_verdict = null,
    override_notes = null,
  } = body

  const { data: session, error: sessionErr } = await sb
    .from('sessions')
    .insert({
      user_id: user.id,
      lane,
      snapshot_url: snapshot_url ?? null,
      duration_sec,
      ended_at: new Date().toISOString(),
      override_verdict,
      override_notes,
    })
    .select('id, override_verdict, override_notes')
    .single()

  if (sessionErr) {
    logger.error({ msg: 'session_post_error', error: sessionErr.message, requestId })
    return NextResponse.json({ error: sessionErr.message, requestId }, { status: 500, headers: { 'x-request-id': requestId } })
  }

  if (envelope !== undefined || consistency !== undefined || lanes) {
    await sb.from('session_metrics').insert({
      session_id: session.id,
      envelope: envelope ?? null,
      consistency: consistency ?? null,
      posture: lanes?.posture ?? null,
      gaze: lanes?.gaze ?? null,
      framing: lanes?.framing ?? null,
      pacing: lanes?.pacing ?? null,
      lane_breakdown: lanes ?? {},
    })
  }

  // --- Dual-write: NEPA audit chain (tamper-evident log) ---
  try {
    const svc = createSupabaseServiceClient()
    // Compute prev_hash (last audit row for user)
    const { data: lastAudit } = await svc
      .from('nepa_audit')
      .select('row_hash')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    const prev_hash = lastAudit?.row_hash || null
    // Minimal canonical row for audit chain
    const canonical = JSON.stringify({
      user_id: user.id,
      session_id: session.id,
      envelope,
      consistency,
      lanes,
      snapshot_url,
      duration_sec,
      ts: new Date().toISOString(),
    })
    // Compute row_hash (sha256 of prev_hash + canonical)
    const encoder = new TextEncoder()
    const data = encoder.encode((prev_hash || '') + canonical)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const row_hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
    await svc.from('nepa_audit').insert({
      user_id: user.id,
      pipeline: 'visual',
      source: 'rehearse',
      region: null,
      image_sha256: null,
      image_path: snapshot_url ?? null,
      bytes: 0,
      detections: [],
      stdp: {},
      world_model: {},
      latency_ms: null,
      prev_hash,
      row_hash,
    })
  } catch (e) {
    logger.error({ msg: 'nepa_audit_chain_write_failed', error: e, requestId })
  }

  // --- Instructor override/audit chain stub ---
  // TODO: Implement instructor override/hold and signed verdict chain

  logger.info({ msg: 'session_post_success', sessionId: session.id, userId: user.id, requestId })
  return NextResponse.json({ id: session.id, override_verdict: session.override_verdict, override_notes: session.override_notes, requestId }, { headers: { 'x-request-id': requestId } })
}

  const requestId = getRequestId(req)
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    logger.warn({ msg: 'session_get_missing_id', requestId })
    return NextResponse.json({ error: 'Missing id', requestId }, { status: 400, headers: { 'x-request-id': requestId } })
  }

  const sb = await createClient()
  const { data, error } = await sb
    .from('sessions')
    .select('*, session_metrics(*)')
    .eq('id', id)
    .single()

  if (error) {
    logger.error({ msg: 'session_get_error', error: error.message, requestId })
    return NextResponse.json({ error: error.message, requestId }, { status: 404, headers: { 'x-request-id': requestId } })
  }
  logger.info({ msg: 'session_get_success', sessionId: id, requestId })
  return NextResponse.json({ ...data, requestId }, { headers: { 'x-request-id': requestId } })
}

  const requestId = getRequestId(req)
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    logger.warn({ msg: 'session_delete_missing_id', requestId })
    return NextResponse.json({ error: 'Missing id', requestId }, { status: 400, headers: { 'x-request-id': requestId } })
  }

  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    logger.warn({ msg: 'session_delete_unauthorized', requestId })
    return NextResponse.json({ error: 'Unauthorized', requestId }, { status: 401, headers: { 'x-request-id': requestId } })
  }

  const { error } = await sb
    .from('sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    logger.error({ msg: 'session_delete_error', error: error.message, requestId })
    return NextResponse.json({ error: error.message, requestId }, { status: 500, headers: { 'x-request-id': requestId } })
  }
  logger.info({ msg: 'session_delete_success', sessionId: id, userId: user.id, requestId })
  return NextResponse.json({ ok: true, requestId }, { headers: { 'x-request-id': requestId } })
}
