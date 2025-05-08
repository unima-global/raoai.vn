'use client'
import { useEffect, useState } from 'react'

interface Post {
  id: string
  title: string
  image_url?: string
  images?: string[]
  status: 'active' | 'hidden' | 'sold'
  created_at: string
  user_id: string
}

export default function MyPostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/my-posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || [])
        setUserId(data.user_id || null)
      })
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📋 Danh sách tin của tôi</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">Bạn chưa đăng tin nào.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="max-w-3xl mx-auto border rounded shadow p-4">
            <div className="w-full aspect-video overflow-hidden rounded mb-4">
              <img
                src={post.images?.[0] || post.image_url || '/no-image.jpg'}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              Ngày đăng: {new Date(post.created_at).toLocaleString()}
            </p>
            <p className="mb-2">
              Trạng thái: {post.status === 'active'
                ? '✅ Đang hiển thị'
                : post.status === 'hidden'
                ? '🙈 Đang ẩn'
                : '✔️ Đã bán'}
            </p>
          </div>
        ))
      )}
    </div>
  )
}
