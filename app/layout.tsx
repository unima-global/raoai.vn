export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
        {children}
      </body>
    </html>
  )
}
