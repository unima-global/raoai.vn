'use client'
import { useEffect, useState } from 'react'

interface Post {
  id: string
  title: string
  image_url: string
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

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn chắc chắn muốn xoá tin này?')) return
    await fetch('/api/posts/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
setPosts(prev => prev.map(p => p.id === id ? { ...p, status: status as 'active' | 'hidden' | 'sold' } : p))
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📋 Danh sách tin của tôi</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">Bạn chưa đăng tin nào.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border rounded shadow p-4">
            <img src={post.image_url || '/no-image.jpg'} alt={post.title} className="w-full h-60 object-cover rounded mb-4" />
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-2">Ngày đăng: {new Date(post.created_at).toLocaleString()}</p>
            <p className="mb-2">
              Trạng thái: {
                post.status === 'active' ? '✅ Đang hiển thị' :
                post.status === 'hidden' ? '🙈 Đang ẩn' :
                '✔️ Đã bán'
              }
            </p>

            {userId === post.user_id && (
              <div className="space-x-2">
                <button onClick={() => updateStatus(post.id, 'sold')} className="bg-green-600 text-white px-3 py-1 rounded">Đã bán</button>
                <button onClick={() => updateStatus(post.id, 'hidden')} className="bg-gray-600 text-white px-3 py-1 rounded">Ẩn tin</button>
                <button onClick={() => updateStatus(post.id, 'active')} className="bg-blue-600 text-white px-3 py-1 rounded">Hiển thị lại</button>
                <button onClick={() => location.href = `/my-posts/edit/${post.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded">Sửa</button>
                <button onClick={() => handleDelete(post.id)} className="bg-red-600 text-white px-3 py-1 rounded">Xoá</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
