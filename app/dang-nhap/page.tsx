'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function DangNhap() {
  const supabase = createPagesBrowserClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://raoai.vn', // hoặc domain đang dùng
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-2 rounded text-lg"
      >
        Đăng nhập với Google
      </button>
    </div>
  )
}
