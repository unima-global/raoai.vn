'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function fetchData() {
      let query = supabase.from('posts').select('id, title').order('created_at', { ascending: false });

      if (search.trim()) {
        query = query.ilike('title', `%${search.trim()}%`);
      }

      const { data } = await query.limit(10);
      setPosts(data || []);
    }
    fetchData();
  }, [search]);

  function handleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Trình duyệt không hỗ trợ giọng nói.');

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
    };
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tin đăng mới</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Tìm kiếm tin đăng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleVoiceInput}
          className="p-2 px-3 border rounded bg-gray-100 hover:bg-gray-200"
        >
          🎤
        </button>
      </div>

      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/tin/${post.id}`} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
