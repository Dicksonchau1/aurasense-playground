import { NextResponse } from 'next/server'
import { pickRuntime } from '@/lib/runtime'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET() {
  const rt = pickRuntime()
  let h: any = { ok: false }
  try { h = await rt.health() } catch (e) { h = { ok: false, error: (e as Error).message } }
  return NextResponse.json({
    ok: true, ts: new Date().toISOString(),
    runtime: { adapter: rt.name, mode: process.env.NEPA_RUNTIME_MODE ?? 'mock',
               http_url: process.env.NEPA_RUNTIME_URL ?? null, health: h },
    supabase: { configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                service_role_configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
    stripe:   { configured: !!process.env.STRIPE_SECRET_KEY,
                webhook_configured: !!process.env.STRIPE_WEBHOOK_SECRET },
    privacy:  { biometrics: 'never', facial_recognition: 'never', audit_chain: 'sha256-prev-linked' },
  })
}
