'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const supabase = createPagesBrowserClient()

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setLoggedIn(!!data.session)
    }
    getSession()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-700">
          RaoAI
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/dang-tin"
            className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition"
          >
            + Đăng tin
          </Link>

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Đăng xuất
            </button>
          ) : (
            <Link href="/dang-nhap" className="text-sm text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
