'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function DanhMucPage() {
  const { slug } = useParams();
  const supabase = createBrowserSupabaseClient();
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      const { data: currentCat } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      setCategory(currentCat);

      let categoryIds: string[] = [];

      if (currentCat) {
        const { data: subCats } = await supabase
          .from('categories')
          .select('id')
          .eq('parent_id', currentCat.id);

        if (subCats && subCats.length > 0) {
          categoryIds = subCats.map((c) => c.id);
        } else {
          categoryIds = [currentCat.id]; // là danh mục con
        }

        const { data: postData } = await supabase
          .from('posts')
          .select('id, title, description, created_at')
          .in('category_id', categoryIds)
          .order('created_at', { ascending: false });

        setPosts(postData || []);
      }

      setLoading(false);
    }

    fetchData();
  }, [slug]);

  if (loading) return <p className="p-6">Đang tải...</p>;
  if (!category) return <p className="p-6 text-red-600">Không tìm thấy danh mục.</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tin trong: {category.name}</h1>

      {posts.length === 0 ? (
        <p>Không có tin nào.</p>
      ) : (
        <ul className="grid gap-4">
          {posts.map((post) => (
            <li key={post.id} className="border rounded p-4">
              <Link href={`/tin/${post.id}`} className="text-blue-600 text-lg font-semibold hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-gray-600">{new Date(post.created_at).toLocaleString('vi-VN')}</p>
              <p className="text-sm mt-1">{post.description.slice(0, 100)}...</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
