'use client'

import { useEffect, useState, useRef } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

type Message = {
  id: number
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export default function ChatPopup({ receiverId, onClose }: { receiverId: string; onClose: () => void }) {
  const supabase = createPagesBrowserClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
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
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true })

    if (data) setMessages(data)
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md bg-white border shadow-lg rounded-lg z-50 flex flex-col">
      <div className="flex justify-between items-center p-3 border-b bg-gray-100">
        <h2 className="font-semibold text-sm">Trò chuyện với người bán</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-sm">✕</button>
      </div>

      <div className="flex-1 h-64 overflow-y-auto p-3 bg-gray-50">
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

      <div className="flex p-2 border-t gap-2">
        <input
          type="text"
          value={input}
          placeholder="Nhắn gì đó..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-2 py-1 border rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          Gửi
        </button>
      </div>
    </div>
  )
}
