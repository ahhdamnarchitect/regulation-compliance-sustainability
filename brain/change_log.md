# Change Log

## 2026-03-20 - Cursor Repo OS installation
- Installed persistent repo memory system under `brain/`.
- Added architecture/context/current-state/decisions/next-steps operational docs.
- Added Cursor rules under `.cursor/rules/` to enforce before/after workflow and quality standards.
- Added command system in `cursor-os/commands.md`.
- Added skills/subagents blueprints in `cursor-os/skills.md` and `cursor-os/subagents.md`.
- Added bootstrap script `scripts/init-cursor-os.py` and usage doc `cursor-os/bootstrap-usage.md`.
- Updated `README.md` with a concise Cursor Repo OS section.

## 2026-03-20 - Deployment target confirmed
- Updated brain files to mark Vercel as canonical production deployment target.
- Removed deployment ambiguity from `current_state.md` and `next_steps.md`.
- Updated deployment decision in `decisions.md` from temporary unresolved status to active Vercel standard.

## 2026-03-20 - Map border visual fix
- Updated map section styling to resolve thick/uneven mobile border appearance.
- Set map visual treatment to water-tone background (`#d5e8eb`) with subtle border for desktop/mobile consistency.
- Synced brain state and next actions to include pending customer UX requests.

## 2026-03-20 - Customer question/suggestion intake
- Added two homepage forms: regulation question and regulation suggestion.
- Added copy clarifying region vs country vs jurisdiction near map.
- Wired both forms to Supabase inserts using `customer_inquiries`.
- Added migration `20260320000100_customer_inquiries.sql` with table, RLS insert policy, and indexes.

## 2026-03-20 - Admin inquiry triage
- Extended `src/pages/Admin.tsx` with a `customer_inquiries` review table and status management controls.
- Added status update flow (`new` -> `in_review` -> `resolved`) with inline Select controls.
- Added migration `20260320000200_customer_inquiries_admin_policies.sql` for admin-only select/update policies.

## 2026-03-20 - Migration rollout confirmed
- User confirmed both `customer_inquiries` migrations were executed in Supabase.
- Next validation focus is admin read/update behavior and operational triage process.

## 2026-03-20 - Admin promotion migration added
- Added migration `20260320000300_promote_admin_adamg.sql`.
- Migration promotes `admin.adamg@gmail.com` to `role = 'admin'` in `public.profiles`.
