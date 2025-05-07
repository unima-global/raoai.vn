'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div>

      {/* 🌟 BANNER */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">TÌM LÀ THẤY – RAO LÀ BÁN</h1>
        <p className="text-lg mb-6">Đăng tin rao vặt miễn phí – hỗ trợ AI phân loại, tìm kiếm thông minh.</p>
        <Link href="/dang-tin">
          <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100">
            + Đăng tin ngay
          </button>
        </Link>
      </section>

      {/* 📂 DANH MỤC NỔI BẬT */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">📂 Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[
            { name: 'Xe cộ', slug: 'xe-co', icon: '🚗' },
            { name: 'Ô tô', slug: 'oto', icon: '🚙' },
            { name: 'Xe máy', slug: 'xe-may', icon: '🏍️' },
            { name: 'Nhà đất', slug: 'nha-dat', icon: '🏠' },
            { name: 'Cho thuê', slug: 'cho-thue', icon: '📦' },
            { name: 'Bán nhà', slug: 'ban-nha', icon: '🏘️' },
          ].map((item) => (
            <Link key={item.slug} href={`/danh-muc/${item.slug}`}>
              <div className="border rounded p-4 hover:shadow text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold">{item.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🆕 TIN MỚI NHẤT */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">🆕 Tin mới nhất</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder bài viết - sẽ dùng fetch API sau */}
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="border rounded shadow hover:shadow-lg">
                <img src="/no-image.jpg" alt="tin" className="w-full h-48 object-cover rounded-t" />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Tiêu đề bài viết {n}</h3>
                  <p className="text-sm text-gray-500">Mô tả ngắn gọn về tin đăng. Giá, vị trí, tình trạng...</p>
                  <Link href={`/bai-viet/${n}`} className="text-blue-600 text-sm mt-2 inline-block">Xem chi tiết →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔍 GIỚI THIỆU RAOAI */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">🤖 RaoAI là gì?</h2>
        <p className="text-lg text-gray-700 mb-6">
          RaoAI.vn là nền tảng rao vặt thông minh tích hợp AI: giúp phân tích nội dung, gợi ý nhóm đúng, tìm kiếm bằng giọng nói, và nhiều tính năng khác từ hệ sinh thái Globexa.
        </p>
        <p className="text-gray-600">
          Chúng tôi kết nối hàng triệu người dùng, hỗ trợ doanh nghiệp, cá nhân dễ dàng đăng tin, quản lý và giao dịch một cách hiệu quả.
        </p>
      </section>

    </div>
  )
}
