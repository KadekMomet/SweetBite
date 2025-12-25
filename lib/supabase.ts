import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eqwlicspzibqcxomcerb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxd2xpY3NwemlicWN4b21jZXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzUxNjIsImV4cCI6MjA4MjE1MTE2Mn0.xpYl0nhJckwwepRHSFORsPmLxhtuLB0RSjgTSdZHd1o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

