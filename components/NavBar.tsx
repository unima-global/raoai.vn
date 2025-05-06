'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function NavBar() {
  const supabase = createPagesBrowserClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        setUserEmail(session.user.email)
      }
    }

    fetchSession()

    // Nếu có ?code= từ Supabase redirect → ép reload sau khi login
    if (typeof window !== 'undefined' && window.location.href.includes('?code=')) {
      fetchSession().then(() => {
        setTimeout(() => {
          window.location.href = '/' // hoặc location.reload()
        }, 500)
      })
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  return (
    <nav className="flex justify-between items-center px-4 py-2 border-b shadow-sm bg-white">
      <Link href="/" className="text-xl font-bold text-blue-600">RaoAI</Link>
      <div className="flex items-center space-x-4">
        {userEmail ? (
          <>
            <span className="text-sm text-gray-700">{userEmail}</span>
            <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded">Đăng xuất</button>
          </>
        ) : (
          <>
            <Link href="/dang-nhap" className="text-blue-600 hover:underline">Đăng nhập</Link>
            <Link href="/dang-ky" className="text-blue-600 hover:underline">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  )
}
