'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function TinChiTiet() {
  const { id } = useParams();
  const supabase = createBrowserSupabaseClient();
  const [tin, setTin] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchTin() {
      const { data: tinData } = await supabase
        .from('posts')
        .select('id, title, description, created_at')
        .eq('id', id)
        .single();

      setTin(tinData || null);

      const { data: imageData } = await supabase
        .from('images')
        .select('url')
        .eq('post_id', id);

      setImages(imageData?.map((img) => img.url) || []);
      setLoading(false);
    }

    fetchTin();
  }, [id]);

  if (loading) return <p className="p-6">Đang tải...</p>;
  if (!tin) return <p className="p-6 text-red-600">Không tìm thấy tin đăng.</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{tin.title}</h1>
      <p className="text-gray-500 text-sm mb-4">
        Ngày đăng: {new Date(tin.created_at).toLocaleString('vi-VN')}
      </p>
      <p className="mb-4">{tin.description}</p>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Ảnh ${i + 1}`}
              className="rounded border object-cover h-40 w-full"
            />
          ))}
        </div>
      )}
    </main>
  );
}
