'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 🔥 Lấy userId hiện tại
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    alert('Bạn chưa đăng nhập!');
    return;
  }

  setUploading(true);

  let image_url = null;

  if (image) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, image);

    if (uploadError) {
      alert('Lỗi upload ảnh: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    image_url = data?.publicUrl || null;
  }

  // 🧠 Gửi bài kèm user_id
  const { error } = await supabase.from('posts').insert([
    {
      title,
      description,
      image_url,
      user_id: userId, // 👈 Dòng này bắt buộc
    },
  ]);

  setUploading(false);

  if (error) {
    alert('Lỗi khi đăng tin: ' + error.message);
  } else {
    alert('✅ Đăng thành công!');
    router.push('/tin-cua-toi');
  }
};
