// app/layout.tsx

export const metadata = {
  title: "raoai.vn",
  description: "Nền tảng rao vặt thông minh",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
