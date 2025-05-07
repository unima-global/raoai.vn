'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditPostPage() {
  const { id } = useParams()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'active' | 'hidden' | 'sold'>('active')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || '')
        setDescription(data.description || '')
        setStatus(data.status || 'active')
        setLoading(false)
      })
  }, [id])

  const handleUpdate = async () => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status })
    })

    if (res.ok) {
      router.push('/tin-cua-toi')
    } else {
      alert('Cập nhật thất bại.')
    }
  }

  if (loading) return <p className="p-6">Đang tải bài viết...</p>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">✏️ Chỉnh sửa bài viết</h1>

      <label className="block mb-1 font-medium">Tiêu đề</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
      />

      <label className="block mb-1 font-medium">Nội dung chi tiết</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
      />

      <label className="block mb-1 font-medium">Trạng thái</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as 'active' | 'hidden' | 'sold')}
        className="w-full border px-3 py-2 mb-4 rounded"
      >
        <option value="active">✅ Đang hiển thị</option>
        <option value="hidden">🙈 Ẩn tin</option>
        <option value="sold">✔️ Đã bán</option>
      </select>

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Lưu thay đổi
      </button>
    </div>
  )
}
