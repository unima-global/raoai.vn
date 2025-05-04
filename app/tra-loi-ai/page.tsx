'use client';

import { useEffect, useRef, useState } from 'react';

export default function TraLoiAI() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.pitch = 1;
    utterance.rate = 1;
    synth.speak(utterance);
  };

  const handleListen = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Trình duyệt không hỗ trợ nhận giọng nói');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      fetchGPT(transcript); // Gọi luôn GPT khi nói xong
    };

    recognition.onerror = (event: any) => {
      console.error('Lỗi mic:', event.error);
      alert('Lỗi mic: ' + event.error);
    };

    recognition.start();
    setListening(true);

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  };

  const fetchGPT = async (query: string) => {
    if (!query) {
      alert('Bạn chưa nhập câu hỏi');
      return;
    }

    try {
      const res = await fetch('/api/gpt/goi-y-tieu-de', {
        method: 'POST',
        body: JSON.stringify({ prompt: query }),
      });
      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
        speak(data.response); // AI nói ra câu trả lời
      } else {
        setResponse('❌ Không có phản hồi từ AI');
      }
    } catch (err) {
      console.error(err);
      setResponse('⚠️ Có lỗi khi gọi GPT');
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetchGPT(prompt);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">🧠 Hỏi AI bằng giọng nói</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          value={prompt}
          placeholder="Bạn muốn hỏi gì?"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="button"
          onClick={handleListen}
          className="bg-blue-600 text-white px-4 rounded"
        >
          {listening ? '🛑 Đang nghe...' : '🎤 Mic'}
        </button>
      </form>

      <button
        onClick={() => fetchGPT(prompt)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        ✅ Gửi câu hỏi cho AI
      </button>

      <div className="mt-4 border rounded p-4 bg-gray-50">
        <strong>🤖 AI trả lời:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
}
