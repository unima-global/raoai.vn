'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'

export default function DangTin() {
  const supabase = createClientComponentClient()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  // Lấy session khi load trang
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserId(session.user.id)
      }
    }
    fetchSession()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = async () => {
    if (!userId) {
      setMessage('Bạn cần đăng nhập để đăng tin.')
      return
    }

    const imageUrls: string[] = []
    for (const file of images) {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`public/${Date.now()}-${file.name}`, file)

      if (error) {
        console.error(error)
      } else {
        const url = supabase.storage
          .from('images')
          .getPublicUrl(data.path).data.publicUrl
        imageUrls.push(url)
      }
    }

    const { error } = await supabase.from('posts').insert({
      title,
      content,
      user_id: userId,
      image_url: imageUrls[0] || '',
      images: imageUrls,
    })

    if (error) {
      console.error(error)
      setMessage('Có lỗi xảy ra khi đăng tin.')
    } else {
      setMessage('Đăng tin thành công!')
      setTitle('')
      setContent('')
      setImages([])
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Đăng tin</h1>

      <input
        type="text"
        placeholder="Tiêu đề"
        className="w-full p-2 border mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Nội dung chi tiết"
        className="w-full p-2 border mb-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input type="file" multiple onChange={handleFileChange} className="mb-2" />

      <div className="flex space-x-2 mb-2">
        {images.map((file, idx) => (
          <Image
            key={idx}
            src={URL.createObjectURL(file)}
            alt={`Ảnh ${idx}`}
            width={100}
            height={100}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Đăng tin
      </button>

      {message && (
        <p className={`mt-2 ${message.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
