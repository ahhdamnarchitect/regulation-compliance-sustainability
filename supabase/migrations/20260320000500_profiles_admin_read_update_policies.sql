-- Allow admins to list and update profiles for support (plan/role adjustments).
-- Uses EXISTS on profiles so only users with role = 'admin' on their own row qualify.

create policy "Admins can select all profiles"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles ad
      where ad.id = auth.uid()
        and ad.role = 'admin'
    )
  );

create policy "Admins can update all profiles"
  on public.profiles
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles ad
      where ad.id = auth.uid()
        and ad.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles ad
      where ad.id = auth.uid()
        and ad.role = 'admin'
    )
  );
