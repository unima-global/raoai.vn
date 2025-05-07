'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DangTinPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const user = await supabase.auth.getUser()
    const user_id = user.data.user?.id
    if (!user_id) {
      alert('Bạn phải đăng nhập để đăng tin.')
      return
    }

    const uploadedUrls: string[] = []

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(uniqueName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          })

        if (uploadError) {
          console.error(uploadError)
          alert('Lỗi upload ảnh: ' + uploadError.message)
          return
        } else {
          const { data } = supabase.storage.from('images').getPublicUrl(uniqueName)
          if (data?.publicUrl) {
            uploadedUrls.push(data.publicUrl)
          }
        }
      }
    }

    const { error } = await supabase.from('posts').insert({
      title,
      description,
      location,
      category,
      user_id,
      status: 'active',
      images: uploadedUrls,
      created_at: new Date().toISOString()
    })

    if (error) {
      console.error(error)
      alert('Có lỗi xảy ra khi đăng tin.')
    } else {
      alert('Đăng tin thành công!')
      router.push('/')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Đăng tin</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Chọn danh mục</option>
          <option value="ban-nha">Bán nhà</option>
          <option value="nha-dat">Nhà đất</option>
          <option value="xe-co">Xe cộ</option>
          <option value="dien-thoai">Điện thoại</option>
          <option value="thoi-trang">Thời trang</option>
          <option value="oto">Ô tô</option>
          <option value="xe-may">Xe máy</option>
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
