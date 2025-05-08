import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Kết nối Supabase bằng env
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Chú ý: cần có quyền truy vấn theo user_id
);

export async function GET(req: Request) {
  // Lấy token từ cookie (nếu dùng auth)
  const accessToken = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    return NextResponse.json([], { status: 401 });
  }

  // Lấy thông tin user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(accessToken);

  if (userError || !user) {
    return NextResponse.json([], { status: 401 });
  }

  // Lấy bài viết theo user
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, image, created_at, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
