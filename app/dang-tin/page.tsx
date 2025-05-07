'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

export default function PostForm() {
  const [userId, setUserId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState('')
  const [images, setImages] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id)
    })
  }, [])

  const handleSubmit = async () => {
    if (!userId) return alert('Bạn cần đăng nhập để đăng tin.')
    if (!title || !description || !category) return alert('Vui lòng điền đầy đủ thông tin.')

    setLoading(true)

    const uploadedUrls: string[] = []

    if (images) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileName = `${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file)
        if (uploadError) {
          alert('Lỗi upload ảnh: ' + uploadError.message)
        } else {
          const url = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl
          uploadedUrls.push(url)
        }
      }
    }

    const { error } = await supabase.from('posts').insert({
      title,
      description,
      location: address,
      category,
      images: uploadedUrls,
      status: 'active',
      user_id: userId,
      created_at: new Date().toISOString()
    })

    setLoading(false)

    if (!error) {
      alert('Đăng tin thành công!')
      window.location.href = '/'
    } else {
      alert('Có lỗi xảy ra khi đăng tin: ' + error.message)
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
