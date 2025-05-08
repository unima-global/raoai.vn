import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // ⚠ Thay user_id này bằng ID thật của bạn trong bảng posts
  const userId = 'your_test_user_id_here';

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, image, created_at, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
