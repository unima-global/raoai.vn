import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const { data, error } = await supabase
    .from('posts')
    .select('id, user_id, title, description, image_url, contact, location, status, created_at')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Lỗi Supabase:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
