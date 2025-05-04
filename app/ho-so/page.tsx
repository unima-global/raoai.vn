'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function HoSoPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [address, setAddress] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!data) {
        await supabase.from('user_profiles').insert([{ id: user.id }]);
        setLoading(false);
        return;
      }

      setProfile(data);
      setName(data.name || '');
      setPhone(data.phone || '');
      setAvatar(data.avatar || '');
      setAddress(data.address || '');
      setVerified(data.verified || false);
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
      address,
      verified,
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
            placeholder="Địa chỉ"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Link avatar"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={verified}
              onChange={() => setVerified(!verified)}
            />
            <span>Xác minh hồ sơ (admin dùng để xác thực)</span>
          </label>
          {avatar && <img src={avatar} className="w-24 h-24 rounded-full" />}
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
