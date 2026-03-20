# Project Context

## Purpose
Missick is a regulation compliance platform focused on ESG and sustainability requirements. It helps users discover, filter, bookmark, and review regulations across jurisdictions.

## Product Scope
- Search and filter regulatory content across regions and frameworks.
- Authenticated user features (bookmarks, account state, role-based behavior).
- Admin surface for managing regulations.
- Paid plan upgrade flow via Stripe checkout and webhook-driven plan updates.

## Users
- Compliance analysts and sustainability teams.
- Admin operators maintaining regulation data.

## Current Value Proposition
- Faster discovery of relevant regulations.
- Centralized reference point for global sustainability/compliance requirements.
- Upgrade path for paid/professional usage.

## Repo Constraints
- Frontend and API functions share one repo.
- Supabase and Stripe configuration is environment-variable dependent.
- Some docs are older and partially inconsistent with current implementation.

## Unknowns / TODO
- Unknown: authoritative production URL and active deployment target (GitHub Pages vs Vercel).
- Unknown: source of truth for regulation dataset update pipeline.
- TODO: document data ownership and update cadence for `src/data/*`.
