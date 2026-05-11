import { admin } from '@/lib/supabase/admin'
import { QUOTAS, planForUser, type PlanKey } from './plans'

export interface QuotaCheck {
  allowed: boolean
  reason?: 'daily_frame_cap' | 'daily_byte_cap' | 'plan_inactive'
  plan: PlanKey
  used:    { frames: number; videos: number; bytes: number }
  limits:  { frames_per_day: number; videos_per_day: number; bytes_per_day: number }
  remaining_frames: number
}

const HAS_SUPABASE = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function getUserPlan(userId: string): Promise<PlanKey> {
  if (!HAS_SUPABASE) return 'starter'
  const { data } = await admin().from('user_plans').select('plan,status').eq('user_id', userId).maybeSingle()
  if (!data) return 'starter'
  if (data.status === 'canceled' || data.status === 'past_due') return 'starter'
  return planForUser(data.plan)
}

export async function getTodayUsage(userId: string) {
  if (!HAS_SUPABASE) return { frames: 0, videos: 0, bytes: 0 }
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await admin().from('usage_daily')
    .select('frames,videos,bytes')
    .eq('user_id', userId).eq('day', today).maybeSingle()
  return data ?? { frames: 0, videos: 0, bytes: 0 }
}

export async function checkQuota(userId: string | undefined, costFrames = 1, costBytes = 0): Promise<QuotaCheck> {
  // Anonymous users get a tiny shared bucket — basically a teaser.
  if (!userId) {
    return {
      allowed: true, plan: 'starter',
      used: { frames: 0, videos: 0, bytes: 0 },
      limits: { frames_per_day: 50, videos_per_day: 0, bytes_per_day: 50 * 1024 * 1024 },
      remaining_frames: 50,
    }
  }
  const plan  = await getUserPlan(userId)
  const q     = QUOTAS[plan]
  const used  = await getTodayUsage(userId)

  const frameCap = q.frames_per_day
  const byteCap  = q.bytes_per_day
  const remaining = frameCap === -1 ? Infinity : Math.max(0, frameCap - used.frames)

  let allowed = true
  let reason: QuotaCheck['reason']
  if (frameCap !== -1 && used.frames + costFrames > frameCap) { allowed = false; reason = 'daily_frame_cap' }
  if (byteCap  !== -1 && used.bytes  + costBytes  > byteCap)  { allowed = false; reason = 'daily_byte_cap' }

  return {
    allowed, reason, plan, used,
    limits: { frames_per_day: q.frames_per_day, videos_per_day: q.videos_per_day, bytes_per_day: q.bytes_per_day },
    remaining_frames: remaining === Infinity ? -1 : remaining,
  }
}

export async function recordUsage(userId: string, frames = 1, bytes = 0, videos = 0) {
  if (!HAS_SUPABASE) return
  await admin().rpc('increment_usage', {
    p_user_id: userId, p_frames: frames, p_videos: videos, p_bytes: bytes,
  })
}
