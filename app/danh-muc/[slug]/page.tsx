'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function DanhMucPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const { slug } = useParams();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function load() {
      const { data: parentCat } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      setCategory(parentCat);

      const { data: subCats } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', parentCat?.id);

      const subCatIds = subCats?.map((c) => c.id) || [];

      const { data: posts } = await supabase
        .from('posts')
        .select('id, title')
        .in('category_id', subCatIds)
        .order('created_at', { ascending: false });

      setPosts(posts || []);
    }

    if (slug) load();
  }, [slug]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tin trong danh mục: {category?.name || 'Đang tải...'}
      </h1>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  );
}
// force update
