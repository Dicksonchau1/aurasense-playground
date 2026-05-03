-- 0003_streams.sql
-- Drone playground stream lifecycle. Edge VM writes events back via service role.

create type public.stream_kind as enum ('webcam', 'rtsp', 'srt', 'demo');
create type public.stream_status as enum ('pending', 'active', 'ended', 'errored');

create table public.streams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind public.stream_kind not null,
  source_url text,
  edge_session_id text,
  status public.stream_status not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create index streams_user_idx on public.streams(user_id, started_at desc);
create index streams_status_idx on public.streams(status) where status = 'active';

alter table public.streams enable row level security;

create policy "owner read streams"
  on public.streams for select
  using (auth.uid() = user_id);

create policy "owner insert streams"
  on public.streams for insert
  with check (auth.uid() = user_id);

create policy "owner update streams"
  on public.streams for update
  using (auth.uid() = user_id);

create table public.stream_events (
  id uuid primary key default gen_random_uuid(),
  stream_id uuid not null references public.streams(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  thumbnail_path text,
  occurred_at timestamptz not null default now()
);

create index stream_events_stream_idx on public.stream_events(stream_id, occurred_at desc);
create index stream_events_type_idx on public.stream_events(type);

alter table public.stream_events enable row level security;

create policy "owner read stream events"
  on public.stream_events for select
  using (
    exists (
      select 1 from public.streams s
      where s.id = stream_events.stream_id and s.user_id = auth.uid()
    )
  );

-- Inserts come from the edge VM via service role; no user-facing insert policy.
