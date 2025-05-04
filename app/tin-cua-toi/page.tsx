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
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPosts(data || []);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Bạn chắc chắn muốn xoá bài này?');
    if (!confirm) return;

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      alert('Lỗi khi xoá: ' + error.message);
    } else {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🗂 Tin của tôi</h1>
      {loading ? (
        <p>⏳ Đang tải...</p>
      ) : posts.length === 0 ? (
        <p>😔 Bạn chưa đăng tin nào.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="border p-4 mb-4 rounded relative">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </p>
            <p className="mt-2">{post.description}</p>
            {post.image_url && (
              <img src={post.image_url} alt="ảnh" className="mt-2 rounded" />
            )}
            <button
              onClick={() => handleDelete(post.id)}
              className="absolute top-2 right-2 text-red-600 hover:underline text-sm"
            >
              Xoá
            </button>
          </div>
        ))
      )}
    </div>
  );
}
