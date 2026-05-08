/** Create the private nepa-frames bucket. Run once: pnpm tsx scripts/init-storage.ts */
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

async function main() {
  const { data: existing } = await sb.storage.getBucket('nepa-frames')
  if (existing) { console.log('✅ nepa-frames bucket already exists'); return }
  const { error } = await sb.storage.createBucket('nepa-frames', {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  })
  if (error) throw error
  console.log('✅ Created private bucket: nepa-frames')
}
main().catch(e => { console.error(e); process.exit(1) })
