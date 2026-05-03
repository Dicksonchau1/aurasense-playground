-- 0001_profiles.sql
-- Per-user profile mirror of auth.users with public-safe columns.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  locale text default 'en-HK',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_created_idx on public.profiles(created_at desc);

alter table public.profiles enable row level security;

create policy "owner read profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "owner upsert profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "owner update profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
