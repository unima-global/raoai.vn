'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

const supabase = createClientComponentClient()

export default function DangTinPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return alert('Bạn phải đăng nhập để đăng tin.')
    if (!title || !description || !category) return alert('Vui lòng nhập đủ thông tin.')

    const uploadedUrls: string[] = []

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          })

        if (uploadError) {
          alert('Lỗi khi upload ảnh: ' + uploadError.message)
          return
        }

        const { data } = supabase.storage.from('images').getPublicUrl(fileName)
        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl)
        }
      }
    }

    console.log('Ảnh upload xong:', uploadedUrls)

    if (uploadedUrls.length === 0) {
      alert('Bạn phải tải lên ít nhất 1 ảnh.')
      return
    }

    const { error } = await supabase.from('posts').insert({
      title,
      description,
      location,
      category,
      images: uploadedUrls,
      user_id: userId,
      status: 'active',
      created_at: new Date().toISOString()
    })

    if (error) {
      alert('Lỗi khi đăng tin: ' + error.message)
    } else {
      alert('Đăng tin thành công!')
      router.push('/')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Đăng tin</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Mô tả chi tiết"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Chọn danh mục --</option>
          <option value="ban-nha">Bán nhà</option>
          <option value="nha-dat">Nhà đất</option>
          <option value="oto">Ô tô</option>
          <option value="xe-may">Xe máy</option>
          <option value="dien-thoai">Điện thoại</option>
          <option value="thoi-trang">Thời trang</option>
          <option value="cho-thue">Cho thuê</option>
          <option value="dich-vu">Dịch vụ</option>
        </select>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Đăng tin
        </button>
      </form>
    </div>
  )
}
