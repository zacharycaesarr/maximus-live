-- Phase 6: media tags + Supabase Storage bucket for portal files
-- Run in Supabase SQL Editor

alter table public.media_assets
  add column if not exists tag text not null default 'file';

alter table public.media_assets
  add column if not exists file_name text;

alter table public.media_assets
  add column if not exists storage_path text;

-- Backfill storage_path from file_url when empty
update public.media_assets
set storage_path = file_url
where storage_path is null and file_url is not null;

alter table public.info_history
  add column if not exists updated_at timestamptz not null default now();

-- Private bucket for client deliverables
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portal-assets',
  'portal-assets',
  false,
  104857600, -- 100 MB
  null
)
on conflict (id) do update
set public = false,
    file_size_limit = 104857600;

-- Storage policies (drop + recreate so re-runs are safe)
drop policy if exists "portal_assets_admin_insert" on storage.objects;
drop policy if exists "portal_assets_admin_update" on storage.objects;
drop policy if exists "portal_assets_admin_delete" on storage.objects;
drop policy if exists "portal_assets_select_own_or_admin" on storage.objects;

create policy "portal_assets_admin_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'portal-assets'
    and public.is_admin()
  );

create policy "portal_assets_admin_update"
  on storage.objects for update
  using (bucket_id = 'portal-assets' and public.is_admin())
  with check (bucket_id = 'portal-assets' and public.is_admin());

create policy "portal_assets_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'portal-assets' and public.is_admin());

-- Path layout: {client_uuid}/filename
create policy "portal_assets_select_own_or_admin"
  on storage.objects for select
  using (
    bucket_id = 'portal-assets'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );
