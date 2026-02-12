# Payments (Stripe) and transactional emails

This doc describes the intended payment flow, pricing, and email behavior for when Stripe and email are integrated.

## Pricing (Professional plan)

- **Monthly:** $39.99/month
- **Yearly:** $399.99/year (save over $80 vs monthly)
- **Trial:** 7-day free trial; card is charged only after the trial ends.

## User emails (to implement)

Send these transactional emails at the right lifecycle events:

1. **When the user creates an account**  
   Send a welcome / account-created email (once per signup).

2. **When the user starts the free trial**  
   Send a confirmation email that they’ve started the trial, when the trial begins (e.g. when they complete checkout and a Stripe subscription with trial is created). This is **not** the payment receipt.

3. **When the trial ends and the card is charged**  
   Send an email that their subscription has started and they were charged. **Treat this as the payment receipt** (include amount, date, and optionally a link to invoice/receipt if Stripe provides one).

## Checkout and Stripe (to implement)

- **Frontend:** `/checkout` page is implemented; the “Start 7-day free trial” button currently shows a “Coming soon” toast. When the backend is ready, it should call an API that creates a Stripe Checkout Session (with trial and the correct price IDs for $39.99/mo and $399.99/yr), then redirect to Stripe Checkout.
- **Backend:** Create a serverless/API endpoint that uses the Stripe SDK to create a Checkout Session (customer, subscription with 7-day trial, success/cancel URLs). Handle Stripe webhooks (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`) to update `profiles.plan` and optionally store `stripe_customer_id` / `stripe_subscription_id`.
- **Environment:** You will need `STRIPE_SECRET_KEY` (backend) and, if needed, `VITE_STRIPE_PUBLISHABLE_KEY` (frontend). Add these to `.env` and Vercel env vars when you integrate.

## Current behavior

- Upgrade popup (free tier) shows pricing: $39.99/month or $399.99/year and links to `/checkout`.
- Account Settings “Upgrade” button and popup “Upgrade to Professional” button both navigate to `/checkout`.
- After new account creation, the upgrade popup is shown to prompt the user to start their free trial.
- The checkout page does not yet create Stripe sessions or charge cards; the submit button only shows a “Coming soon” message.
