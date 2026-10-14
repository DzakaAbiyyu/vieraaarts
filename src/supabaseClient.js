import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wrrvmoyodcuauxkqcsnr.supabase.co';
const supabaseAnonKey = 'sb_publishable_Es-SEhSb5Q6YCKVxrkP2kQ_U7npz1vo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);