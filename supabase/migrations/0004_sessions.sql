-- 0004_sessions.sql
-- Rehearse session metrics. Schema chosen so the V1.5 nightly aggregator can
-- roll these into history_snapshots without changes.

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_sec integer not null default 0 check (duration_sec >= 0),
  created_at timestamptz not null default now()
);

create index sessions_user_started_idx on public.sessions(user_id, started_at desc);

alter table public.sessions enable row level security;

create policy "owner read sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "owner insert sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

create policy "owner update sessions"
  on public.sessions for update
  using (auth.uid() = user_id);

create policy "owner delete sessions"
  on public.sessions for delete
  using (auth.uid() = user_id);

create table public.session_metrics (
  session_id uuid primary key references public.sessions(id) on delete cascade,
  envelope int check (envelope between 0 and 100),
  consistency int check (consistency between 0 and 100),
  posture int check (posture between 0 and 100),
  gaze int check (gaze between 0 and 100),
  framing int check (framing between 0 and 100),
  pacing int check (pacing between 0 and 100),
  drift int,
  lane_breakdown jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.session_metrics enable row level security;

create policy "owner read session metrics"
  on public.session_metrics for select
  using (
    exists (select 1 from public.sessions s where s.id = session_metrics.session_id and s.user_id = auth.uid())
  );

create policy "owner insert session metrics"
  on public.session_metrics for insert
  with check (
    exists (select 1 from public.sessions s where s.id = session_metrics.session_id and s.user_id = auth.uid())
  );

create policy "owner update session metrics"
  on public.session_metrics for update
  using (
    exists (select 1 from public.sessions s where s.id = session_metrics.session_id and s.user_id = auth.uid())
  );
