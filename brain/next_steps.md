# Next Steps

## Now
- Set up operational triage process for `customer_inquiries` (owner, SLA, and resolution status updates).
- Verify admin triage view can read/update inquiry status end-to-end.
- Apply migration `20260320000300_promote_admin_adamg.sql` in Supabase to grant admin role to `admin.adamg@gmail.com`.
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
