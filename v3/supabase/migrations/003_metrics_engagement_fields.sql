-- Phase 5: richer per-client dashboard fields (ads + website + video jobs)
-- Paste into Supabase SQL Editor if you have not run this yet.

alter table public.client_metrics
  add column if not exists service_focus text not null default 'mixed'
    check (service_focus in ('ads', 'website', 'video', 'mixed'));

alter table public.client_metrics
  add column if not exists status_headline text not null default '';

alter table public.client_metrics
  add column if not exists progress_pct numeric(5, 2) not null default 0;

alter table public.client_metrics
  add column if not exists dashboard_blurb text not null default '';

-- Make sure live updates are on (safe if already added)
do $$
begin
  alter publication supabase_realtime add table public.client_metrics;
exception
  when duplicate_object then null;
  when others then
    raise notice 'Realtime publication note: %', SQLERRM;
end $$;
