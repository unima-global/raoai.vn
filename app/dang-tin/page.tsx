'use client';
import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function DangTinPage() {
  const supabase = createBrowserSupabaseClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    loadUser();
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImages(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  }

  async function handleSubmit() {
    if (!title || !description) {
      setMessage('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (!userId) {
      setMessage('Bạn cần đăng nhập để đăng tin.');
      return;
    }

    setUploading(true);
    setMessage('');

    const uploadedImages: string[] = [];

    for (const file of images) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (!uploadError) {
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        const url = data?.publicUrl;
        if (url) uploadedImages.push(url);
      }
    }

    const image_url = uploadedImages[0] || null;

    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([{ title, description, image_url, user_id: userId }])
      .select()
      .single();

    if (postError || !postData) {
      setMessage('Lỗi khi tạo bài đăng: ' + postError.message);
      setUploading(false);
      return;
    }

    for (const url of uploadedImages) {
      await supabase.from('images').insert([{ post_id: postData.id, url }]);
    }

    setTitle('');
    setDescription('');
    setImages([]);
    setPreviews([]);
    setMessage('✅ Đăng tin thành công!');
    setUploading(false);
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Đăng tin</h1>

      <input
        type="text"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <textarea
        placeholder="Mô tả chi tiết"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="w-full mb-2"
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
          {previews.map((src, i) => (
            <img key={i} src={src} alt={`Ảnh ${i + 1}`} className="rounded border object-cover h-32 w-full" />
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 w-full"
      >
        {uploading ? 'Đang tải...' : 'Đăng tin'}
      </button>

      {message && <p className="mt-3 text-green-600">{message}</p>}
    </main>
  );
}
