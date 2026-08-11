import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isValidUrl = supabaseUrl && /^https?:\/\//i.test(supabaseUrl);

if (!isValidUrl) {
  console.warn(
    '⚠️ [Supabase Config Warning]: VITE_SUPABASE_URL in client/.env is missing or set to placeholder. Please update with your real Supabase project URL.'
  );
}

export const supabase = isValidUrl ? createClient(supabaseUrl, supabaseAnonKey) : null;
