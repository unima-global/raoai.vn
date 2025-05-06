'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

type Post = {
  id: number
  title: string
  image_url: string
}

export default function UserProfile() {
  const supabase = createPagesBrowserClient()
  const params = useParams()
  const [email, setEmail] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const userId = params.id as string

      const { data: userData } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single()

      if (userData?.email) {
        setEmail(userData.email)
      }

      const { data: postData } = await supabase
        .from('posts')
        .select('id, title, image_url')
        .eq('user_id', userId)
        .order('id', { ascending: false })

      if (postData) {
        setPosts(postData)
      }
    }

    fetchData()
  }, [params.id])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Hồ sơ người dùng</h1>
      <p className="text-gray-600 mb-6">Email: {email || 'Không xác định'}</p>

      <h2 className="text-lg font-semibold mb-3">Các bài đăng:</h2>

      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">Chưa có bài đăng nào.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((post) => (
            <li key={post.id} className="border rounded p-4 shadow-sm">
              <h3 className="font-semibold text-sm sm:text-base">{post.title}</h3>
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
