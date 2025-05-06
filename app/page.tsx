'use client'

import { useEffect, useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

type Category = {
  id: number
  name: string
  slug: string
}

export default function HomePage() {
  const supabase = createPagesBrowserClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [query, setQuery] = useState('')
  const [listening, setListening] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*')
      if (data) setCategories(data)
    }

    fetchCategories()
  }, [])

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Trình duyệt không hỗ trợ tìm kiếm bằng giọng nói!')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'vi-VN'

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setQuery(text)
    }

    recognition.start()
  }

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Tìm gì đó..."
          className="w-full h-10 px-3 border rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleVoice}
          className={`h-10 px-3 rounded ${listening ? 'bg-red-500' : 'bg-gray-300'}`}
          title="Tìm bằng giọng nói"
        >
          🎤
        </button>
        <button
          onClick={handleSearch}
          className="h-10 bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
        >
          Tìm
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Danh mục nổi bật</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="p-4 border rounded shadow-sm">
            <h3 className="font-bold text-blue-700">{cat.name}</h3>
            <p className="text-sm text-gray-500">Không có tin nào.</p>
            <Link
              href={`/danh-muc/${cat.slug}`}
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              Xem tất cả →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
