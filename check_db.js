import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('Users').select('*').eq('id', 'test_user_123');
  console.log("Error:", error);
  console.log("Data:", JSON.stringify(data, null, 2));
}
check();
