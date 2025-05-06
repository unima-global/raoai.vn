'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import ChatPopup from '../../../components/ChatPopup'

type Post = {
  id: string
  title: string
  content: string
  image_url: string
  images: string[]
  location?: string
  user_id: string
}

export default function ChiTietTin() {
  const supabase = createPagesBrowserClient()
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [posterEmail, setPosterEmail] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData.session?.user?.id
      if (uid) setUserId(uid)

      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (postError || !postData) {
        setPost(null)
        return
      }

      setPost(postData)

      const { data: userData } = await supabase
        .from('users')
        .select('email')
        .eq('id', postData.user_id)
        .single()

      if (userData?.email) setPosterEmail(userData.email)

      if (uid) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', uid)
          .eq('post_id', postData.id)
          .single()

        if (favData) setIsFavorite(true)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId])

  const handleFavorite = async () => {
    if (!userId || !post) return

    if (!isFavorite) {
      await supabase.from('favorites').insert({
        user_id: userId,
        post_id: post.id,
      })
      setIsFavorite(true)
    }
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center text-red-600">
        Bài viết không tồn tại hoặc đã bị xóa.
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
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

      <div className="p-4 border rounded bg-gray-50 space-y-2">
        <p className="text-sm text-gray-700">
          Người đăng:{' '}
          {post.user_id ? (
            <Link
              href={`/user/${post.user_id}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {posterEmail || 'Xem hồ sơ'}
            </Link>
          ) : (
            'Không xác định'
          )}
        </p>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setShowChat(true)}
        >
          Liên hệ người bán
        </button>

        {showChat && (
          <ChatPopup receiverId={post.user_id} onClose={() => setShowChat(false)} />
        )}

        {userId && post.user_id !== userId && (
          <button
            onClick={handleFavorite}
            disabled={isFavorite}
            className={`px-4 py-2 text-sm rounded ${
              isFavorite
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isFavorite ? '❤️ Đã lưu' : '🤍 Lưu bài'}
          </button>
        )}
      </div>
    </div>
  )
}
