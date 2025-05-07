import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#f9fafb] text-[#333] pt-10 pb-6 border-t border-gray-200 mt-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-lg font-semibold mb-4">Về CHỢ AI</h3>
            <p className="text-sm leading-6">
              RaoAI.vn là nền tảng rao vặt thông minh thuộc hệ sinh thái CHỢ AI. Tìm là thấy – Rao là bán!
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/quy-dinh" className="hover:underline">Quy định sử dụng</a></li>
              <li><a href="/chinh-sach-bao-mat" className="hover:underline">Chính sách bảo mật</a></li>
              <li><a href="/dieu-khoan" className="hover:underline">Điều khoản dịch vụ</a></li>
              <li><a href="/lien-he" className="hover:underline">Liên hệ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Hệ sinh thái</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://raoai.vn">RaoAI.vn</a></li>
              <li><a href="https://choai24.vn">ChoAI24</a></li>
              <li><a href="https://globexa.ai">Globexa.AI</a></li>
              <li><a href="https://nhadatai.vn">Nhadatai.vn</a></li>
              <li><a href="https://banxe.ai">Banxe.ai</a></li>
              <li><a href="https://chat.globexa.ai">Chat Globexa</a></li>
              <li><a href="https://social.globexa.ai">Social Globexa</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Thanh toán</h3>
            <div className="flex flex-wrap gap-2">
              <img src="/icons/momo.svg" alt="MoMo" className="h-6" />
              <img src="/icons/vnpay.svg" alt="VNPay" className="h-6" />
              <img src="/icons/zalopay.svg" alt="ZaloPay" className="h-6" />
              <img src="/icons/visa.svg" alt="Visa" className="h-6" />
              <img src="/icons/mastercard.svg" alt="MasterCard" className="h-6" />
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
          © 2025 CHỢ AI – Một sản phẩm của hệ sinh thái UNIMA.AI
        </div>
      </div>
    </footer>
  );
}
