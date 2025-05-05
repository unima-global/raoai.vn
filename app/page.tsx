'use client';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('posts').select('*').limit(10);
      setPosts(data || []);
    }
    load();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tin đăng mới</h1>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/tin/${post.id}`} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
// force update
