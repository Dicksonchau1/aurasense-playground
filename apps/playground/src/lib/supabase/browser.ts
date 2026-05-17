'use client'

import { createBrowserClient } from '@supabase/ssr'

import type { Database } from './types'

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

/**
 * Browser-side Supabase client (singleton). Reads the public URL and anon key
 * from NEXT_PUBLIC_* env vars. RLS is enforced via the user's session.
 */
export function getSupabaseBrowserClient() {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  client = createBrowserClient<Database>(url, anon)
  return client
}
