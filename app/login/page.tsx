
'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const handleLogin = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    setMessage(error ? 'Lỗi đăng nhập' : '📩 Đã gửi email đăng nhập!')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Đăng nhập</h1>
      <form onSubmit={handleLogin} className="space-y-2">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border" placeholder="Email" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Gửi link</button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  )
}
