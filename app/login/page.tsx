'use client';

import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const loginWithFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    });
  };

  return (
    <div className="p-4 max-w-sm mx-auto text-center">
      <h1 className="text-xl font-bold mb-6">🔐 Đăng nhập</h1>

      <button
        onClick={loginWithGoogle}
        className="bg-red-500 text-white px-4 py-2 w-full rounded mb-3"
      >
        Đăng nhập bằng Google
      </button>

      <button
        onClick={loginWithFacebook}
        className="bg-blue-600 text-white px-4 py-2 w-full rounded"
      >
        Đăng nhập bằng Facebook
      </button>
    </div>
  );
}
