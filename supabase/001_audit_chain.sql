-- NEPA audit chain: tamper-evident log of every inference call
create extension if not exists pgcrypto;

create table if not exists public.nepa_audit (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  pipeline        text not null,              -- visual | stdp | world-model | frame-multi
  source          text,                       -- hero | drone-UAV-001 | rehearse-warehouse
  region          text,                       -- NW | C | FULL ...
  image_sha256    text,
  image_path      text,                       -- storage path in nepa-frames bucket
  bytes           int default 0,
  detections      jsonb default '[]'::jsonb,
  stdp            jsonb default '{}'::jsonb,
  world_model     jsonb default '{}'::jsonb,
  latency_ms      int,
  prev_hash       text,
  row_hash        text not null,              -- sha256(prev_hash || canonical_row)
  created_at      timestamptz default now()
);

create index if not exists nepa_audit_user_created_idx
  on public.nepa_audit (user_id, created_at desc);

alter table public.nepa_audit enable row level security;

drop policy if exists "users read own audit" on public.nepa_audit;
create policy "users read own audit" on public.nepa_audit
  for select using (auth.uid() = user_id);

drop policy if exists "users insert own audit" on public.nepa_audit;
create policy "users insert own audit" on public.nepa_audit
  for insert with check (auth.uid() = user_id);

-- Storage bucket (run from dashboard or via storage API):
-- insert into storage.buckets (id, name, public) values ('nepa-frames', 'nepa-frames', false)
-- on conflict do nothing;
