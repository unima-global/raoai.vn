'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function HoSoPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!data) {
        // chưa có profile → tạo mới
        await supabase.from('user_profiles').insert([{ id: user.id }]);
        setLoading(false);
        return;
      }

      setProfile(data);
      setName(data.name || '');
      setPhone(data.phone || '');
      setAvatar(data.avatar || '');
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('user_profiles').update({
      name,
      phone,
      avatar,
    }).eq('id', user.id);

    if (error) {
      alert('Lỗi khi lưu: ' + error.message);
    } else {
      alert('✅ Đã cập nhật hồ sơ!');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">👤 Hồ sơ cá nhân</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Họ tên"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Số điện thoại"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Link avatar"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
          />
          {avatar && <img src={avatar} className="w-32 h-32 rounded-full" />}
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Lưu hồ sơ
          </button>
        </div>
      )}
    </div>
  );
}
