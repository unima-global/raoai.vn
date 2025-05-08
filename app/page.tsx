'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [keyword, setKeyword] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const categories = [
    { name: 'Xe cộ', slug: 'xe-co', icon: '🚗' },
    { name: 'Ô tô', slug: 'oto', icon: '🚙' },
    { name: 'Xe máy', slug: 'xe-may', icon: '🏍️' },
    { name: 'Nhà đất', slug: 'nha-dat', icon: '🏠' },
    { name: 'Cho thuê', slug: 'cho-thue', icon: '📦' },
    { name: 'Bán nhà', slug: 'ban-nha', icon: '🏘️' },
    { name: 'Điện thoại', slug: 'dien-thoai', icon: '📱' },
    { name: 'Dịch vụ', slug: 'dich-vu', icon: '🛠️' },
  ]

  useEffect(() => {
    fetch('/api/posts?limit=8')
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  return (
    <div>
      {/* 🔍 Tìm kiếm */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">TÌM LÀ THẤY – RAO LÀ BÁN</h1>
        <p className="mb-6">Nền tảng rao vặt thông minh thuộc hệ sinh thái UNIMA.AI</p>
        <div className="max-w-xl mx-auto flex gap-2 px-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && window.location.href = `/tim-kiem?tu-khoa=${encodeURIComponent(keyword)}`}
            className="w-full px-4 py-2 rounded text-black"
            placeholder="Tìm gì đó..."
          />
          <button onClick={() => window.location.href = `/tim-kiem?tu-khoa=${encodeURIComponent(keyword)}`} className="bg-white text-blue-600 px-4 py-2 rounded font-semibold">
            Tìm
          </button>
        </div>
      </section>

      {/* 📂 Danh mục */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">📂 Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((item) => (
            <Link key={item.slug} href={`/danh-muc/${item.slug}`}>
              <div className="border rounded p-4 text-center hover:shadow">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div>{item.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🆕 Tin mới nhất */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">🆕 Tin mới nhất</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500">Chưa có tin nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="border rounded shadow bg-white">
                  <img
                    src={post.images?.[0] || post.image_url || '/no-image.jpg'}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                      Ngày đăng: {new Date(post.created_at).toLocaleString()}
                    </p>
                    <Link href={`/bai-viet/${post.id}`} className="text-blue-600 text-sm">Xem chi tiết →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🌐 Giới thiệu */}
      <section className="max-w-4xl mx-auto text-center py-14 px-4">
        <h2 className="text-2xl font-bold mb-4">🤖 RaoAI thuộc UNIMA.AI</h2>
        <p className="text-gray-700">
          RaoAI.vn là nền tảng rao vặt thuộc hệ sinh thái UNIMA.AI – hỗ trợ AI giọng nói, tìm kiếm thông minh, gợi ý khu vực gần bạn.
        </p>
      </section>
    </div>
  )
}
