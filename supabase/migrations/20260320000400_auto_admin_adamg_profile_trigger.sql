-- Ensure admin.adamg@gmail.com always gets admin role, even if profile is created later.

create or replace function public.assign_admin_role_for_adamg()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) = lower('admin.adamg@gmail.com') then
    new.role := 'admin';
    new.plan := 'professional';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_admin_role_for_adamg on public.profiles;
create trigger trg_assign_admin_role_for_adamg
before insert or update of email
on public.profiles
for each row
execute function public.assign_admin_role_for_adamg();

-- Backfill: if auth user exists without profile row, create profile as admin.
insert into public.profiles (id, email, full_name, role, plan)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  'admin',
  'professional'
from auth.users u
where lower(u.email) = lower('admin.adamg@gmail.com')
  and not exists (
    select 1 from public.profiles p where p.id = u.id
  );

-- Ensure existing profile row is admin.
update public.profiles
set role = 'admin',
    plan = 'professional',
    updated_at = now()
where lower(email) = lower('admin.adamg@gmail.com');
