'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function HomePage() {
  const [keyword, setKeyword] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [categories] = useState([
    { name: 'Xe cộ', slug: 'xe-co', icon: '🚗' },
    { name: 'Ô tô', slug: 'oto', icon: '🚙' },
    { name: 'Xe máy', slug: 'xe-may', icon: '🏍️' },
    { name: 'Nhà đất', slug: 'nha-dat', icon: '🏠' },
    { name: 'Cho thuê', slug: 'cho-thue', icon: '📦' },
    { name: 'Bán nhà', slug: 'ban-nha', icon: '🏘️' },
    { name: 'Điện thoại', slug: 'dien-thoai', icon: '📱' },
    { name: 'Dịch vụ', slug: 'dich-vu', icon: '🛠️' },
    { name: 'Thời trang', slug: 'thoi-trang', icon: '👗' },
  ])

  useEffect(() => {
    fetch('/api/posts?limit=6')
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  const handleSearch = () => {
    if (!keyword.trim()) return
    window.location.href = `/tim-kiem?tu-khoa=${encodeURIComponent(keyword)}`
  }

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return alert('Trình duyệt không hỗ trợ giọng nói!')
    const recognition = new SpeechRecognition()
    recognition.lang = 'vi-VN'
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setKeyword(text)
    }
    recognition.start()
  }

  return (
    <div>

      {/* 🔍 TÌM KIẾM */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">TÌM LÀ THẤY – RAO LÀ BÁN</h1>
        <p className="mb-6">Nền tảng rao vặt thông minh thuộc hệ sinh thái UNIMA.AI</p>
        <div className="flex items-center justify-center gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Tìm gì đó..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-4 py-2 rounded text-black"
          />
          <button onClick={handleVoice} className="bg-white text-black px-3 py-2 rounded">🎤</button>
          <button onClick={handleSearch} className="bg-white text-blue-700 px-4 py-2 rounded font-semibold">Tìm</button>
        </div>
      </section>

      {/* 📂 DANH MỤC NỔI BẬT */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">📂 Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {categories.slice(0, 8).map((item) => (
            <Link key={item.slug} href={`/danh-muc/${item.slug}`}>
              <div className="border rounded p-4 text-center hover:shadow">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold">{item.name}</div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length > 8 && (
          <div className="overflow-x-auto">
            <div className="flex gap-4 w-max">
              {categories.slice(8).map((item) => (
                <Link key={item.slug} href={`/danh-muc/${item.slug}`}>
                  <div className="min-w-[120px] border rounded p-4 text-center bg-white shadow-sm hover:shadow">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-sm">{item.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 🆕 TIN MỚI NHẤT */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">🆕 Tin mới nhất</h2>

          {posts.length === 0 ? (
            <p className="text-gray-500">Chưa có tin nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="border rounded shadow hover:shadow-lg bg-white">
                  <img
                    src={post.images?.length > 0 ? post.images[0] : '/no-image.jpg'}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">
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

      {/* 🌐 GIỚI THIỆU */}
      <section className="max-w-4xl mx-auto text-center py-14 px-4">
        <h2 className="text-2xl font-bold mb-4">🤖 RaoAI thuộc UNIMA.AI</h2>
        <p className="text-gray-700 mb-4">
          RaoAI.vn là nền tảng rao vặt thuộc hệ sinh thái UNIMA.AI – hỗ trợ AI giọng nói, tìm kiếm thông minh, gợi ý khu vực gần bạn.
        </p>
        <p className="text-sm text-gray-500">Tích hợp với Chat, Social, Nhadatai, Banxe và các nền tảng thương mại AI khác.</p>
      </section>

    </div>
  )
}
