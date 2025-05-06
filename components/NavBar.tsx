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
      setUserEmail(session?.user?.email ?? null)
    }

    fetchSession()

    // Reload sau khi đăng nhập Google
    if (typeof window !== 'undefined' && window.location.href.includes('?code=')) {
      fetchSession().then(() => {
        setTimeout(() => {
          window.location.href = '/'
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
        <Link
          href="/dang-tin"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Đăng tin
        </Link>

        {userEmail ? (
          <>
            <span className="text-sm text-gray-700">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Đăng xuất
            </button>
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
