'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function HomePage() {
  const supabase = createBrowserSupabaseClient();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data: parents } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('name');

      setCategories(parents || []);
    }

    fetchCategories();
  }, []);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Danh mục nổi bật</h1>

      <div className="grid gap-8">
        {categories.map((cat) => (
          <CategoryGroup key={cat.id} category={cat} />
        ))}
      </div>
    </main>
  );
}

function CategoryGroup({ category }: { category: any }) {
  const supabase = createBrowserSupabaseClient();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data: subCats } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', category.id);

      const subCatIds = subCats?.map((c) => c.id) || [];

      const { data: postData } = await supabase
        .from('posts')
        .select('id, title')
        .in('category_id', subCatIds)
        .order('created_at', { ascending: false })
        .limit(4);

      setPosts(postData || []);
    }

    fetchPosts();
  }, [category.id]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{category.name}</h2>
        <Link href={`/danh-muc/${category.slug}`} className="text-sm text-blue-600 hover:underline">
          Xem tất cả →
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">Không có tin nào.</p>
      ) : (
        <ul className="space-y-1">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/tin/${post.id}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
