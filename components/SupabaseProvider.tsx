'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import type { Database } from '@/types_db'  // <-- tùy dự án, nếu chưa có types thì tạm bỏ dòng này

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabaseClient] = useState(() => createPagesBrowserClient<Database>())  // hoặc bỏ <Database> nếu chưa khai báo

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}
