'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function TinCuaToiPage() {
  const supabase = createBrowserSupabaseClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndPosts() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserId(null);
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from('posts')
        .select('id, title, description, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPosts(data || []);
      setLoading(false);
    }

    fetchUserAndPosts();
  }, []);

  if (loading) return <p className="p-6">Đang tải...</p>;

  if (!userId)
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold text-red-600">
          Bạn cần đăng nhập để xem tin của mình.
        </h1>
      </main>
    );

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tin của tôi</h1>

      {posts.length === 0 ? (
        <p>Chưa có tin nào.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="border rounded p-3">
              <Link href={`/tin/${post.id}`} className="text-blue-600 font-semibold hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-gray-600">
                {new Date(post.created_at).toLocaleString('vi-VN')}
              </p>
              <p className="text-sm mt-1 text-gray-800">
                {post.description.slice(0, 100)}...
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
