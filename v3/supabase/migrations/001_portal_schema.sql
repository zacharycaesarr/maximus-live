-- Maximus Reach portal schema (Phase 1)
-- Paste into Supabase Dashboard → SQL Editor → Run

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'client' check (role in ('client', 'admin')),
  full_name text,
  company_name text,
  last_login_at timestamptz,
  last_action text,
  last_action_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Per-client growth numbers (admin editable)
create table if not exists public.client_metrics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  ad_spend numeric(12, 2) not null default 0,
  leads_generated integer not null default 0,
  cost_per_lead numeric(12, 2) not null default 0,
  pipeline_value numeric(12, 2) not null default 0,
  spend_breakdown jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (client_id)
);

-- Media vault files
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  file_url text not null,
  status text not null default 'ready',
  created_at timestamptz not null default now()
);

-- Saved info / history for a client
create table if not exists public.info_history (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);

-- Activity log (tab views, downloads, etc.)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  action_type text not null,
  route text,
  created_at timestamptz not null default now()
);

create index if not exists idx_client_metrics_client on public.client_metrics (client_id);
create index if not exists idx_media_assets_client on public.media_assets (client_id);
create index if not exists idx_info_history_client on public.info_history (client_id);
create index if not exists idx_audit_logs_client on public.audit_logs (client_id);
create index if not exists idx_audit_logs_created on public.audit_logs (created_at desc);

-- Auto profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.client_metrics enable row level security;
alter table public.media_assets enable row level security;
alter table public.info_history enable row level security;
alter table public.audit_logs enable row level security;

-- Helper: is current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- profiles policies
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin"
  on public.profiles for insert
  with check (public.is_admin() or id = auth.uid());

-- client_metrics
drop policy if exists "metrics_select_own_or_admin" on public.client_metrics;
create policy "metrics_select_own_or_admin"
  on public.client_metrics for select
  using (client_id = auth.uid() or public.is_admin());

drop policy if exists "metrics_write_admin" on public.client_metrics;
create policy "metrics_write_admin"
  on public.client_metrics for all
  using (public.is_admin())
  with check (public.is_admin());

-- media_assets
drop policy if exists "media_select_own_or_admin" on public.media_assets;
create policy "media_select_own_or_admin"
  on public.media_assets for select
  using (client_id = auth.uid() or public.is_admin());

drop policy if exists "media_write_admin" on public.media_assets;
create policy "media_write_admin"
  on public.media_assets for all
  using (public.is_admin())
  with check (public.is_admin());

-- info_history
drop policy if exists "info_select_own_or_admin" on public.info_history;
create policy "info_select_own_or_admin"
  on public.info_history for select
  using (client_id = auth.uid() or public.is_admin());

drop policy if exists "info_write_admin" on public.info_history;
create policy "info_write_admin"
  on public.info_history for all
  using (public.is_admin())
  with check (public.is_admin());

-- audit_logs: clients insert own; both read own (admin reads all)
drop policy if exists "audit_select_own_or_admin" on public.audit_logs;
create policy "audit_select_own_or_admin"
  on public.audit_logs for select
  using (client_id = auth.uid() or public.is_admin());

drop policy if exists "audit_insert_own" on public.audit_logs;
create policy "audit_insert_own"
  on public.audit_logs for insert
  with check (client_id = auth.uid() or public.is_admin());

-- Realtime for live dashboard updates (Phase 5 will subscribe).
-- If this errors with "already member of publication", you can ignore it.
do $$
begin
  alter publication supabase_realtime add table public.client_metrics;
exception
  when duplicate_object then null;
  when others then
    raise notice 'Realtime publication note: %', SQLERRM;
end $$;
