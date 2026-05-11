import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
