'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

type Post = {
  id: string
  title: string
  image_url: string
  created_at: string
}

export default function DanhMucPage() {
  const supabase = createPagesBrowserClient()
  const params = useParams()
  const slug = params.slug as string
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, image_url, created_at')
        .eq('category', slug)
        .eq('status', 'active') // chỉ hiện bài đang hiển thị
        .order('created_at', { ascending: false })

      if (data) setPosts(data)
    }

    fetchData()
  }, [slug])

  const formatTitle = (slug: string) => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Tin trong: {formatTitle(slug)}</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">Không có tin nào.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((post) => (
            <li key={post.id} className="border rounded p-4 shadow-sm">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
