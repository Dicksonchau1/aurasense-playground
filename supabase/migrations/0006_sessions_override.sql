-- 0006_sessions_override.sql
-- Add instructor override fields to sessions table for audit/override flows

alter table public.sessions
  add column if not exists override_verdict text check (override_verdict in ('pass', 'hold', 'fail')),
  add column if not exists override_notes text;

-- Policy: Only session owner or admin can update override fields
-- (Assumes admin role is handled elsewhere)
