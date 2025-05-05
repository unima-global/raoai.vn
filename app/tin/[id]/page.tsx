import { createClient } from '@/utils/supabase/server';

export default async function TinChiTiet({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: tin, error } = await supabase
    .from('posts')
    .select('id, title, description, created_at')
    .eq('id', params.id)
    .single();

  if (error || !tin) {
    return (
      <main className="p-6 max-w-xl mx-auto">
        <h1 className="text-xl font-bold text-red-600">Không tìm thấy tin đăng</h1>
      </main>
    );
  }

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
