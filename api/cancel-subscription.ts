import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });

async function getUserIdFromToken(token: string, supabaseUrl: string, anonKey: string): Promise<string | null> {
  const res = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anonKey,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.id ?? null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[cancel-subscription] missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  const anonKey = supabaseAnonKey || serviceRoleKey;

  const userId = await getUserIdFromToken(token, supabaseUrl, anonKey);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, stripe_customer_id')
    .eq('id', userId)
    .single();

  if (profileError || !profile?.stripe_customer_id) {
    return res.status(400).json({
      error: 'No active subscription',
      code: 'NO_SUBSCRIPTION',
    });
  }

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 1,
    });
    const trialing = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'trialing',
      limit: 1,
    });
    const sub = subscriptions.data[0] || trialing.data[0];
    if (!sub) {
      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free', updated_at: new Date().toISOString() })
        .eq('id', userId);
      return res.status(200).json({
        success: true,
        message: 'No active subscription found. Your account is set to free.',
      });
    }

    await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
    return res.status(200).json({
      success: true,
      message: 'Subscription will cancel at the end of the current billing period. You will keep access until then.',
      cancel_at: sub.current_period_end,
    });
  } catch (e) {
    console.error('[cancel-subscription]', e);
    return res.status(500).json({ error: 'Failed to cancel subscription' });
  }
}
