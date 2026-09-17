-- Phase 10: link portal clients to Meta/Google ad accounts + sync metadata
-- Paste into Supabase → SQL Editor → Run

create table if not exists public.client_ad_accounts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  platform text not null default 'meta' check (platform in ('meta', 'google')),
  account_id text not null,
  label text,
  sync_enabled boolean not null default true,
  last_synced_at timestamptz,
  last_sync_error text,
  created_at timestamptz not null default now(),
  unique (client_id, platform)
);

create index if not exists idx_client_ad_accounts_client
  on public.client_ad_accounts (client_id);

alter table public.client_metrics
  add column if not exists metrics_source text not null default 'manual';

alter table public.client_metrics
  add column if not exists meta_synced_at timestamptz;

alter table public.client_ad_accounts enable row level security;

drop policy if exists "ad_accounts_admin_all" on public.client_ad_accounts;
create policy "ad_accounts_admin_all"
  on public.client_ad_accounts for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Clients can see whether ads are connected (no secrets here)
drop policy if exists "ad_accounts_select_own" on public.client_ad_accounts;
create policy "ad_accounts_select_own"
  on public.client_ad_accounts for select
  using (client_id = auth.uid());
