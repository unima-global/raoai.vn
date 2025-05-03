'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
}

export default function TinCuaToiPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchSessionAndPosts = async () => {
      const { data } = await supabase.auth.getSession();
      const id = data.session?.user?.id || null;

      if (!id) {
        router.push('/login');
        return;
      }

      setUserId(id);

      const { data: userPosts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (!error) setPosts(userPosts || []);
      setLoading(false);
    };

    fetchSessionAndPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📋 Tin của tôi</h1>

        {loading ? (
          <p>🔄 Đang tải...</p>
        ) : posts.length === 0 ? (
          <p>🙁 Bạn chưa đăng tin nào.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="bg-white p-4 rounded shadow">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="mb-3 w-full rounded object-cover max-h-64"
                  />
                )}
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-gray-700">{post.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  🕒 {new Date(post.created_at).toLocaleString('vi-VN')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
