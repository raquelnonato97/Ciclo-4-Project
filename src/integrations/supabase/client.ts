import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error("As credenciais do Supabase não foram encontradas no arquivo .env");
}

export const supabase = createClient(SUPABASE_URL || "", SUPABASE_PUBLISHABLE_KEY || "");