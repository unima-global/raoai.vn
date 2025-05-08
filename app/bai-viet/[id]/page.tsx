'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function BaiVietChiTiet() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/posts/${id}`);
      const postData = await res.json();
      setPost(postData);

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        setUser(sessionData.session.user);
      }
    };

    fetchData();
  }, [id]);

  if (!post) {
    return <div className="p-4 text-gray-600">Đang tải bài viết...</div>;
  }

  const isOwner = user && post.user_id === user.id;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-3">{post.title}</h1>

      {/* Ảnh */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="rounded w-full max-h-[450px] object-cover mb-4"
        />
      )}

      {/* Mô tả */}
      {post.description && (
        <p className="text-base text-gray-800 mb-4 whitespace-pre-line">
          {post.description}
        </p>
      )}

      {/* Địa chỉ */}
      {post.location && (
        <p className="text-gray-600 mb-2">
          <strong>Địa chỉ:</strong> {post.location}
        </p>
      )}

      {/* Liên hệ */}
      {post.contact && (
        <p className="text-gray-700 mb-4">
          <strong>Liên hệ:</strong> {post.contact}
        </p>
      )}

      {/* Nếu là chủ bài viết */}
      {isOwner && (
        <div className="flex gap-3 mt-4">
          <a
            href={`/sua-tin?id=${post.id}`}
            className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Sửa tin
          </a>
          <button className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
            Xoá tin
          </button>
          <button className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
            {post.status === 'active' ? 'Ẩn tin' : 'Hiện tin'}
          </button>
        </div>
      )}

      {/* Avatar và chat */}
      <div className="mt-6 flex items-center gap-3">
        <img
          src={`https://ui-avatars.com/api/?name=${post.title}&background=random`}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        {!isOwner && (
          <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            Gửi tin nhắn
          </button>
        )}
      </div>
    </div>
  );
}
