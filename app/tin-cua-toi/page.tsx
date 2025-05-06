'use client'

import { useEffect, useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

type Post = {
  id: number
  title: string
  image_url: string
}

export default function TinCuaToi() {
  const supabase = createPagesBrowserClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const uid = session?.user?.id
      setUserId(uid)

      if (!uid) return

      const { data, error } = await supabase
        .from('posts')
        .select('id, title, image_url')
        .eq('user_id', uid)
        .order('id', { ascending: false })

      if (data) setPosts(data)
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tin của tôi</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">Chưa có tin nào.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="border p-4 rounded shadow-sm">
              <h2 className="font-semibold text-lg">{post.title}</h2>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-auto mt-2 rounded"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
