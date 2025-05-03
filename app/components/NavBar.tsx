'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-50">
      <h1 className="font-bold text-lg">
        <a href="/">🏠 RaoAI</a>
      </h1>
      <div>
        {user ? (
          <>
            <span className="mr-4 text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <a
            href="/login"
            className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
          >
            Đăng nhập
          </a>
        )}
      </div>
    </div>
  );
}
