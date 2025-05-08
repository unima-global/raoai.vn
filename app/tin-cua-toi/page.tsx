'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function TinCuaToi() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/user-posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Lỗi khi tải tin:', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Tin của tôi</h1>

      {posts.length === 0 && (
        <p className="text-gray-600">Bạn chưa đăng tin nào.</p>
      )}

      {posts.map(post => (
        <div
          key={post.id}
          className="mb-6 border rounded shadow-sm p-4 bg-white"
        >
          {/* Kiểm tra xem image có URL hợp lệ không */}
          {post.image && typeof post.image === 'string' && post.image.startsWith('http') && (
            <div className="mb-3">
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={450}
                className="rounded"
              />
            </div>
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
