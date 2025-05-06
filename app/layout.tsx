import './globals.css'
import Navbar from '../components/NavBar'
import FloatingPostButton from '../components/FloatingPostButton'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Navbar />
        {children}
        <FloatingPostButton />
      </body>
    </html>
  )
}
