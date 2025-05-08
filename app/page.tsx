'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mic } from 'lucide-react';

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Banner + Tìm kiếm */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded shadow mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">TÌM LÀ THẤY – RAO LÀ BÁN</h1>
        <p className="mb-4">Nền tảng rao vặt thông minh thuộc hệ sinh thái UNIMA.AI</p>

        {/* Khung tìm kiếm có micro */}
        <div className="flex justify-center items-center gap-2 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Tìm gì đó..."
            className="rounded px-4 py-2 text-black w-full"
          />
          <button className="bg-white p-2 rounded text-blue-600 hover:bg-gray-100">
            <Mic size={20} />
          </button>
          <button className="px-4 py-2 bg-white text-blue-600 rounded font-semibold hover:bg-gray-100">
            Tìm
          </button>
        </div>
      </div>

      {/* Danh mục nổi bật (slider ngang) */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">📁 Danh mục nổi bật</h2>

        <div className="flex overflow-x-auto gap-3 scroll-smooth no-scrollbar pb-2">
          {[
            'Xe cộ', 'Ô tô', 'Xe máy', 'Nhà đất', 'Cho thuê', 'Bán nhà',
            'Điện thoại', 'Dịch vụ', 'Đồ điện', 'Nội thất', 'Thời trang', 'Công nghệ'
          ].map((item, idx) => (
            <div
              key={idx}
              className="min-w-[120px] text-center p-3 bg-white rounded border shadow hover:shadow-md cursor-pointer whitespace-nowrap"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Tin mới nhất */}
      <div>
        <h2 className="text-xl font-bold mb-4">🆕 Tin mới nhất</h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">Chưa có tin nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
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
                    className="w-full h-[160px] object-cover rounded mb-3"
                  />
                )}

                <h3 className="text-base font-semibold text-blue-700 mb-1">{post.title}</h3>
                <p className="text-sm text-gray-600">
                  Ngày đăng: {new Date(post.created_at).toLocaleString()}
                </p>
                <p className="text-sm mb-2">
                  Trạng thái:{' '}
                  {post.status === 'active' ? (
                    <span className="text-green-600 font-medium">✅ Đang hiển thị</span>
                  ) : (
                    <span className="text-gray-400">Ẩn</span>
                  )}
                </p>

                <Link
                  href={`/bai-viet/${post.id}`}
                  className="inline-block mt-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
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
