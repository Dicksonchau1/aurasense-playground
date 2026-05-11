import crypto from 'crypto'
import { admin } from './supabase/admin'

export function sha256(s: string | Buffer) {
  return crypto.createHash('sha256').update(s).digest('hex')
}

interface AuditInput {
  user_id: string
  pipeline: string
  source?: string
  region?: string
  image_sha256?: string
  image_path?: string
  bytes?: number
  detections?: any
  stdp?: any
  world_model?: any
  latency_ms?: number
}

/** Atomically fetch prev row_hash, compute new row_hash, insert. */
export async function appendAudit(row: AuditInput) {
  const sb = admin()
  const { data: prev } = await sb.from('nepa_audit')
    .select('row_hash')
    .eq('user_id', row.user_id)
    .order('created_at', { ascending: false })
    .limit(1).maybeSingle()
  const prev_hash = prev?.row_hash ?? 'GENESIS'
  const canonical = JSON.stringify({ ...row, prev_hash })
  const row_hash = sha256(canonical)
  const { data, error } = await sb.from('nepa_audit')
    .insert({ ...row, prev_hash, row_hash })
    .select().single()
  if (error) throw error
  return data
}
