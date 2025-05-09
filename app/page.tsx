'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const categories = [
  { name: 'Xe cộ', icon: '🚗' },
  { name: 'Ô tô', icon: '🚙' },
  { name: 'Xe máy', icon: '🏍️' },
  { name: 'Nhà đất', icon: '🏠' },
  { name: 'Cho thuê', icon: '📦' },
  { name: 'Bán nhà', icon: '🏡' },
  { name: 'Điện thoại', icon: '📱' },
  { name: 'Dịch vụ', icon: '🛠️' },
];

const mockPosts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Bài viết demo ${i + 1}`,
  location: 'Hà Nội',
  created_at: new Date().toISOString(),
  image_url: 'https://source.unsplash.com/400x300/?house',
  status: 'active',
}));

export default function HomePage() {
  const renderPostCard = (post: any) => (
    <div key={post.id} className="bg-white shadow-sm border rounded-lg p-3 card-hover">
      <img
        src={post.image_url}
        alt={post.title}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="font-semibold mt-2">{post.title}</h3>
      <p className="text-sm text-gray-500">{post.location}</p>
      <p className="text-sm mt-1">📅 {new Date(post.created_at).toLocaleString()}</p>
      <p className="text-sm mt-1">
        Trạng thái:{' '}
        <span className="text-green-600 font-medium">✅ Đang hiển thị</span>
      </p>
      <p className="text-blue-600 text-sm mt-2 block">Xem chi tiết</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">TÌM LÀ THẤY – RAO LÀ BÁN</h1>
      <p className="text-gray-600 mb-6">Nền tảng rao vặt thông minh của hệ sinh thái UNIMA.AI</p>

      <h2 className="section-title">📂 Danh mục nổi bật</h2>
      <Swiper spaceBetween={12} slidesPerView={2.3} breakpoints={{
        640: { slidesPerView: 3.2 },
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 8 }
      }}>
        {categories.map((cat) => (
          <SwiperSlide key={cat.name}>
            <div className="border px-3 py-2 rounded text-center bg-white hover:bg-blue-100 cursor-pointer text-sm">
              <span className="text-lg block">{cat.icon}</span>
              {cat.name}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <h2 className="section-title mt-10">🆕 Tin mới nhất</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockPosts.map((post) => renderPostCard(post))}
      </div>
    </div>
  );
}
