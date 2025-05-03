'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
    console.log('🚀 useEffect ĐÃ CHẠY');

    const fetchPosts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const id = user?.id || null;
      console.log("🧠 user_id hiện tại:", id);

      if (!id) {
        router.push('/login');
        return;
      }

      setUserId(id);

      const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      console.log('📦 Posts fetch được:', posts);

      setPosts(posts || []);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🗂 Tin của tôi</h1>
      {loading ? (
        <p>⏳ Đang tải...</p>
      ) : posts.length === 0 ? (
        <p>😔 Bạn chưa đăng tin nào.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="border p-4 mb-4 rounded">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
            <p className="mt-2">{post.description}</p>
            {post.image_url && (
              <img src={post.image_url} alt="ảnh" className="mt-2 rounded" />
            )}
          </div>
        ))
      )}
    </div>
  );
}
