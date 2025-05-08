import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const userId = '4a23ed76-931f-4c55-9d22-e45b3fcd5c25';

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('🔥 Supabase error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log('📦 Supabase data:', data);

  return NextResponse.json(data);
}
