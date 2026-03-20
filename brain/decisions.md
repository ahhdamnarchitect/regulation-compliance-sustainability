# Decisions

## D-001: Use file-based persistent repo memory
- Date: 2026-03-20
- Status: Active
- Decision: Maintain operational memory in `brain/*.md` and enforce updates through Cursor rules.
- Why: New agents/sessions need resumable context without relying on chat history.

## D-002: Keep lightweight command surface in-repo
- Date: 2026-03-20
- Status: Active
- Decision: Define operator commands in `cursor-os/commands.md` instead of requiring UI-only setup.
- Why: Versioned command definitions keep workflows repeatable across machines and sessions.

## D-003: Use Vercel as canonical deployment target
- Date: 2026-03-20
- Status: Active
- Decision: Treat Vercel as production deployment target and align docs/workflows accordingly.
- Why: Application relies on Vercel API functions and Vercel rewrite behavior for end-to-end operation.

## D-004: Use water-tone map background with subtle border
- Date: 2026-03-20
- Status: Active
- Decision: Keep map container/background aligned to `#d5e8eb` and use a subtle even border for both mobile and desktop.
- Why: Prevents mobile top/bottom "thick border" appearance and keeps map section visually consistent.

## D-005: Persist customer feedback in Supabase
- Date: 2026-03-20
- Status: Active
- Decision: Store homepage question/suggestion submissions in `public.customer_inquiries` instead of temporary client-only handling.
- Why: Creates durable intake records for follow-up, accountability, and future admin workflows.

## D-006: Manage inquiries from existing Admin page
- Date: 2026-03-20
- Status: Active
- Decision: Extend the current `/admin` page with inquiry triage instead of creating a separate admin route.
- Why: Reuses existing admin auth/access patterns and reduces operational complexity.
