'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [listening, setListening] = useState(false)
  const [spokenText, setSpokenText] = useState('')
  const router = useRouter()

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return alert('Trình duyệt không hỗ trợ voice search!')

    const recognition = new SpeechRecognition()
    recognition.lang = 'vi-VN'

    recognition.onstart = () => {
      setListening(true)
      setSpokenText('')
    }

    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setSpokenText(text)
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6">
      <div className="flex flex-1 gap-2 w-full">
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

      {/* Gợi ý sau khi nói */}
      {spokenText && (
        <div className="text-sm text-gray-600 mt-1 italic">
          ✍️ Bạn vừa nói: <span className="font-semibold text-black">“{spokenText}”</span>
          <br />
          Bạn có thể sửa lại nếu chưa đúng.
        </div>
      )}
    </div>
  )
}
