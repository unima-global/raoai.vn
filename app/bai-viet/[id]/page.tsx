'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

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
      {post.image && (
        <div className="mb-4">
          <Image
            src={post.image}
            alt="Ảnh bài viết"
            width={800}
            height={450}
            className="rounded shadow"
          />
        </div>
      )}

      {/* Nội dung mô tả */}
      <div className="text-gray-800 text-lg whitespace-pre-line mb-4">
        {post.content}
      </div>

      {/* Thông tin vị trí */}
      {post.location && (
        <div className="mb-4 text-gray-600">
          <p><strong>Địa chỉ:</strong> {post.location}</p>
        </div>
      )}

      {/* Bản đồ nếu có tọa độ */}
      {post.lat && post.lng && (
        <iframe
          src={`https://maps.google.com/maps?q=${post.lat},${post.lng}&z=15&output=embed`}
          width="100%"
          height="350"
          className="rounded shadow"
          loading="lazy"
        ></iframe>
      )}
    </div>
  );
}
