import './globals.css';
import { Inter } from 'next/font/google';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

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

function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email || null;
      setUserEmail(email);
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="w-full bg-gray-100 text-sm text-right px-6 py-2 text-gray-700">
      {userEmail ? (
        <>
          👤 {userEmail} |{' '}
          <button onClick={handleLogout} className="text-blue-600 hover:underline">
            Đăng xuất
          </button>
        </>
      ) : (
        <a href="/login" className="text-blue-600 hover:underline">
          Đăng nhập
        </a>
      )}
    </div>
  );
}
