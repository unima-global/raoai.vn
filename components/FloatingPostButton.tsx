'use client'

import Link from 'next/link'

export default function FloatingPostButton() {
  return (
    <Link
      href="/dang-tin"
      className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all"
    >
      + Đăng tin
    </Link>
  )
}
