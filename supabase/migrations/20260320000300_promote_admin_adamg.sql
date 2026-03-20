-- Promote a specific user to admin role.
-- Safe to run repeatedly.
update public.profiles
set role = 'admin',
    updated_at = now()
where lower(email) = lower('admin.adamg@gmail.com');
