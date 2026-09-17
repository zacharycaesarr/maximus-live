-- Optional video progress ring on Overview (default off).
-- Paste into Supabase → SQL Editor → Run.

alter table public.client_metrics
  add column if not exists video_progress_visible boolean not null default false;

comment on column public.client_metrics.video_progress_visible is
  'When true, Overview video section shows a progress ring.';
