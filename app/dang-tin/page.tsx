'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function DangTinPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const id = data.session?.user?.id || null;
      if (!id) {
        router.push('/login'); // Redirect nếu chưa login
      } else {
        setUserId(id);
      }
    };
    getSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return;

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
        alert('❌ Upload ảnh lỗi: ' + uploadError.message);
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
        <h1 className="text-2xl font-bold mb-4">📝 Đăng Tin Mới</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Tiêu đề"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Mô tả"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="block"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {uploading ? 'Đang upload...' : 'Đăng tin'}
          </button>
        </form>
      </div>
    </main>
  );
}
