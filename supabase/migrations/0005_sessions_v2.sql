-- 0005_sessions_v2.sql
-- Extend sessions table with V0.5 fields: lane, snapshot_url, public flag.
-- Also adds a public-read policy for shareable sessions.

alter table public.sessions
  add column if not exists lane text check (lane in ('rehearse', 'drone')),
  add column if not exists snapshot_url text,
  add column if not exists public boolean not null default true;

-- Public read policy: anyone can view sessions marked public = true
drop policy if exists "public read sessions" on public.sessions;
create policy "public read sessions"
  on public.sessions for select
  using (public = true or auth.uid() = user_id);
