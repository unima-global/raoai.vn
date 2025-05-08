'use client';

import { useEffect, useState } from 'react';

export default function TinCuaToi() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user-posts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setError('Dữ liệu trả về không hợp lệ');
        }
      })
      .catch(err => {
        console.error('Lỗi khi tải tin:', err);
        setError('Không thể tải dữ liệu');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Tin của tôi</h1>

      {loading && <p className="text-gray-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}
      {!loading && posts.length === 0 && !error && (
        <p className="text-gray-600">Bạn chưa đăng tin nào.</p>
      )}

      {posts.map(post => (
        <div
          key={post.id}
          className="mb-6 border rounded shadow-sm p-4 bg-white"
        >
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="rounded w-full h-auto max-h-[400px] object-cover mb-2"
            />
          )}

          <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
          <p className="text-sm text-gray-500">
            Ngày đăng: {new Date(post.created_at).toLocaleString()}
          </p>
          <p className="mt-1">
            Trạng thái:{' '}
            {post.status === 'active' ? (
              <span className="text-green-600 font-medium">✅ Đang hiển thị</span>
            ) : (
              <span className="text-gray-500">Ẩn</span>
            )}
          </p>
          <a
            href={`/bai-viet/${post.id}`}
            className="inline-block mt-3 px-4 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Xem chi tiết
          </a>
        </div>
      ))}
    </div>
  );
}
