import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const supabase = createServerComponentClient({ cookies })
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') || 6)

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, image_url, status, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
