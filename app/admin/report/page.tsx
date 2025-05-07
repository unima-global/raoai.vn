'use client';
import React, { useEffect, useState } from 'react';

interface Report {
  id: string;
  postTitle: string;
  postId: string;
  reason: string;
  reporter: string;
  created_at: string;
  status: 'pending' | 'resolved';
}

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Gọi API từ Supabase hoặc tạm dùng dữ liệu giả
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => setReports(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📣 Báo cáo vi phạm</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Bài đăng</th>
            <th className="p-2 border">Lý do</th>
            <th className="p-2 border">Người báo</th>
            <th className="p-2 border">Ngày</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, index) => (
            <tr key={r.id} className="border-t">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">
                <a href={`/post/${r.postId}`} className="text-blue-600 underline" target="_blank">
                  {r.postTitle}
                </a>
              </td>
              <td className="p-2 border">{r.reason}</td>
              <td className="p-2 border">{r.reporter}</td>
              <td className="p-2 border">{new Date(r.created_at).toLocaleString()}</td>
              <td className="p-2 border">
                {r.status === 'pending' ? '🕒 Đang chờ' : '✅ Đã xử lý'}
              </td>
              <td className="p-2 border">
                <button className="px-2 py-1 bg-green-500 text-white rounded mr-2">Xử lý</button>
                <button className="px-2 py-1 bg-gray-400 text-white rounded">Bỏ qua</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
