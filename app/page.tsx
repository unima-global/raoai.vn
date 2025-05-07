'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/posts?limit=8')
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">🆕 Tin mới nhất</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">Chưa có tin nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded shadow hover:shadow-lg bg-white">
              <img
                src={post.images?.[0] || '/no-image.jpg'}
                alt={post.title}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-1">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  Ngày đăng: {new Date(post.created_at).toLocaleString()}
                </p>
                <Link href={`/bai-viet/${post.id}`} className="text-blue-600 text-sm">Xem chi tiết →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
