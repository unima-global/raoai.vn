'use client'

import { useRef, useState } from 'react'

export default function TraLoiAIPage() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const speak = (text: string) => {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'vi-VN'
    utterance.pitch = 1.2
    utterance.rate = 1
    synth.speak(utterance)
  }

  const handleListen = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Trình duyệt không hỗ trợ nhận diện giọng nói')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'vi-VN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setPrompt(transcript)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const fetchGPT = async () => {
    if (!prompt.trim()) {
      alert('❗Bạn chưa nói gì!')
      return
    }

    setResponse('⏳ Đang nghĩ câu trả lời...')
    try {
      const res = await fetch('/api/gpt/goi-y-tieu-de', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!data.response) {
        setResponse('❌ Không có phản hồi từ AI')
        return
      }
      setResponse(data.response)
      speak(data.response)
    } catch (err) {
      setResponse('⚠️ Có lỗi khi gọi GPT')
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">🧠 Hỏi AI bằng giọng nói</h1>

      <div className="flex gap-2">
        <input
          className="border border-gray-300 p-2 rounded flex-1"
          placeholder="Bạn muốn hỏi gì?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleListen}
          className={`px-4 py-2 rounded text-white ${
            listening ? 'bg-red-600' : 'bg-blue-600'
          }`}
        >
          {listening ? '🎙️ Đang nghe' : '🎤 Mic'}
        </button>
      </div>

      <button
        onClick={fetchGPT}
        className="bg-green-600 text-white w-full py-2 rounded font-semibold"
      >
        🚀 Gửi câu hỏi cho AI
      </button>

      {response && (
        <div className="bg-gray-100 p-4 rounded">
          <strong className="block mb-1 text-gray-700">🤖 AI trả lời:</strong>
          <p>{response}</p>
        </div>
      )}
    </main>
  )
}
