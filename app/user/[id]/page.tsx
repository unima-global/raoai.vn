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
  status?: string
}

export default function UserProfile() {
  const supabase = createPagesBrowserClient()
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page') || '1')
  const keyword = searchParams.get('q')?.toLowerCase() || ''
  const category = searchParams.get('category') || ''
  const status = searchParams.get('status') || ''
  const perPage = 6

  const [email, setEmail] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [viewerId, setViewerId] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)

  const updateFilter = (name: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (value) {
      newParams.set(name, value)
    } else {
      newParams.delete(name)
    }
    newParams.set('page', '1')
    router.push(`/user/${params.id}?${newParams.toString()}`)
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

      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

      let countQuery = supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('created_at', cutoff)

      if (keyword) countQuery = countQuery.ilike('title', `%${keyword}%`)
      if (category) countQuery = countQuery.eq('category', category)
      if (status) countQuery = countQuery.eq('status', status)

      const { count } = await countQuery
      if (count !== null) setTotal(count)

      let dataQuery = supabase
        .from('posts')
        .select('id, title, image_url, created_at, category, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('created_at', cutoff)
        .order('created_at', { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1)

      if (keyword) dataQuery = dataQuery.ilike('title', `%${keyword}%`)
      if (category) dataQuery = dataQuery.eq('category', category)
      if (status) dataQuery = dataQuery.eq('status', status)

      const { data: postData } = await dataQuery
      if (postData) setPosts(postData)
    }

    fetchData()
  }, [params.id, page, keyword, category, status])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Hồ sơ người dùng</h1>
      <p className="text-gray-600 mb-2">Email: {email || 'Không xác định'}</p>

      {viewerId && viewerId !== params.id && (
        <>
          <button
            onClick={() => setShowChat(true)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
        <select
          value={status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hiển thị</option>
          <option value="sold">Đã bán</option>
          <option value="hidden">Ẩn</option>
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
              <p className="text-xs text-gray-500 mt-1">
                Trạng thái: {post.status === 'sold'
                  ? 'Đã bán'
                  : post.status === 'hidden'
                  ? 'Ẩn'
                  : 'Đang hiển thị'}
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
