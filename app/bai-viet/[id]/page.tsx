'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState<any>(null)

  useEffect(() => {
    fetch('/api/posts/' + id)
      .then(res => res.json())
      .then(data => setPost(data))
  }, [id])

  if (!post) return <p className="p-6">Đang tải bài viết...</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

      {/* ẢNH */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {(post.images || []).slice(0, 10).map((url: string, index: number) => (
          <img key={index} src={url} alt="ảnh bài viết" className="w-full h-40 object-cover rounded" />
        ))}
      </div>

      {/* MÔ TẢ + ĐỊA CHỈ */}
      <p className="mb-4 text-gray-800 whitespace-pre-line">{post.description || '(Không có mô tả)'}</p>
      {post.location && (
        <p className="mb-2 text-gray-600">📍 Địa chỉ: {post.location}</p>
      )}

      {/* TRẠNG THÁI + THỜI GIAN */}
      <p className="text-sm text-gray-500">
        Ngày đăng: {new Date(post.created_at).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">
        Trạng thái: {post.status === 'active' ? '✅ Đang hiển thị' : '❌ Ẩn'}
      </p>
    </div>
  )
}
