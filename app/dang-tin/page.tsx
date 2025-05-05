'use client';
import { useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function DangTinPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [field, setField] = useState<'title' | 'description'>('title');
  const [message, setMessage] = useState('');
  const supabase = createBrowserSupabaseClient();

  function handleVoiceInput() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Trình duyệt không hỗ trợ giọng nói.');
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.start();
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      if (field === 'title') {
        setTitle(transcript);
        setField('description');
      } else {
        setDescription(transcript);
        setField('title');
      }
    };
  }

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      setMessage('Vui lòng nhập tiêu đề và mô tả.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('posts').insert([
      {
        title,
        description,
        user_id: user?.id || null,
      },
    ]);

    if (error) {
      setMessage('Lỗi khi đăng tin: ' + error.message);
    } else {
      setMessage('✅ Đăng tin thành công!');
      setTitle('');
      setDescription('');
      setField('title');
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Đăng tin bằng giọng nói</h1>

      <div className="mb-4 space-y-2">
        <label className="block font-semibold">Tiêu đề:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <label className="block font-semibold mt-4">Mô tả:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleVoiceInput}
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          🎤 Nói ({field === 'title' ? 'tiêu đề' : 'mô tả'})
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Đăng tin
        </button>
      </div>

      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}
