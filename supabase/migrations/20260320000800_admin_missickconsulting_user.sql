-- Admin + professional for missickconsulting@gmail.com.
-- Creates auth user (email/password) + identity if not already present; ensures profile row matches.
--
-- SECURITY: Default password is for demo/setup only — rotate after first login.
-- Run in Supabase SQL Editor (or `supabase db push`) when ready.

create extension if not exists pgcrypto;

-- Keep existing behavior; add second privileged email.
create or replace function public.assign_admin_role_for_adamg()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) = lower('admin.adamg@gmail.com')
     or lower(new.email) = lower('missickconsulting@gmail.com') then
    new.role := 'admin';
    new.plan := 'professional';
  end if;
  return new;
end;
$$;

do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_encrypted_pw text := crypt('Demo123', gen_salt('bf'));
begin
  if exists (
    select 1 from auth.users where lower(email) = lower('missickconsulting@gmail.com')
  ) then
    return;
  end if;

  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) values (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'missickconsulting@gmail.com',
    v_encrypted_pw,
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Required for email login on current Supabase Auth.
  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    v_user_id,
    v_user_id,
    format('{"sub":"%s","email":"missickconsulting@gmail.com"}', v_user_id)::jsonb,
    'email',
    v_user_id::text,
    now(),
    now(),
    now()
  );
end;
$$;

-- Backfill profile if auth user existed without profile (or trigger order edge cases).
insert into public.profiles (id, email, full_name, role, plan)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  'admin',
  'professional'
from auth.users u
where lower(u.email) = lower('missickconsulting@gmail.com')
  and not exists (
    select 1 from public.profiles p where p.id = u.id
  );

update public.profiles
set role = 'admin',
    plan = 'professional',
    updated_at = now()
where lower(email) = lower('missickconsulting@gmail.com');
