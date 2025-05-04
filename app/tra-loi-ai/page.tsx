'use client';

import { useState, useRef } from 'react';

export default function TraLoiAIPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
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
      alert('Trình duyệt không hỗ trợ mic');
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setPrompt(text);
        fetchGPT(text);
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

  const fetchGPT = async (query: string) => {
    if (!query) {
      alert('Bạn chưa nói gì');
      return;
    }

    const res = await fetch('/api/gpt/goi-y-tieu-de', {
      method: 'POST',
      body: JSON.stringify({ prompt: query }),
    });

    const data = await res.json();
    if (data.result) {
      setResponse(data.result);
      speak(data.result);
    } else {
      setResponse('Không có phản hồi từ AI');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">🧠 Hỏi AI bằng giọng nói</h1>

      <div className="flex space-x-2">
        <input
          className="border p-2 w-full"
          placeholder="Bạn muốn hỏi gì?"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button
          onClick={handleListen}
          className="bg-blue-500 text-white px-3 rounded"
        >
          {isListening ? '🎧...' : '🎧 Mic'}
        </button>
      </div>

      <button
        onClick={() => fetchGPT(prompt)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        💬 Gửi cho AI
      </button>

      {response && (
        <div className="border p-4 rounded bg-gray-50">
          <p className="text-gray-600 mb-1">🤖 AI trả lời:</p>
          <p className="font-medium">{response}</p>
        </div>
      )}
    </div>
  );
}
