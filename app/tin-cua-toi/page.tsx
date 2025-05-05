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

      const { data: postData } = await supabase
        .from('posts')
        .select('id, title, description, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Lấy ảnh đầu tiên cho mỗi tin
      const enrichedPosts = await Promise.all(
        (postData || []).map(async (post) => {
          const { data: images } = await supabase
            .from('images')
            .select('url')
            .eq('post_id', post.id)
            .limit(1);
          return {
            ...post,
            image: images?.[0]?.url || null,
          };
        })
      );

      setPosts(enrichedPosts);
      setLoading(false);
    }

    fetchUserAndPosts();
  }, []);

  async function handleDelete(postId: string) {
    const confirm = window.confirm('Bạn có chắc muốn xoá tin này?');
    if (!confirm) return;

    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  }

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
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tin của tôi</h1>

      {posts.length === 0 ? (
        <p>Chưa có tin nào.</p>
      ) : (
        <ul className="grid gap-4">
          {posts.map((post) => (
            <li key={post.id} className="border rounded p-4 flex gap-4">
              {post.image ? (
                <img
                  src={post.image}
                  alt="Ảnh"
                  className="w-24 h-24 object-cover rounded border"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded text-center flex items-center justify-center text-sm text-gray-500">
                  Không ảnh
                </div>
              )}

              <div className="flex-1">
                <Link href={`/tin/${post.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                  {post.title}
                </Link>
                <p className="text-sm text-gray-600">
                  {new Date(post.created_at).toLocaleString('vi-VN')}
                </p>
                <p className="text-sm mt-1 text-gray-800">
                  {post.description.slice(0, 100)}...
                </p>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => alert('Chức năng sửa sẽ cập nhật sau')}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
