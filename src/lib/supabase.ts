import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (project: jitwxzdtckjxubcmepza)
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jitwxzdtckjxubcmepza.supabase.co';
/** In dev, allow running without .env so the UI loads; requests may fail and hooks fall back to mock data. */
export const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (import.meta.env.DEV ? 'dev-missing-anon-key-placeholder' : '');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);