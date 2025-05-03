'use client';

import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function TestPage() {
  useEffect(() => {
    console.log('🧪 useEffect tại /test chạy');
    supabase.auth.getUser().then(({ data }) => {
      console.log('🧠 USER trong test:', data.user);
    });
  }, []);

  return (
    <div className="p-4">
      <h1>🔍 Trang test Supabase</h1>
    </div>
  );
}
