# Current State

## Current Objective
Stabilize and operationalize the regulation platform so auth, payments, deployment, and data workflows are consistent and maintainable.

## What Exists
- React/Vite SPA with routing and core pages (index, search, detail, dashboard, admin, checkout).
- Supabase auth context with profile and bookmarks support.
- Stripe checkout + webhook endpoints connected to profile plan updates.
- Supabase migrations for profile and bookmark persistence.
- Active deployment on Vercel; legacy GitHub Pages workflow still present in repo.
- Map section visual adjustment completed: border is now thinner/even on desktop+mobile with water-tone background alignment.
- Customer inquiries: forms live on **`/contact`** (not inline on homepage). Homepage and search results include a **Questions or Suggestions?** section linking there. Regulation detail pages include a bottom **question panel** with the current regulation pre-filled.
- Inquiry forms use **database-backed autocomplete** (regulation titles and country/jurisdiction values from loaded regulations).
- Form submissions persist to Supabase `customer_inquiries` (migrations under `supabase/migrations/`).
- **Admin** (`/admin`): tabs for **Regulations**, **Customer inquiries**, and **Users** (masked email, plan/role support); link back to homepage. Admin profile list/update requires migration `20260320000500_profiles_admin_read_update_policies.sql`.
- Map section: reduced decorative borders; Leaflet focus outline cleared; optional full-width map on desktop.

## In Progress
- Assumption: design refresh and product positioning improvements (based on design research docs and theme assets).
- TODO: clean up or retire legacy GitHub Pages deployment artifacts.
- Supabase migrations for `customer_inquiries` and admin policies were applied (user confirmed).
- TODO: define internal review workflow/owner for handling `customer_inquiries` submissions.

## Known Issues
- Documentation drift: some docs describe future work that already exists, while others include sensitive example values.
- Auth context currently runs verbose debug logging in production mode (`AUTH_DEBUG = true`).

## Open Questions
- Unknown: expected SLA and security standards for payment/auth flows.
- Unknown: ownership and process for regulation data updates.
- TODO: confirm whether `.github/workflows/deploy.yml` should be removed or retained for fallback.

## Resume Instructions
1. Read `brain/project_context.md`, `brain/architecture.md`, `brain/next_steps.md`.
2. Align docs/workflows to Vercel as canonical deployment target.
3. Run local checks (`npm install`, `npm run build`, `npm run lint`) and capture failures.
4. Prioritize next actionable item from `brain/next_steps.md` > `Now` (currently customer UX requests).
5. After work, update this file + `brain/change_log.md` + `brain/next_steps.md`.
