'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface Post {
  id: string;
  title: string;
  image_url: string;
  status: string;
  location: string;
  created_at: string;
  lat?: number;
  lng?: number;
}

interface Category {
  name: string;
  slug: string;
  icon: string;
}

const categories: Category[] = [
  { name: 'Xe cộ', slug: 'xe-co', icon: '🚗' },
  { name: 'Ô tô', slug: 'oto', icon: '🚙' },
  { name: 'Xe máy', slug: 'xe-may', icon: '🏍️' },
  { name: 'Nhà đất', slug: 'nha-dat', icon: '🏠' },
  { name: 'Cho thuê', slug: 'cho-thue', icon: '📦' },
  { name: 'Bán nhà', slug: 'ban-nha', icon: '🏡' },
  { name: 'Điện thoại', slug: 'dien-thoai', icon: '📱' },
  { name: 'Dịch vụ', slug: 'dich-vu', icon: '🛠️' },
];

export default function HomePage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [newPosts, setNewPosts] = useState<Post[]>([]);
  const [nearbyPosts, setNearbyPosts] = useState<Post[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchNewPosts();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) fetchNearbyPosts();
  }, [userLocation]);

  const fetchNewPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12);
    setNewPosts(data || []);
  };

  const fetchNearbyPosts = async () => {
    const { data } = await supabase.from('posts').select('*').limit(100);
    const filtered = (data || []).filter((post: any) => {
      if (!post.lat || !post.lng || !userLocation) return false;
      const dx = post.lat - userLocation.lat;
      const dy = post.lng - userLocation.lng;
      const distanceKm = Math.sqrt(dx * dx + dy * dy) * 111;
      return distanceKm <= 5;
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
    <div key={post.id} className="border rounded-md p-3 shadow-sm bg-white">
      <img src={post.image_url} className="w-full h-40 object-cover rounded" alt={post.title} />
      <h3 className="font-semibold mt-2">{post.title}</h3>
      <p className="text-sm text-gray-500">{post.location}</p>
      <p className="text-sm mt-1">📅 {new Date(post.created_at).toLocaleString()}</p>
      <p className="text-sm mt-1">
        Trạng thái:{' '}
        <span className="text-green-600 font-medium">
          {post.status === 'active' ? '✅ Đang hiển thị' : '⏸️ Không hiển thị'}
        </span>
      </p>
      <Link href={`/bai-viet/${post.id}`} className="text-blue-600 text-sm mt-2 block">
        Xem chi tiết
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* DANH MỤC */}
      <h2 className="text-xl font-bold mb-4">📂 Danh mục nổi bật</h2>
      <Swiper spaceBetween={12} slidesPerView={2.3} breakpoints={{
        640: { slidesPerView: 3.2 },
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 8 }
      }}>
        {categories.map((cat) => (
          <SwiperSlide key={cat.slug}>
            <div className="border px-3 py-2 rounded text-center bg-white hover:bg-blue-100 cursor-pointer text-sm">
              <span className="text-lg block">{cat.icon}</span>
              {cat.name}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* TIN MỚI NHẤT */}
      <h2 className="text-xl font-bold mt-10 mb-4">🆕 Tin mới nhất</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {newPosts.map((post) => renderPostCard(post))}
      </div>

      {/* TIN GẦN BẠN */}
      <h2 className="text-xl font-bold mt-10 mb-4">📍 Tin gần bạn (trong vòng 5km)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {nearbyPosts.map((post) => renderPostCard(post))}
      </div>
    </div>
  );

}
