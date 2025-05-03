import './globals.css';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'RaoAI',
  description: 'Đăng tin rao vặt bằng AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
