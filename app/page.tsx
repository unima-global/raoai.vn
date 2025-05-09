'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface Post {
  id: string;
  title: string;
  image_url: string | null;
  status: string;
  location: string;
  created_at: string;
  lat?: number;
  lng?: number;
}

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

export default function HomePage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [posts, setPosts] = useState<Post[]>([]);
  const [nearbyPosts, setNearbyPosts] = useState<Post[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchPosts();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) fetchNearby();
  }, [userLocation]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(12);
    setPosts(data || []);
  };

  const fetchNearby = async () => {
    const { data } = await supabase.from('posts').select('*').limit(100);
    const filtered = (data || []).filter((post: any) => {
      if (!post.lat || !post.lng || !userLocation) return false;
      const dx = post.lat - userLocation.lat;
      const dy = post.lng - userLocation.lng;
      const d = Math.sqrt(dx * dx + dy * dy) * 111;
      return d <= 5;
    });
    setNearbyPosts(filtered.slice(0, 9));
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => setUserLocation(null)
      );
    }
  };

  const renderPostCard = (post: Post) => (
    <div key={post.id} className="bg-white shadow-sm border rounded-lg p-3 card-hover">
      <img
        src={post.image_url || `https://source.unsplash.com/400x300/?house&sig=${post.id}`}
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
      <Link href={`/bai-viet/${post.id}`} className="text-blue-600 text-sm mt-2 block">
        Xem chi tiết
      </Link>
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
        {posts.map((post) => renderPostCard(post))}
      </div>

      <h2 className="section-title mt-10">📍 Tin gần bạn (trong vòng 5km)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {nearbyPosts.map((post) => renderPostCard(post))}
      </div>
    </div>
  );
}
