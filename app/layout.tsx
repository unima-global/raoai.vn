// app/layout.tsx

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'raoai.vn',
  description: 'Nền tảng rao vặt thông minh',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
