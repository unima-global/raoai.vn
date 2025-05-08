import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Gắn đúng Supabase service key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const userId = 'dòng_user_id_thật_ở_Supabase_của_bạn'; // 👈 Nhớ thay bằng ID thật từ bảng `posts`

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, image, created_at, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('🔴 Lỗi truy vấn Supabase:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log('✅ Dữ liệu trả về:', data);
  return NextResponse.json(data);
}
