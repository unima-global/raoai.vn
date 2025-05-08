import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, image_url, created_at, status')
    .order('created_at', { ascending: false })
    .limit(10); // Chỉ lấy 10 bài viết mới nhất

  if (error) {
    console.error('Lỗi Supabase:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
