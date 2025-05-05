'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('posts')
        .select('id, title')
        .order('created_at', { ascending: false })
        .limit(10);
      setPosts(data || []);
    }
    fetchPosts();
  }, []);

  async function handleSend(text?: string) {
    const message = text || input;
    if (!message.trim()) return;
    setLoading(true);
    setResponse('');

    const res = await fetch('/api/ai/tra-loi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: message }),
    });

    const data = await res.json();
    setResponse(data.answer || 'Không có phản hồi.');
    speakText(data.answer);
    setLoading(false);
  }

  function handleVoiceInput() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Trình duyệt không hỗ trợ giọng nói.');

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript); // Tự động gửi luôn
    };
  }

  function speakText(text: string) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'vi-VN';

    const voices = synth.getVoices();
    const viVoice = voices.find((v) =>
      v.lang.toLowerCase().includes('vi') && v.name.toLowerCase().includes('google')
    );

    if (viVoice) {
      utter.voice = viVoice;
    }

    synth.speak(utter);
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Trợ lý AI + Tin đăng mới</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Nhập hoặc nói câu hỏi..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleVoiceInput}
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          🎤
        </button>
        <button
          onClick={() => handleSend()}
          className="p-2 px-4 border rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Gửi
        </button>
      </div>

      {loading && <p>Đang xử lý...</p>}
      {response && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <strong>Phản hồi:</strong> {response}
        </div>
      )}

      <h2 className="text-xl font-semibold mt-8 mb-2">Tin đăng mới</h2>
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
