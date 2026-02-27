create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  password_hash text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists app_users_username_unique_idx
  on public.app_users (lower(username));

create table if not exists public.user_progress (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  mastered_vocab_ids jsonb not null default '[]'::jsonb,
  favorite_vocab_ids jsonb not null default '[]'::jsonb,
  mastered_grammar_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.app_users enable row level security;
alter table public.user_progress enable row level security;

drop policy if exists app_users_service_role_all on public.app_users;
create policy app_users_service_role_all
  on public.app_users
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists user_progress_service_role_all on public.user_progress;
create policy user_progress_service_role_all
  on public.user_progress
  for all
  to service_role
  using (true)
  with check (true);
