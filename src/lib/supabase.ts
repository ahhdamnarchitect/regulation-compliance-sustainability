import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vduexwjebtktpwaiasil.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkdWV4d2plYnRrdHB3YWlhc2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzYyNDMsImV4cCI6MjA3MDExMjI0M30.EZKf4KmcZVsQ_p8axN3_PuiuC0GToMn0fVocll73wfU';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };