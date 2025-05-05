import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../types'; // hoặc điều chỉnh nếu bạn chưa có file types

export function createClient() {
  return createServerComponentClient<Database>({ cookies });
}
