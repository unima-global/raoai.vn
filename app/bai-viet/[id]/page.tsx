'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function BaiVietChiTiet() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then(res => res.json())
        .then(data => setPost(data))
        .catch(err => console.error('Lỗi khi tải bài viết:', err));
    }
  }, [id]);

  if (!post) {
    return <div className="p-4 text-gray-600">Đang tải bài viết...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-3">{post.title}</h1>

      {/* Ảnh đại diện */}
      {post.image_url && (
        <div className="mb-4">
          <img
            src={post.image_url}
            alt={post.title}
            className="rounded shadow w-full max-h-[450px] object-cover"
          />
        </div>
      )}

      {/* Mô tả */}
      {post.description && (
        <p className="text-gray-800 text-base whitespace-pre-line mb-4">
          {post.description}
        </p>
      )}

      {/* Địa chỉ */}
      {post.location_text && (
        <p className="text-gray-600 font-medium">
          <strong>Địa chỉ:</strong> {post.location_text}
        </p>
      )}

      {/* Bản đồ sẽ thêm sau nếu có lat/lng */}
    </div>
  );
}
