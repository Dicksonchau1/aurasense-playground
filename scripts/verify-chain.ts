/**
 * Walk the user's audit chain end-to-end and verify every row_hash.
 * Run: pnpm tsx scripts/verify-chain.ts <user_id>
 */
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)
const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex')

async function main() {
  const userId = process.argv[2]
  if (!userId) { console.error('usage: tsx scripts/verify-chain.ts <user_id>'); process.exit(1) }

  const { data: rows, error } = await sb.from('nepa_audit')
    .select('*').eq('user_id', userId).order('created_at', { ascending: true })
  if (error) throw error
  if (!rows?.length) { console.log('Empty chain.'); return }

  let prev_hash = 'GENESIS'
  let ok = 0, bad = 0
  for (const r of rows) {
    const { row_hash, prev_hash: storedPrev, created_at, ...rest } = r as any
    const canonical = JSON.stringify({
      user_id: rest.user_id, pipeline: rest.pipeline, source: rest.source, region: rest.region,
      image_sha256: rest.image_sha256, image_path: rest.image_path, bytes: rest.bytes,
      detections: rest.detections, stdp: rest.stdp, world_model: rest.world_model,
      latency_ms: rest.latency_ms, prev_hash,
    })
    const recomputed = sha256(canonical)
    const valid = recomputed === row_hash && storedPrev === prev_hash
    console.log(valid ? '✅' : '❌', r.id, r.pipeline, r.source, r.region, '·', row_hash.slice(0, 16))
    if (valid) ok++; else bad++
    prev_hash = row_hash
  }
  console.log(`\nChain integrity: ${ok} valid · ${bad} tampered · total ${rows.length}`)
  process.exit(bad ? 2 : 0)
}
main().catch(e => { console.error(e); process.exit(1) })
