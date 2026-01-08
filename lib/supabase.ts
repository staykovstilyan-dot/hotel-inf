
import { createClient } from '@supabase/supabase-js';

// За демо цели използваме локален mock, ако няма ключове.
// В реална среда заменете с вашия URL и Anon Key от Supabase Dashboard.
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
