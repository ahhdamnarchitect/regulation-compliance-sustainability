# Change Log

## 2026-03-21 - Admin seed user (missickconsulting@gmail.com)
- Added migration `20260320000800_admin_missickconsulting_user.sql`: extends `assign_admin_role_for_adamg` to include `missickconsulting@gmail.com`, creates auth user + `auth.identities` when missing (demo password per request), and forces `profiles` to `admin` + `professional`.
- Apply in Supabase SQL Editor if not using CLI-linked migrations; rotate password after first login.

## 2026-03-21 - Brand polish for Questions/Suggestions + pricing simplification
- Reworked homepage and search **Questions or Suggestions?** messaging to be longer, clearer, and more brand-consistent.
- Replaced ambiguous CTA label `Go` with `Open Regulation Help` across home/search.
- Homepage panel layout simplified: removed support disclaimer text from under CTA and moved account/billing/subscription guidance into a separate low-emphasis helper line below the panel.
- Simplified `/pricing` by removing the not-yet-established Enterprise tier; page now focuses on Free and Professional positioning.

## 2026-03-21 - Pricing page + CTA copy alignment
- Added new marketing-focused `/pricing` page with Free, Professional, and Enterprise tiers and plan-aware CTAs.
- Wired routing for `/pricing` in `src/App.tsx`.
- Added `Pricing` link in the footer navigation.
- Updated **Questions or Suggestions?** copy and CTA labels on homepage and search (`Go` -> `/regulation-help`), and refined regulation-help intro copy to route account/billing/subscription questions to `/contact` via linked `Contact`.

## 2026-03-21 - Copy polish for contact navigation
- Updated Regulation Help page text/labels: title to `Regulation Help`, forms to `Regulation Question` and `Regulation Suggestion`.
- Updated Questions/Suggestions panel copy on home and search, including hyperlink anchor text (`click here` / `here`) per stakeholder request.
- Updated `/contact` intro sentence to use linked `here` for regulation-specific help.

## 2026-03-20 - Brain sync before git push (session)
- Confirmed `brain/current_state.md`, `next_steps.md`, and `change_log.md` reflect `/contact` vs `/regulation-help`, inquiry limits, admin tooltips, and pending migrations **006** (profiles RLS), **007** (general inquiries).
- Pushed latest app + migrations + docs to `origin/main`.

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

## 2026-03-20 - Admin auto-role trigger added
- Added migration `20260320000400_auto_admin_adamg_profile_trigger.sql`.
- Ensures `admin.adamg@gmail.com` is set to admin on profile insert/update and backfills profile from `auth.users` if needed.

## 2026-03-20 - Admin plan tier elevated
- Updated migration `20260320000400_auto_admin_adamg_profile_trigger.sql` to enforce `plan = 'professional'` for `admin.adamg@gmail.com`.
- Applied for all paths: trigger-time profile writes, auth-user backfill insert, and existing-row update.
- User validated behavior end-to-end in testing.

## 2026-03-20 - Contact split: /contact vs /regulation-help
- **`/contact`:** FAQ + general inquiry form (accounts, billing, subscriptions, etc.); footer **Contact** link.
- **`/regulation-help`:** “Ask a Question About a Regulation” and “Suggest a Regulation” (no regulation field on suggestion); Submit buttons; message length limit 4000; admin message column uses tooltip for full text.
- Migration `20260320000700_customer_inquiries_general.sql`: `inquiry_type` includes `general`, optional `category` column.
- Homepage/search **Questions or Suggestions?** → button **Contact Us** → `/regulation-help`; copy distinguishes general **Contact us** (`/contact`).

## 2026-03-20 - Login fix (profiles RLS) + hide contact cue for free tier
- **Login 500:** Admin `profiles` policies used `EXISTS (SELECT … FROM profiles …)`, which re-enters RLS and causes recursion / HTTP 500 on `GET /profiles`. New migration `20260320000600_profiles_admin_policies_fix_recursion.sql` drops those policies and replaces them with `public.is_admin()` (`SECURITY DEFINER`) + policies using `is_admin()`. **Apply in Supabase** to restore sign-in profile fetch.
- **UI:** "Questions or Suggestions?" on home + search is hidden when the user is logged in with `plan === 'free'`; still shown for logged-out visitors and professional/enterprise.

## 2026-03-20 - Brain sync (current state & next steps)
- Refreshed `current_state.md` for `/contact`, inquiry autocomplete, admin tabs/users, map tweaks, and regulation detail question panel.
- `next_steps.md`: added smoke-test item for new contact/search/home inquiry UX.

## 2026-03-20 - Questions / suggestions sections & inquiry autocomplete
- Homepage: dedicated **Questions or Suggestions?** section after search with CTA link to `/contact`.
- Search results: same titled block + **Go to contact form** button.
- Contact: **Regulation** field (was regulation/topic) with DB autocomplete (top 3 titles); suggestion form adds **Regulation** autocomplete + **Country or jurisdiction** autocomplete; optional `?regulation=` query pre-fills question regulation.
- Regulation detail: bottom **RegulationQuestionPanel** with regulation pre-filled and same autocomplete.
- New: `inquiryAutocomplete.ts`, `InquiryAutocompleteInput`, `RegulationQuestionPanel`.

## 2026-03-20 - Homepage map, contact page, admin tabs
- Map: removed region/country/jurisdiction tip; reduced decorative border; Leaflet container outline/border cleared; wider map on desktop (`md:max-w-none`).
- Contact: new `/contact` page with question + suggestion forms; homepage shows link after search; search results footer links to `/contact`.
- Admin: link back to homepage; tabs for Regulations, Customer inquiries, Users (masked email, reveal toggle, edit plan/role/display name + Save).
- Migration `20260320000500_profiles_admin_read_update_policies.sql`: admin RLS to select/update all `profiles` (required for Users tab).
