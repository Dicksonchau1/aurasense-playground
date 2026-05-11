/**
 * Server-side edge service client.
 * Mints short-lived HS256 JWTs and proxies requests to the AuraSense edge GPU
 * service. Never import this file from client components.
 */
import { SignJWT } from 'jose'
import type { PlanKey } from '@/lib/billing/plans'

// ---------- types -----------------------------------------------------------

export interface EdgeSlot {
  slot_id: string
  url?: string
}

export interface EdgeStats {
  slot_id: string
  ts: number
  p50_ms: Record<string, number>
  p95_ms: Record<string, number>
  raw_bitrate_kbps: number
  out_bitrate_kbps: number
  fps: number
}

// ---------- plan mapping ----------------------------------------------------

type EdgePlan = 'free' | 'rehearse_pro' | 'enterprise'

function toEdgePlan(plan: PlanKey | string | null | undefined): EdgePlan {
  if (plan === 'pro' || plan === 'team') return 'rehearse_pro'
  if (plan === 'enterprise') return 'enterprise'
  return 'free'
}

// ---------- helpers ---------------------------------------------------------

function edgeBase(): string {
  const base = process.env.EDGE_BASE_URL
  if (!base) throw new Error('EDGE_BASE_URL not configured')
  return base.replace(/\/$/, '')
}

async function mintToken(userId: string, edgePlan: EdgePlan): Promise<string> {
  const secret = process.env.EDGE_SIGNING_SECRET
  if (!secret) throw new Error('EDGE_SIGNING_SECRET not configured')
  return new SignJWT({ user_id: userId, plan: edgePlan })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(new TextEncoder().encode(secret))
}

async function edgeHeaders(userId: string, plan: PlanKey | string | null | undefined) {
  const token = await mintToken(userId, toEdgePlan(plan))
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

// ---------- public API ------------------------------------------------------

export async function edgeIngestUrl(
  userId: string,
  plan: PlanKey | string | null | undefined,
  url: string,
  opts?: { width?: number; height?: number; target_fps?: number },
): Promise<EdgeSlot> {
  const headers = await edgeHeaders(userId, plan)
  const res = await fetch(`${edgeBase()}/ingest/url`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      url,
      width: opts?.width ?? 1280,
      height: opts?.height ?? 720,
      target_fps: opts?.target_fps ?? 15,
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    const err = Object.assign(new Error(`edge /ingest/url → ${res.status}`), {
      status: res.status,
      detail,
    })
    throw err
  }
  return res.json()
}

export async function edgeStats(
  userId: string,
  plan: PlanKey | string | null | undefined,
  slotId: string,
): Promise<EdgeStats> {
  const headers = await edgeHeaders(userId, plan)
  const res = await fetch(`${edgeBase()}/stats/${slotId}`, { headers })
  if (!res.ok) throw new Error(`edge /stats/${slotId} → ${res.status}`)
  return res.json()
}

export async function edgeClose(
  userId: string,
  plan: PlanKey | string | null | undefined,
  slotId: string,
): Promise<void> {
  const headers = await edgeHeaders(userId, plan)
  await fetch(`${edgeBase()}/stream/${slotId}/close`, { method: 'POST', headers })
}

export async function edgeControl(
  userId: string,
  plan: PlanKey | string | null | undefined,
  slotId: string,
  patch: { chain?: string[]; zones?: unknown[] },
): Promise<void> {
  const headers = await edgeHeaders(userId, plan)
  await fetch(`${edgeBase()}/stream/${slotId}/control`, {
    method: 'POST',
    headers,
    body: JSON.stringify(patch),
  })
}
