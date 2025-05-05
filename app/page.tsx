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
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Danh mục nổi bật</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </main>
  );
}

function CategoryCard({ category }: { category: any }) {
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
        .select('id, title, image_url')
        .in('category_id', subCatIds)
        .order('created_at', { ascending: false })
        .limit(4);

      setPosts(postData || []);
    }

    fetchPosts();
  }, [category.id]);

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      {category.image_url && (
        <img
          src={category.image_url}
          alt={category.name}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">{category.name}</h2>
          <Link href={`/danh-muc/${category.slug}`} className="text-sm text-blue-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-gray-500">Không có tin nào.</p>
        ) : (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li key={post.id} className="flex gap-3">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded border"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    Không ảnh
                  </div>
                )}
                <div>
                  <Link href={`/tin/${post.id}`} className="text-blue-600 font-medium hover:underline">
                    {post.title}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
