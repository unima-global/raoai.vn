'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PostForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState('')
  const [images, setImages] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title || !description || !category) return alert('Vui lòng điền đầy đủ')

    setLoading(true)

    const uploadedUrls: string[] = []

    if (images) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileName = `${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage.from('images').upload(fileName, file)

        if (error) {
          console.error('Upload error:', error.message)
        } else {
          const url = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl
          uploadedUrls.push(url)
        }
      }
    }

    const { error } = await supabase.from('posts').insert({
      title,
      description,
      category,
      location: address,
      images: uploadedUrls,
      status: 'active',
      created_at: new Date().toISOString()
    })

    setLoading(false)

    if (!error) {
      alert('Đăng tin thành công!')
      window.location.href = '/'
    } else {
      alert('Có lỗi xảy ra khi đăng tin.')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Đăng tin</h1>

      <input
        type="text"
        placeholder="Tiêu đề"
        className="w-full border px-3 py-2 mb-3 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Nội dung chi tiết"
        className="w-full border px-3 py-2 mb-3 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Địa chỉ"
        className="w-full border px-3 py-2 mb-3 rounded"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <select
        className="w-full border px-3 py-2 mb-3 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">-- Chọn danh mục --</option>
        <option value="nha-dat">Nhà đất</option>
        <option value="oto">Ô tô</option>
        <option value="dien-thoai">Điện thoại</option>
        <option value="xe-may">Xe máy</option>
        <option value="ban-nha">Bán nhà</option>
        <option value="dich-vu">Dịch vụ</option>
        <option value="cho-thue">Cho thuê</option>
        <option value="thoi-trang">Thời trang</option>
      </select>

      <input
        type="file"
        accept="image/*"
        multiple
        className="mb-4"
        onChange={(e) => setImages(e.target.files)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Đang đăng...' : 'Đăng tin'}
      </button>
    </div>
  )
}
