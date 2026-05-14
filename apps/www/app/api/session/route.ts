import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseServiceClient } from '@/lib/supabase/service'

export async function POST(req: NextRequest) {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    lane = 'rehearse',
    envelope,
    consistency,
    lanes,
    snapshot_url,
    duration_sec = 0,
  } = body

  const { data: session, error: sessionErr } = await sb
    .from('sessions')
    .insert({
      user_id: user.id,
      lane,
      snapshot_url: snapshot_url ?? null,
      duration_sec,
      ended_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (sessionErr) return NextResponse.json({ error: sessionErr.message }, { status: 500 })

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
    // Log but do not block session save on audit chain failure
    console.error('NEPA audit chain write failed', e)
  }

  // --- Instructor override/audit chain stub ---
  // TODO: Implement instructor override/hold and signed verdict chain

  return NextResponse.json({ id: session.id })
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const sb = await createClient()
  const { data, error } = await sb
    .from('sessions')
    .select('*, session_metrics(*)')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await sb
    .from('sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
