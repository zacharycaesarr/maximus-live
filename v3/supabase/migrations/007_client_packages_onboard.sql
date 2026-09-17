-- Phase: client packages + billing cycle for Overview tab
-- Paste into Supabase → SQL Editor → Run if not applied yet.

alter table public.client_metrics
  add column if not exists packages text[] not null default '{}';

alter table public.client_metrics
  add column if not exists cycle_start date;

alter table public.client_metrics
  add column if not exists cycle_end date;

alter table public.client_metrics
  add column if not exists web_phase int not null default 1;

alter table public.client_metrics
  add column if not exists web_launch_date date;

alter table public.client_metrics
  add column if not exists package_order text[] not null default '{}';

-- Keep web_phase in 1..4 (safe re-run)
do $$
begin
  alter table public.client_metrics
    drop constraint if exists client_metrics_web_phase_check;
  alter table public.client_metrics
    add constraint client_metrics_web_phase_check
    check (web_phase >= 1 and web_phase <= 4);
exception
  when others then
    raise notice 'web_phase check note: %', SQLERRM;
end $$;

-- Optional: constrain package array values (skip if already present)
comment on column public.client_metrics.packages is
  'ads | website | video. Empty = fall back to service_focus.';
comment on column public.client_metrics.package_order is
  'Display order for Overview sections. Empty = packages order.';

-- service_focus stays for backwards compat; app derives it when packages are set.
