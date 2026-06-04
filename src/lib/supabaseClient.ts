import { createClient } from '@supabase/supabase-js';

// Fallbacks prevent the client instantiation from throwing errors at compile-time/test-time if env vars are unset
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
