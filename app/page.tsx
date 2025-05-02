export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">👋 Chào mừng đến với raoai.vn</h1>
        <p className="text-gray-600 mb-6">
          Đây là nền tảng rao vặt thông minh với AI và giọng nói. Trang đang được phát triển, hãy theo dõi các tính năng tiếp theo:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>🔐 Đăng nhập bằng email</li>
          <li>📝 Trang đăng tin</li>
          <li>📷 Upload ảnh bằng Supabase</li>
          <li>🗣️ Tìm kiếm bằng giọng nói (Web Speech API)</li>
          <li>🧠 Sinh tiêu đề bằng AI (GPT)</li>
        </ul>

        <div className="mt-8 text-sm text-gray-400 text-center">
          🚀 Powered by Next.js 14, Supabase & TailwindCSS
        </div>
      </div>
    </main>
  );
}
