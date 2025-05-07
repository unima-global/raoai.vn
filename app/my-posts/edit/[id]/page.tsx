'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<'active' | 'hidden'>('active')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/posts/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || '')
        setStatus(data.status || 'active')
        setLoading(false)
      })
  }, [params.id])

  const handleUpdate = async () => {
    const res = await fetch(`/api/posts/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status })
    })

    if (res.ok) {
      router.push('/my-posts')
    }
  }

  if (loading) return <p className="p-6">Đang tải bài viết...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">✏️ Chỉnh sửa bài viết</h1>
      <label className="block mb-2 font-medium">Tiêu đề</label>
      <input
        type="text"
        className="w-full border px-3 py-2 rounded mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="block mb-2 font-medium">Trạng thái</label>
      <select
        className="w-full border px-3 py-2 rounded mb-4"
        value={status}
        onChange={(e) => setStatus(e.target.value as 'active' | 'hidden')}
      >
        <option value="active">✅ Đang hiển thị</option>
        <option value="hidden">🕒 Ẩn</option>
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
