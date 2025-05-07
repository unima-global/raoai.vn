'use client'
import { useState } from 'react'

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function SearchBar() {
  const [keyword, setKeyword] = useState('')

  const handleSearch = () => {
    if (!keyword.trim()) return
    window.location.href = `/tim-kiem?tu-khoa=${encodeURIComponent(keyword)}`
  }

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return alert('Trình duyệt không hỗ trợ voice search!')

    const recognition = new SpeechRecognition()
    recognition.lang = 'vi-VN'
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setKeyword(text)
    }
    recognition.start()
  }

  return (
    <div className="flex items-center gap-2 mt-6 mb-8 justify-center px-4">
      <input
        type="text"
        className="border px-4 py-2 rounded w-full max-w-md"
        placeholder="Tìm gì đó..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleVoice} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
        🎤
      </button>
      <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Tìm
      </button>
    </div>
  )
}
