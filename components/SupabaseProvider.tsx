'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}
