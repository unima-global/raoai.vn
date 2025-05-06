'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [listening, setListening] = useState(false)

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return alert('Trình duyệt không hỗ trợ voice search!')

    const recognition = new SpeechRecognition()
    recognition.lang = 'vi-VN'

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

recognition.onresult = (e: SpeechRecognitionEvent) => {      const text = e.results[0][0].transcript
      setQuery(text)
    }

    recognition.start()
  }

  return (
    <div className="flex items-center space-x-2 max-w-xl mx-auto p-4">
      <input
        type="text"
        placeholder="Tìm gì đó..."
        className="w-full p-2 border rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        onClick={handleVoice}
        className={`px-2 py-2 rounded ${listening ? 'bg-red-500' : 'bg-gray-300'}`}
        title="Tìm bằng giọng nói"
      >
        🎤
      </button>
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Tìm kiếm
      </button>
    </div>
  )
}
