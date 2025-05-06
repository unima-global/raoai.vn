'use client'

import { useEffect, useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

type Post = {
  id: number
  title: string
  image_url: string
  status?: string
}

export default function TinCuaToi() {
  const supabase = createPagesBrowserClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      if (!uid) return
      setUserId(uid)

      const { data } = await supabase
        .from('posts')
        .select('id, title, image_url, status')
        .eq('user_id', uid)
        .order('id', { ascending: false })

      if (data) setPosts(data)
    }

    fetchData()
  }, [])

  const updateStatus = async (postId: number, newStatus: string) => {
    await supabase.from('posts').update({ status: newStatus }).eq('id', postId)
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: newStatus } : p))
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tin của tôi</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">Chưa có tin nào.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="border p-4 rounded shadow-sm bg-white">
              <h2 className="font-semibold">{post.title}</h2>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-auto mt-2 rounded"
                />
              )}
              <p className="text-sm text-gray-500 mt-2">
                Trạng thái:{' '}
                <span className="font-medium text-blue-700">
                  {post.status === 'sold'
                    ? 'Đã bán'
                    : post.status === 'hidden'
                    ? 'Đang ẩn'
                    : 'Đang hiển thị'}
                </span>
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => updateStatus(post.id, 'sold')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Đánh dấu Đã bán
                </button>
                <button
                  onClick={() => updateStatus(post.id, 'hidden')}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Ẩn tin
                </button>
                <button
                  onClick={() => updateStatus(post.id, 'active')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Hiển thị lại
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
