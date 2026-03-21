-- Fix 500 on profiles SELECT after admin policies: EXISTS(subquery on profiles)
-- inside profiles policies causes RLS infinite recursion in PostgreSQL.
-- Use SECURITY DEFINER helper so the role check bypasses RLS.

drop policy if exists "Admins can select all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select p.role = 'admin' from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

comment on function public.is_admin() is 'Whether auth.uid() has role admin; SECURITY DEFINER avoids profiles RLS recursion.';

grant execute on function public.is_admin() to authenticated;

create policy "Admins can select all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
