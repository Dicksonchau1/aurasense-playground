-- ── User plans + Stripe linkage ─────────────────────────────────────────────
create table if not exists public.user_plans (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  plan                 text not null default 'starter'
                       check (plan in ('starter','pro','team','enterprise')),
  status               text not null default 'active'
                       check (status in ('active','past_due','canceled','trialing','incomplete')),
  stripe_customer_id   text unique,
  stripe_subscription_id text unique,
  stripe_price_id      text,
  current_period_end   timestamptz,
  cancel_at_period_end boolean default false,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

create index if not exists user_plans_customer_idx on public.user_plans (stripe_customer_id);
create index if not exists user_plans_subscription_idx on public.user_plans (stripe_subscription_id);

alter table public.user_plans enable row level security;

drop policy if exists "users read own plan" on public.user_plans;
create policy "users read own plan" on public.user_plans
  for select using (auth.uid() = user_id);

-- Service role bypasses RLS for webhook upserts.

-- ── Daily usage counters (UTC day buckets) ──────────────────────────────────
create table if not exists public.usage_daily (
  user_id    uuid not null references auth.users(id) on delete cascade,
  day        date not null default (now() at time zone 'utc')::date,
  frames     int  not null default 0,
  videos     int  not null default 0,
  bytes      bigint not null default 0,
  updated_at timestamptz default now(),
  primary key (user_id, day)
);

create index if not exists usage_daily_user_day_idx on public.usage_daily (user_id, day desc);
alter table public.usage_daily enable row level security;

drop policy if exists "users read own usage" on public.usage_daily;
create policy "users read own usage" on public.usage_daily
  for select using (auth.uid() = user_id);

-- Atomic increment RPC (called from API route via service role)
create or replace function public.increment_usage(
  p_user_id uuid, p_frames int default 0, p_videos int default 0, p_bytes bigint default 0
) returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into usage_daily (user_id, day, frames, videos, bytes)
  values (p_user_id, (now() at time zone 'utc')::date, p_frames, p_videos, p_bytes)
  on conflict (user_id, day) do update
    set frames     = usage_daily.frames + excluded.frames,
        videos     = usage_daily.videos + excluded.videos,
        bytes      = usage_daily.bytes  + excluded.bytes,
        updated_at = now();
end $$;

grant execute on function public.increment_usage(uuid,int,int,bigint) to service_role;

-- ── Team workspaces (Team plan only) ────────────────────────────────────────
create table if not exists public.workspaces (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  owner_id    uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null default 'analyst' check (role in ('owner','analyst','viewer')),
  invited_at   timestamptz default now(),
  primary key (workspace_id, user_id)
);

alter table public.workspaces        enable row level security;
alter table public.workspace_members enable row level security;

drop policy if exists "members read workspace" on public.workspaces;
create policy "members read workspace" on public.workspaces
  for select using (
    exists (select 1 from workspace_members m where m.workspace_id = workspaces.id and m.user_id = auth.uid())
  );

drop policy if exists "members read membership" on public.workspace_members;
create policy "members read membership" on public.workspace_members
  for select using (
    user_id = auth.uid()
    or exists (select 1 from workspace_members m2 where m2.workspace_id = workspace_members.workspace_id and m2.user_id = auth.uid())
  );

drop policy if exists "owners insert members" on public.workspace_members;
create policy "owners insert members" on public.workspace_members
  for insert with check (
    exists (select 1 from workspaces w where w.id = workspace_id and w.owner_id = auth.uid())
  );
