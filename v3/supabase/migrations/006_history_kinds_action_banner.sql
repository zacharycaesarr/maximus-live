-- History entry kinds + action-required banner fields
-- Run in Supabase SQL Editor

alter table public.info_history
  add column if not exists entry_kind text not null default 'note'
  check (entry_kind in ('note', 'work'));

create index if not exists idx_info_history_kind
  on public.info_history (client_id, entry_kind, created_at desc);

alter table public.client_metrics
  add column if not exists action_required boolean not null default false;

alter table public.client_metrics
  add column if not exists action_required_text text not null default '';
