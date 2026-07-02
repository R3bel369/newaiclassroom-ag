import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uppdgqluvdyschksmxqh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7MT-gqdqvqFYPaIjqU5kjw_iLx6MFsA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
