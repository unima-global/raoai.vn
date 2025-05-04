'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function DangTinPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      alert('Bạn chưa đăng nhập!');
      return;
    }

    setUploading(true);
    let image_url = null;

    if (image) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, image);

      if (uploadError) {
        alert('Lỗi upload ảnh: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      image_url = data?.publicUrl || null;
    }

    const { error } = await supabase.from('posts').insert([
      {
        title,
        description,
        image_url,
        user_id: userId,
      },
    ]);

    setUploading(false);

    if (error) {
      alert('Lỗi khi đăng tin: ' + error.message);
    } else {
      alert('✅ Đăng thành công!');
      router.push('/tin-cua-toi');
    }
  };

  const handleGoiYTieuDe = async () => {
    if (!description) {
      alert('Nhập mô tả trước khi gợi ý');
      return;
    }

    const res = await fetch('/api/gpt/goi-y-tieu-de', {
      method: 'POST',
      body: JSON.stringify({ prompt: description }),
    });

    const data = await res.json();
    if (data.result) {
      setTitle(data.result);
    } else {
      alert('Không nhận được gợi ý');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">📝 Đăng tin mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tiêu đề"
          className="border p-2 w-full"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Mô tả"
          className="border p-2 w-full"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={handleGoiYTieuDe}
          className="bg-purple-600 text-white px-4 py-1 rounded text-sm"
        >
          💡 Gợi ý tiêu đề bằng AI
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {uploading ? 'Đang gửi...' : 'Đăng tin'}
        </button>
      </form>
    </div>
  );
}
