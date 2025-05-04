'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  name: string;
  avatar: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  user_profiles?: UserProfile[];
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const fetchAllPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          description,
          image_url,
          created_at,
          user_id,
          user_profiles (
            name,
            avatar
          )
        `)
        .order('created_at', { ascending: false });

      setPosts((data as Post[]) || []);
      setLoading(false);
    };

    fetchAllPosts();
  }, []);

  const filtered = posts.filter(post =>
    post.title.toLowerCase().includes(keyword.toLowerCase())
  );

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Trình duyệt không hỗ trợ mic');
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setKeyword(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        alert('Lỗi mic');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    setIsListening(true);
    recognitionRef.current.start();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📰 Tin mới đăng</h1>

      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm tiêu đề..."
          className="border p-2 w-full"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <button
          onClick={handleMicClick}
          className="bg-blue-500 text-white px-3 rounded"
        >
          {isListening ? '🎙️...' : '🎙️'}
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : filtered.length === 0 ? (
        <p>Không tìm thấy bài nào.</p>
      ) : (
        filtered.map(post => (
          <div key={post.id} className="border p-4 mb-4 rounded shadow">
            <h2 className="font-semibold text-lg">{post.title}</h2>
            <p className="text-gray-500 text-sm">
              {new Date(post.created_at).toLocaleString()}
            </p>
            <p className="mt-2">{post.description}</p>
            {post.image_url && (
              <img src={post.image_url} alt="ảnh" className="mt-2 rounded" />
            )}
            {post.user_profiles?.[0] && (
              <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                {post.user_profiles[0].avatar && (
                  <img
                    src={post.user_profiles[0].avatar}
                    alt="avatar"
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span>{post.user_profiles[0].name || 'Người dùng'}</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
