import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ldwienxwdlffzssckela.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_uLzncz9YuFXozSV1WWIFsQ_nFKjj1tk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
