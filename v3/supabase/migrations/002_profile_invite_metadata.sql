-- Optional tweak: store company_name from invite metadata (safe to re-run)

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, company_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'company_name', '')
  )
  on conflict (id) do update
    set
      full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
      company_name = coalesce(nullif(excluded.company_name, ''), public.profiles.company_name);
  return new;
end;
$$;
