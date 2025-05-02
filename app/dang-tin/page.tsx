'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase'

export default function DangTinPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('posts').insert([
      {
        title,
        description,
      },
    ]);

    if (error) {
      alert('❌ Lỗi khi đăng tin: ' + error.message);
    } else {
      alert('✅ Tin đã được lưu vào Supabase!');
      setTitle('');
      setDescription('');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">📝 Đăng Tin Mới</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Đăng tin
          </button>
        </form>
      </div>
    </main>
  );
}
