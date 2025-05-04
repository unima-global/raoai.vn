'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuaTinPage() {
  const router = useRouter();
  const params = useSearchParams();
  const postId = params.get('id');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error || !data) {
        alert('Không tìm thấy bài viết');
        router.push('/tin-cua-toi');
        return;
      }

      setTitle(data.title);
      setDescription(data.description);
      setImageUrl(data.image_url);
    };

    fetchPost();
  }, [postId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImageUrl = imageUrl;

    if (image) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, image);

      if (uploadError) {
        alert('Lỗi upload ảnh: ' + uploadError.message);
        return;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      finalImageUrl = data?.publicUrl || null;
    }

    const { error } = await supabase.from('posts').update({
      title,
      description,
      image_url: finalImageUrl,
    }).eq('id', postId);

    if (error) {
      alert('Lỗi khi cập nhật: ' + error.message);
    } else {
      alert('✅ Cập nhật thành công!');
      router.push('/tin-cua-toi');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">✏️ Sửa bài đăng</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
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
        {imageUrl && (
          <img src={imageUrl} alt="ảnh hiện tại" className="rounded" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Cập nhật bài
        </button>
      </form>
    </div>
  );
}
