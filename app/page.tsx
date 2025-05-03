'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      setPosts(data || []);
      setLoading(false);
    };

    fetchAllPosts();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📰 Tin mới đăng</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : posts.length === 0 ? (
        <p>Chưa có bài nào.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="border p-4 mb-4 rounded shadow">
            <h2 className="font-semibold text-lg">{post.title}</h2>
            <p className="text-gray-500 text-sm">
              {new Date(post.created_at).toLocaleString()}
            </p>
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
