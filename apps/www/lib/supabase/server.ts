import { getSupabaseClient } from '../supabase';
export async function createClient() {
  return getSupabaseClient();
}
