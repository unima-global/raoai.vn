'use client';
import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');

    const res = await fetch('/api/ai/tra-loi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input }),
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
      handleSend();
    };
  }

  function speakText(text: string) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'vi-VN';
    synth.speak(utter);
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Trợ lý AI RaoAI</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Nhập câu hỏi..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleVoiceInput} className="p-2 border rounded bg-gray-100 hover:bg-gray-200">🎤</button>
        <button onClick={handleSend} className="p-2 px-4 border rounded bg-blue-500 text-white hover:bg-blue-600">
          Gửi
        </button>
      </div>

      {loading && <p>Đang xử lý...</p>}
      {response && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <strong>Phản hồi:</strong> {response}
        </div>
      )}
    </main>
  );
}
