# Supabase setup (Auth + profiles)

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 2. Environment variables

In the app root (and in Vercel for production), set:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

See `env.example` for a template.

## 3. Run the migration (profiles table)

1. In Supabase Dashboard, open **SQL Editor**.
2. Copy the contents of `supabase/migrations/20250204000000_profiles.sql`.
3. Run the script. This creates:
   - `public.profiles` (id, email, full_name, role, plan, region, trial_used_at, stripe_customer_id, …)
   - RLS so users can only read/update their own row
   - A trigger that creates a profile row when a new user signs up (from Auth)

## 4. Auth settings (optional)

- **Authentication → Providers → Email**: ensure **Email** is enabled.
- To allow sign-up without email confirmation (user is signed in immediately), in **Authentication → Providers → Email** you can disable **Confirm email**. Otherwise, after sign-up users must click the confirmation link before signing in.

## 5. Making a user an admin

By default new users get `role = 'user'`. To make someone an admin, run in SQL Editor:

```sql
update public.profiles set role = 'admin' where email = 'their@email.com';
```

## 6. Security

- Passwords are hashed and stored by Supabase Auth (never stored in your app or `profiles`).
- Duplicate emails are rejected at sign-up by Supabase (unique constraint on `auth.users.email`).
- Row Level Security (RLS) on `profiles` ensures users only access their own row.
