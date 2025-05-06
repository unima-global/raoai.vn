'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import ChatPopup from '../../../components/ChatPopup'

type Post = {
  id: number
  title: string
  image_url: string
  created_at: string
  category?: string
}

export default function UserProfile() {
  const supabase = createPagesBrowserClient()
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page') || '1')
  const keyword = searchParams.get('q')?.toLowerCase() || ''
  const category = searchParams.get('category') || ''
  const perPage = 6

  const [email, setEmail] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [viewerId, setViewerId] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)

  const updateFilter = (name: string, value: string) => {
    const paramsNew = new URLSearchParams(searchParams.toString())
    if (value) {
      paramsNew.set(name, value)
    } else {
      paramsNew.delete(name)
    }
    paramsNew.set('page', '1')
    router.push(`/user/${params.id}?${paramsNew.toString()}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      const userId = params.id as string

      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session?.user?.id) {
        setViewerId(sessionData.session.user.id)
      }

      const { data: userData } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single()

      if (userData?.email) setEmail(userData.email)

      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .ilike('title', `%${keyword}%`)

      if (count !== null) setTotal(count)

      let query = supabase
        .from('posts')
        .select('id, title, image_url, created_at, category')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1)

      if (keyword) {
        query = query.ilike('title', `%${keyword}%`)
      }

      if (category) {
        query = query.eq('category', category)
      }

      const { data: postData } = await query
      if (postData) setPosts(postData)
    }

    fetchData()
  }, [params.id, page, keyword, category])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Hồ sơ người dùng</h1>
      <p className="text-gray-600 mb-2">Email: {email || 'Không xác định'}</p>

      {viewerId && viewerId !== params.id && (
        <>
          <button
            onClick={() => setShowChat(true)}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Nhắn tin
          </button>
          {showChat && (
            <ChatPopup receiverId={params.id as string} onClose={() => setShowChat(false)} />
          )}
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <input
          type="text"
          placeholder="Tìm từ khóa..."
          defaultValue={keyword}
          className="p-2 border rounded"
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateFilter('q', (e.target as HTMLInputElement).value)
          }}
        />
        <select
          value={category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Tất cả danh mục</option>
          <option value="nhadat">Nhà đất</option>
          <option value="oto">Ô tô</option>
          <option value="dienthoai">Điện thoại</option>
        </select>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">Không có bài đăng phù hợp.</p>
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

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page <= 1}
            onClick={() => router.push(`/user/${params.id}?page=${page - 1}`)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            ← Trang trước
          </button>
          <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => router.push(`/user/${params.id}?page=${page + 1}`)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Trang sau →
          </button>
        </div>
      )}
    </div>
  )
}
