'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Đang gửi magic link...');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'https://raoai.vn/login',
      },
    });

    if (error) {
      setStatus('❌ Lỗi: ' + error.message);
    } else {
      setStatus('✅ Đã gửi magic link đến email, hãy kiểm tra hộp thư!');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">🔐 Đăng nhập bằng email</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="example@email.com"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Gửi magic link
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
      </div>
    </main>
  );
}
