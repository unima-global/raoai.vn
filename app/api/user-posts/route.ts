import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // ✅ Gắn đúng user_id từ Supabase table "posts"
  const userId = 'YOUR_REAL_USER_ID_HERE'; // ← Thay chuỗi này bằng ID thật

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, image, created_at, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('🔴 Supabase query error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
