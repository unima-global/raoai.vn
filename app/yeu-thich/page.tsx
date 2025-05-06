'use client'

import { useEffect, useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

type Post = {
  id: string
  title: string
  image_url: string
  created_at: string
}

export default function DanhSachYeuThich() {
  const supabase = createPagesBrowserClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData.session?.user?.id
      if (!uid) return
      setUserId(uid)

      const { data: favoriteData } = await supabase
        .from('favorites')
        .select('post_id')
        .eq('user_id', uid)

      const ids = favoriteData?.map((f) => f.post_id) || []

      if (ids.length > 0) {
        const { data: postData } = await supabase
          .from('posts')
          .select('id, title, image_url, created_at')
          .in('id', ids)
          .order('created_at', { ascending: false })

        if (postData) setPosts(postData)
      }
    }

    fetchData()
  }, [])

  const handleUnfavorite = async (postId: string) => {
    if (!userId) return

    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId)

    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">❤️ Bài viết đã lưu</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">Bạn chưa lưu bài viết nào.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((post) => (
            <li key={post.id} className="border rounded p-4 shadow-sm relative">
              <h3 className="font-semibold text-sm sm:text-base">{post.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Đăng lúc: {new Date(post.created_at).toLocaleString('vi-VN')}
              </p>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-auto mt-2 rounded"
                />
              )}
              <Link
                href={`/tin/${post.id}`}
                className="text-blue-600 text-sm inline-block mt-2"
              >
                Xem chi tiết →
              </Link>

              <button
                onClick={() => handleUnfavorite(post.id)}
                className="absolute top-2 right-2 text-sm text-red-600 hover:underline"
              >
                ❌ Bỏ lưu
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
