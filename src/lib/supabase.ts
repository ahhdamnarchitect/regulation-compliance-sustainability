import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (project: jitwxzdtckjxubcmepza)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jitwxzdtckjxubcmepza.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);