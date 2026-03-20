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
- Homepage now includes two customer intake forms:
  - Regulation question form (24-hour response expectation text)
  - Regulation suggestion form
- Form submissions are persisted to Supabase `customer_inquiries` (new migration added).
- Admin page now includes a customer inquiries triage table with status updates (`new`, `in_review`, `resolved`).

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
