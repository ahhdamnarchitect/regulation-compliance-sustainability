# Next Steps

## Now
- **Critical (login):** Run migration `20260320000600_profiles_admin_policies_fix_recursion.sql` in Supabase if profile fetch returns **500** after the admin profile policies (fixes RLS recursion).
- Smoke-test **`/contact`** (FAQ + general form) and **`/regulation-help`** (two regulation forms); apply migration `20260320000700_customer_inquiries_general.sql` for `inquiry_type=general` + `category` column.
- Regulation detail question panel + **Questions or Suggestions?** on home/search (hidden for free-tier logged-in users).
- Apply migration `20260320000500_profiles_admin_read_update_policies.sql` in Supabase if the Admin **Users** tab cannot load profiles (006 replaces the policy *definitions* from 005—run 005 first if missing, then 006).
- Set up operational triage process for `customer_inquiries` (owner, SLA, and resolution status updates).
- Verify admin triage view can read/update inquiry status end-to-end.
- Confirm final admin profile state in Supabase for `admin.adamg@gmail.com` (`role = 'admin'`, `plan = 'professional'`).
- Align all deployment docs/workflows to Vercel as canonical target.
- Run baseline validation (`npm run build`, `npm run lint`) and record results.
- Remove/disable production auth debug logs if no longer needed.

## Next
- Optionally add email notifications when new `customer_inquiries` rows are inserted.
- Align README and deployment docs with actual production architecture.
- Add API endpoint verification checklist (checkout, webhook signature, cancel flow).
- Add environment variable matrix for local/dev/prod.

## Later
- Introduce automated tests for critical auth/payment flows.
- Add data ingestion/update workflow documentation for regulation content.
- Add observability standards (structured logs + error tracking).

## Blocked
- Payment operations checklist is blocked until Stripe env + webhook endpoint ownership is confirmed.

## Improvements
- Add `brain/risks.md` for operational and security risk tracking.
- Add CI checks for lint/build on PR.
- Add release/handoff template under `cursor-os/`.
