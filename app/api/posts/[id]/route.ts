import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase
    .from('posts')
    .select('title, status')
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const body = await req.json()
  const { title, status } = body

  const { error } = await supabase
    .from('posts')
    .update({ title, status })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Cập nhật thành công' })
}
