-- 0006_profiles_onboarded.sql
-- Add onboarded_at to profiles for /welcome-screen gating in the
-- v0.10.0-beta user-journey rewrite. Idempotent — re-runnable.

alter table public.profiles
  add column if not exists onboarded_at timestamptz;

create index if not exists profiles_onboarded_pending_idx
  on public.profiles(id)
  where onboarded_at is null;
