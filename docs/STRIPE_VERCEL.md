# Stripe env vars in Vercel

Add these in **Vercel Dashboard** → your project → **Settings** → **Environment Variables**. Use the **exact names** below.

## Required (use these exact names)

| Name | Description | Example |
|------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key (backend only) | `sk_live_...` or `sk_test_...` |
| `STRIPE_PRICE_ID_MONTHLY` | Stripe Price ID for $39.99/month | `price_xxxxxxxxxxxxx` |
| `STRIPE_PRICE_ID_YEARLY` | Stripe Price ID for $399.99/year | `price_xxxxxxxxxxxxx` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (after adding endpoint in Stripe) | `whsec_...` |
| `SUPABASE_URL` | Supabase project URL (same as frontend) | `https://xxxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **service role** key (not anon key) | `eyJ...` |

## Optional (for frontend)

| Name | Description |
|------|-------------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key if you use Stripe.js on the client later |

## After deploy

1. Deploy the app to Vercel.
2. In **Stripe Dashboard** → Developers → Webhooks → **Add endpoint**:
   - **Endpoint URL:** `https://<your-vercel-domain>/api/stripe-webhook`
   - **Events:** `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
3. Copy the **Signing secret** and add it in Vercel as `STRIPE_WEBHOOK_SECRET`, then redeploy if needed.
