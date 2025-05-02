import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from '../components/NavBar'; // đường dẫn tương đối

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'raoai.vn',
  description: 'Nền tảng rao vặt thông minh',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
