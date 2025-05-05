'use client';
import { useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function DangTinPage() {
  const supabase = createBrowserSupabaseClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImages(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  }

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      setMessage('Vui lòng nhập tiêu đề và mô tả.');
      return;
    }

    setUploading(true);
    setMessage('');

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage('Bạn cần đăng nhập để đăng tin.');
      setUploading(false);
      return;
    }

    const uploadedImages: string[] = [];

    for (const file of images) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
        const url = urlData?.publicUrl;
        if (url) uploadedImages.push(url);
      }
    }

    const image_url = uploadedImages[0] || null;

    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([
        {
          title,
          description,
          image_url,
          user_id: user.id, // Đã fix gán đúng user_id
        },
      ])
      .select()
      .single();

    if (postError || !postData) {
      setMessage('Lỗi khi tạo bài đăng: ' + postError?.message);
      setUploading(false);
      return;
    }

    // Lưu các ảnh còn lại
    for (const url of uploadedImages) {
      await supabase.from('images').insert([{ post_id: postData.id, url }]);
    }

    setUploading(false);
    setMessage('✅ Đăng tin thành công!');
    setTitle('');
    setDescription('');
    setImages([]);
    setPreviews([]);
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Đăng tin với nhiều ảnh</h1>

      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Mô tả chi tiết"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="block font-semibold mb-1">Chọn nhiều ảnh:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Ảnh ${i + 1}`}
                className="rounded border object-cover h-32 w-full"
              />
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Đang tải...' : 'Đăng tin'}
        </button>

        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>
    </main>
  );
}
