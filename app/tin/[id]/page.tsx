'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function TinChiTiet() {
  const { id } = useParams();
  const supabase = createBrowserSupabaseClient();
  const [tin, setTin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchTin() {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, description, created_at')
        .eq('id', id)
        .single();

      setTin(data || null);
      setLoading(false);
    }
    fetchTin();
  }, [id]);

  if (loading) return <p className="p-6">Đang tải...</p>;
  if (!tin) return <p className="p-6 text-red-600">Không tìm thấy tin đăng.</p>;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{tin.title}</h1>
      <p className="text-gray-500 text-sm mb-4">
        Ngày đăng: {new Date(tin.created_at).toLocaleString('vi-VN')}
      </p>
      <p>{tin.description}</p>
    </main>
  );
}
