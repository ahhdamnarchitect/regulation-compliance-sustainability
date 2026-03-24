# Next Steps

## Now
- **If not already applied in Supabase:** run migrations in order **`20260320000500`** → **`20260320000600`** (profiles admin RLS without recursion; fixes login **500** / profile fetch) → **`20260320000700`** (`customer_inquiries`: `general` + `category` for Contact + admin).
- Smoke-test **`/contact`**, **`/regulation-help`**, **`/admin`** (Regulations / Customer inquiries / Users): confirm filters, sort, and inquiry status updates work against live DB.
- Set up operational triage for `customer_inquiries` (owner, SLA, resolution workflow) — product/ops, not only engineering.
- Align remaining deployment docs to **Vercel** as canonical target; retire or archive GitHub Pages workflow when safe.
- Run baseline validation locally (`npm run build`, `npm run lint`) and record results in this repo or CI.
- Remove or gate production auth debug logging (`AUTH_DEBUG`) when stable.

## Done / shipped (reference)
- `/pricing` route + footer link; **Free + Professional** positioning (no Enterprise tier on page).
- Homepage/search **Questions or Suggestions?** + Regulation Help copy; free-tier visibility rules unchanged.
- **`/admin`**: filterable + sortable tables for Regulations, Customer inquiries, Users (`src/pages/Admin.tsx`).
- Optional **`20260320000800_admin_missickconsulting_user.sql`** for seeded admin (apply manually if used).

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
