import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });

const PRICE_MONTHLY = process.env.STRIPE_PRICE_ID_MONTHLY!;
const PRICE_YEARLY = process.env.STRIPE_PRICE_ID_YEARLY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const { interval, userId, userEmail } = (req.body || {}) as {
    interval?: 'monthly' | 'yearly';
    userId?: string;
    userEmail?: string;
  };

  if (!interval || !userEmail) {
    return res.status(400).json({ error: 'Missing interval or userEmail' });
  }

  if (interval !== 'monthly' && interval !== 'yearly') {
    return res.status(400).json({ error: 'Invalid interval' });
  }

  const priceId = interval === 'yearly' ? PRICE_YEARLY : PRICE_MONTHLY;
  const origin = (req.headers.origin || req.headers.referer || '').replace(/\/$/, '') || 'https://regulation-compliance-sustainabilit.vercel.app';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 7 },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      customer_email: userEmail,
      client_reference_id: userId || undefined,
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('[create-checkout-session]', e);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
