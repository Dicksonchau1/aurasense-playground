-- Supabase schema for AuraSense Playground

-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null check (role in ('admin', 'institution', 'demo', 'guest')),
  institution text,
  created_at timestamptz default now()
);

-- Sessions table
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  mode text not null check (mode in ('rehearse-nurse', 'attas', 'robotics')),
  started_at timestamptz default now(),
  ended_at timestamptz,
  status text not null check (status in ('active', 'completed', 'error'))
);

-- Audit events table
create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  timestamp timestamptz default now(),
  user_id uuid references users(id),
  details jsonb
);

-- Row Level Security (RLS) policies
alter table users enable row level security;
alter table sessions enable row level security;
alter table audit_events enable row level security;

-- Only allow users to see their own sessions and audit events
create policy "Users can view their own sessions" on sessions
  for select using (user_id = auth.uid());
create policy "Users can view their own audit events" on audit_events
  for select using (user_id = auth.uid());

-- Allow admins to view all
create policy "Admins can view all sessions" on sessions
  for select using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'));
create policy "Admins can view all audit events" on audit_events
  for select using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'));
