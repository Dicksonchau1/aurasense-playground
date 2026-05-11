import { createClient } from '@supabase/supabase-js'
// Service-role client — server-only, bypasses RLS for storage uploads + chain hashing.
export function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
