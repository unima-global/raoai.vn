export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
