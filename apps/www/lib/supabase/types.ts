// Hand-maintained Supabase types until `supabase gen types typescript` runs in CI.
// Mirrors migrations 0001..0004. Keep this file in sync with supabase/migrations/.

export type Json = string | number | boolean | null | { [k: string]: Json } | Json[]

export type PlanTier = 'free' | 'rehearse_pro' | 'enterprise'

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'
  | 'paused'

export type StreamKind = 'webcam' | 'rtsp' | 'srt' | 'demo'
export type StreamStatus = 'pending' | 'active' | 'ended' | 'errored'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          locale: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      subscriptions: {
        Row: {
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: PlanTier
          status: SubscriptionStatus
          trial_end: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['subscriptions']['Row']> & { user_id: string }
        Update: Partial<Database['public']['Tables']['subscriptions']['Row']>
      }
      streams: {
        Row: {
          id: string
          user_id: string
          kind: StreamKind
          source_url: string | null
          edge_session_id: string | null
          status: StreamStatus
          metadata: Json
          started_at: string
          ended_at: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['streams']['Row']> & {
          user_id: string
          kind: StreamKind
        }
        Update: Partial<Database['public']['Tables']['streams']['Row']>
      }
      stream_events: {
        Row: {
          id: string
          stream_id: string
          type: string
          payload: Json
          thumbnail_path: string | null
          occurred_at: string
        }
        Insert: Partial<Database['public']['Tables']['stream_events']['Row']> & {
          stream_id: string
          type: string
        }
        Update: Partial<Database['public']['Tables']['stream_events']['Row']>
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          started_at: string
          ended_at: string | null
          duration_sec: number
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['sessions']['Row']> & { user_id: string }
        Update: Partial<Database['public']['Tables']['sessions']['Row']>
      }
      session_metrics: {
        Row: {
          session_id: string
          envelope: number | null
          consistency: number | null
          posture: number | null
          gaze: number | null
          framing: number | null
          pacing: number | null
          drift: number | null
          lane_breakdown: Json
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['session_metrics']['Row']> & {
          session_id: string
        }
        Update: Partial<Database['public']['Tables']['session_metrics']['Row']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      plan_tier: PlanTier
      subscription_status: SubscriptionStatus
      stream_kind: StreamKind
      stream_status: StreamStatus
    }
  }
}
