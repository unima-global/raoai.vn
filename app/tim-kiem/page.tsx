'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

type Post = {
  id: number
  title: string
  image_url: string
}

export default function TimKiemPage() {
  const supabase = createPagesBrowserClient()
  const searchParams = useSearchParams()
  const keyword = searchParams.get('q')?.toLowerCase() || ''
  const [results, setResults] = useState<Post[]>([])

  useEffect(() => {
    if (!keyword) return

    const fetchData = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, image_url')
        .ilike('title', `%${keyword}%`)
        .order('id', { ascending: false })

      if (data) setResults(data)
    }

    fetchData()
  }, [keyword])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Kết quả tìm kiếm: "{keyword}"</h1>

      {results.length === 0 ? (
        <p className="text-gray-600">Không tìm thấy kết quả nào.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((post) => (
            <li key={post.id} className="border rounded p-4 shadow-sm">
              <h2 className="font-semibold">{post.title}</h2>
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
