'use client'
import { useEffect, useState } from 'react'

interface Post {
  id: string
  title: string
  created_at: string
  status: 'active' | 'hidden'
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetch('/api/my-posts')
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🗂️ Tin của tôi</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">Bạn chưa đăng tin nào.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Tiêu đề</th>
              <th className="p-2 border">Ngày đăng</th>
              <th className="p-2 border">Trạng thái</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id} className="border-t">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{post.title}</td>
                <td className="p-2 border">{new Date(post.created_at).toLocaleString()}</td>
                <td className="p-2 border">
                  {post.status === 'active' ? '✅ Đang hiển thị' : '🕒 Đang ẩn'}
                </td>
                <td className="p-2 border space-x-2">
                  <button className="px-2 py-1 bg-blue-600 text-white rounded">Sửa</button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded">Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
