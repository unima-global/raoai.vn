'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

type Post = {
  id: number
  title: string
  content: string
  image_url: string
  images: string[]
  location?: string
}

export default function ChiTietTin() {
  const supabase = createPagesBrowserClient()
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', Number(params.id))
        .single()

      if (data) setPost(data)
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id])

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <p className="text-gray-500">Đang tải bài viết...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-2">{post.content}</p>

      {post.location && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Địa chỉ: {post.location}</p>
          <iframe
            className="w-full h-64 rounded"
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(post.location)}&output=embed`}
          ></iframe>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {post.images && post.images.length > 0 ? (
          post.images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Ảnh ${idx + 1}`}
              className="w-full h-auto rounded"
            />
          ))
        ) : post.image_url ? (
          <img src={post.image_url} alt={post.title} className="w-full h-auto rounded" />
        ) : (
          <p className="text-sm text-gray-400">Không có ảnh</p>
        )}
      </div>
    </div>
  )
}
