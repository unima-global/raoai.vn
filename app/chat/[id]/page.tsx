'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

type Message = {
  id: number
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export default function ChatPage() {
  const supabase = createPagesBrowserClient()
  const params = useParams()
  const receiverId = params.id as string
  const [messages, setMessages] = useState<Message[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      if (uid) setUserId(uid)
    }

    getSession()
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return

      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true })

      if (data) setMessages(data)
    }

    fetchMessages()
  }, [userId, receiverId])

  const sendMessage = async () => {
    if (!input.trim() || !userId) return

    await supabase.from('messages').insert({
      sender_id: userId,
      receiver_id: receiverId,
      content: input.trim(),
    })

    setInput('')
    // Tải lại tin nhắn
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true })

    if (data) setMessages(data)

    // Cuộn xuống cuối
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Tin nhắn</h1>

      <div className="h-[400px] overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded max-w-[80%] ${
              msg.sender_id === userId ? 'bg-blue-100 ml-auto' : 'bg-gray-200'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <p className="text-xs text-right text-gray-500">{new Date(msg.created_at).toLocaleTimeString()}</p>
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Gửi
        </button>
      </div>
    </div>
  )
}
