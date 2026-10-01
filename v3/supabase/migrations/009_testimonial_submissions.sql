-- Public testimonial submissions (web-dev page form)
-- Run in Supabase SQL Editor when ready.

create table if not exists public.testimonial_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  quote text not null,
  email text,
  source_page text not null default 'web-development',
  status text not null default 'pending' check (status in ('pending', 'approved', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_testimonial_submissions_status
  on public.testimonial_submissions (status, created_at desc);

alter table public.testimonial_submissions enable row level security;

-- Anyone can submit (anon + authenticated)
drop policy if exists "testimonials_insert_public" on public.testimonial_submissions;
create policy "testimonials_insert_public"
  on public.testimonial_submissions for insert
  to anon, authenticated
  with check (true);

-- Only admins can read / update
drop policy if exists "testimonials_select_admin" on public.testimonial_submissions;
create policy "testimonials_select_admin"
  on public.testimonial_submissions for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "testimonials_update_admin" on public.testimonial_submissions;
create policy "testimonials_update_admin"
  on public.testimonial_submissions for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
