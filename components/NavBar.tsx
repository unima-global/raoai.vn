'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email || null);
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
