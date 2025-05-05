'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function fetchPosts() {
      let query = supabase
        .from('posts')
        .select('id, title')
        .order('created_at', { ascending: false });

      if (search.trim()) {
        query = query.ilike('title', `%${search.trim()}%`);
      }

      const { data } = await query.limit(10);
      setPosts(data || []);
    }
    fetchPosts();
  }, [search]);

  function handleVoiceInput() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Trình duyệt không hỗ trợ giọng nói.');
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.start();
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setSearch(transcript);
    };
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tìm kiếm tin đăng</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleVoiceInput}
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          🎤
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Tin mới</h2>
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
