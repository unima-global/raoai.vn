'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function DangTinPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user.id || null);
    };
    getSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('❌ Bạn phải đăng nhập trước khi đăng tin!');
      return;
    }

    let image_url = null;

    if (image) {
      setUploading(true);

      const safeFileName = image.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9.\-]/g, '');

      const filePath = `images/${Date.now()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, image);

      if (uploadError) {
        alert('❌ Lỗi khi upload ảnh: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      image_url = data.publicUrl;
      setUploading(false);
    }

    const { error } = await supabase.from('posts').insert([
      {
        title,
        description,
        image_url,
        user_id: userId,
      },
    ]);

    if (error) {
      alert('❌ Lỗi khi đăng tin: ' + error.message);
    } else {
      alert('✅ Tin đã được đăng!');
      setTitle('');
      setDescription('');
      setImage(null);
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
          <div>
            <label className="block text-sm font-medium">Ảnh (tuỳ chọn)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="mt-1"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {uploading ? 'Đang upload ảnh...' : 'Đăng tin'}
          </button>
        </form>
      </div>
    </main>
  );
}
