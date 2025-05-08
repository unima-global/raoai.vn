/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {}, // bỏ 'serverActions: false' nếu có lỗi
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};

module.exports = nextConfig;
