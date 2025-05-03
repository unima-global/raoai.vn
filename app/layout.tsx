import './globals.css';

export const metadata = {
  title: 'RaoAI',
  description: 'Đăng tin rao vặt bằng AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
