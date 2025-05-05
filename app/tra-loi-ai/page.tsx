'use client';
import { useState } from 'react';

export default function TraLoiAIPage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(false);
  }

  function handleVoiceInput() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Trình duyệt không hỗ trợ giọng nói.');
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.start();
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hỏi AI bằng giọng nói hoặc gõ</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Nhập câu hỏi..."
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
    </main>
  );
}
