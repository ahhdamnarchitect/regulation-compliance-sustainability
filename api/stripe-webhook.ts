import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import type { IncomingMessage } from 'http';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = { api: { bodyParser: false } };

function getRawBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const sig = req.headers['stripe-signature'];
  if (!sig || !webhookSecret) {
    return res.status(400).send('Missing stripe-signature or STRIPE_WEBHOOK_SECRET');
  }

  const rawBody = await getRawBody(req as unknown as IncomingMessage);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed', err);
    return res.status(400).send('Webhook signature verification failed');
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[stripe-webhook] missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return res.status(500).end();
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerId = session.customer as string;
        if (userId && customerId) {
          const { error } = await supabase
            .from('profiles')
            .update({
              plan: 'professional',
              stripe_customer_id: customerId,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
          if (error) console.error('[stripe-webhook] profiles update error', error);
        }
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.status === 'active' || sub.status === 'trialing') {
          const customerId = sub.customer as string;
          const { data: rows } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId);
          if (rows?.length) {
            await supabase
              .from('profiles')
              .update({ plan: 'professional', updated_at: new Date().toISOString() })
              .eq('id', rows[0].id);
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const { data: rows } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId);
        if (rows?.length) {
          await supabase
            .from('profiles')
            .update({ plan: 'free', updated_at: new Date().toISOString() })
            .eq('id', rows[0].id);
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('[stripe-webhook]', e);
    return res.status(500).end();
  }

  return res.status(200).send('ok');
}
