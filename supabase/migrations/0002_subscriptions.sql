-- 0002_subscriptions.sql
-- Stripe-synced subscription state. Owned by the user; webhooks write via service role.

create type public.plan_tier as enum ('free', 'rehearse_pro', 'enterprise');
create type public.subscription_status as enum (
  'trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused'
);

create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan public.plan_tier not null default 'free',
  status public.subscription_status not null default 'active',
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_customer_idx on public.subscriptions(stripe_customer_id);
create index subscriptions_subscription_idx on public.subscriptions(stripe_subscription_id);

alter table public.subscriptions enable row level security;

create policy "owner read subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- No insert/update/delete policies: only the service-role Stripe webhook may write.
