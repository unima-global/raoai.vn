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
    synth.speak(utterance)
  }

  const handleListen = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Trình duyệt không hỗ trợ Web Speech API')
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
      const text = event.results[0][0].transcript
      setPrompt(text)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const fetchGPT = async () => {
    if (!prompt) return

    const res = await fetch('/api/gpt/goi-y-tieu-de', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()
    setResponse(data.response)
    speak(data.response)
  }

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🧠 Hỏi AI bằng giọng nói</h1>

      <div className="flex gap-2 mb-2">
        <input
          className="border border-gray-300 p-2 flex-1"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Bạn muốn hỏi gì?"
        />
        <button onClick={handleListen} className="bg-blue-500 text-white px-3">
          {listening ? '🎙️...' : 'Mic'}
        </button>
      </div>

      <button
        onClick={fetchGPT}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        💬 Gửi cho AI
      </button>

      {response && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <div className="font-medium mb-1">🤖 AI trả lời:</div>
          <p>{response}</p>
        </div>
      )}
    </main>
  )
}
