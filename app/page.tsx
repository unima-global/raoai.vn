'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/posts') // Đảm bảo API này trả về danh sách bài viết mới
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Banner & Tìm kiếm */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded shadow mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">TÌM LÀ THẤY – RAO LÀ BÁN</h1>
        <p className="mb-4">Nền tảng rao vặt thông minh thuộc hệ sinh thái UNIMA.AI</p>
        <input
          type="text"
          placeholder="Tìm gì đó..."
          className="rounded px-4 py-2 text-black w-2/3 max-w-md"
        />
        <button className="ml-2 px-4 py-2 bg-white text-blue-600 rounded font-semibold">
          Tìm
        </button>
      </div>

      {/* Danh mục nổi bật */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">📁 Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {['Xe cộ', 'Ô tô', 'Xe máy', 'Nhà đất', 'Cho thuê', 'Bán nhà', 'Điện thoại', 'Dịch vụ'].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded border shadow hover:shadow-md cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Tin mới nhất */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">🆕 Tin mới nhất</h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">Chưa có tin nào.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map(post => (
              <div
                key={post.id}
                className="border rounded p-4 bg-white shadow-sm hover:shadow transition"
              >
                {/* Ảnh */}
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full max-h-[250px] object-cover rounded mb-3"
                  />
                )}

                {/* Nội dung */}
                <h3 className="text-lg font-semibold text-blue-700">{post.title}</h3>
                <p className="text-sm text-gray-600">
                  Ngày đăng: {new Date(post.created_at).toLocaleString()}
                </p>
                <p className="mt-1 text-sm">
                  Trạng thái:{' '}
                  {post.status === 'active' ? (
                    <span className="text-green-600">✅ Đang hiển thị</span>
                  ) : (
                    <span className="text-gray-400">Ẩn</span>
                  )}
                </p>

                <Link
                  href={`/bai-viet/${post.id}`}
                  className="inline-block mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} RaoAI.vn thuộc hệ sinh thái UNIMA.AI
      </div>
    </div>
  );
}
