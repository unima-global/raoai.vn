'use client'

import { useEffect, useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'

export default function DangTin() {
  const supabase = createPagesBrowserClient()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
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

    setLoading(true)
    setMessage('')

    try {
      const imageUrls: string[] = []
      for (const file of images) {
        const { data, error } = await supabase.storage
          .from('images')
          .upload(`public/${Date.now()}-${file.name}`, file)

        if (error) throw new Error('Lỗi upload ảnh: ' + error.message)

        const url = supabase.storage.from('images').getPublicUrl(data.path).data.publicUrl
        imageUrls.push(url)
      }

      const { error } = await supabase.from('posts').insert({
        title,
        content,
        location,
        category: category.toLowerCase().replaceAll(' ', '-'),
        user_id: userId,
        image_url: imageUrls[0] || '',
        images: imageUrls,
      })

      if (error) throw new Error('Lỗi Supabase: ' + error.message)

      setMessage('✅ Đăng tin thành công!')
      setTitle('')
      setContent('')
      setLocation('')
      setImages([])
      setCategory('')
    } catch (err: any) {
      setMessage(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
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

      <input
        type="text"
        placeholder="Địa chỉ"
        className="w-full p-2 border mb-2"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <select
        className="w-full p-2 border mb-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">-- Chọn danh mục --</option>
        <option value="nhà đất">Nhà đất</option>
        <option value="ô tô">Ô tô</option>
        <option value="điện thoại">Điện thoại</option>
      </select>

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
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } transition`}
      >
        {loading ? 'Đang đăng...' : 'Đăng tin'}
      </button>

      {message && (
        <p className={`mt-2 ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
