# Architecture

## Stack
- Frontend: React 18 + TypeScript + Vite
- UI: Tailwind CSS + Radix/shadcn components
- State/Data: React Query + React Context
- Auth + DB: Supabase
- Payments: Stripe
- API runtime: Vercel serverless functions (`api/*.ts`)

## Key Directories
- `src/pages`: route-level UI pages
- `src/components`: shared UI and feature components
- `src/contexts`: auth/app/upgrade providers
- `src/data`: regulation and location datasets
- `src/lib`: helpers and integration utilities
- `api`: checkout, webhook, and subscription APIs
- `supabase/migrations`: schema changes for profiles/bookmarks
- `.github/workflows`: CI/CD workflow for Pages deployment

## Entry Points
- Frontend bootstrap: `src/main.tsx`
- App router/providers: `src/App.tsx`
- API endpoints:
  - `api/create-checkout-session.ts`
  - `api/stripe-webhook.ts`
  - `api/cancel-subscription.ts`

## Integration Map
- Supabase:
  - Auth session lifecycle in `src/contexts/AuthContext.tsx`
  - Profile/bookmark persistence in `profiles` table
- Stripe:
  - Checkout session creation in API
  - Webhook updates plan state in Supabase profiles

## Deployment
- Active production target: Vercel (confirmed).
- Current repo still contains a GitHub Pages workflow in `.github/workflows/deploy.yml` that may be legacy.
- Vercel setup evidence:
  - `vercel.json` SPA + API rewrites
  - serverless API handlers in `api/*.ts`

## Maturity Assessment
- Mid-stage product:
  - Core flows implemented and deployable.
  - Payment and auth plumbing present.
  - Operational docs exist but are partially stale/inconsistent.
