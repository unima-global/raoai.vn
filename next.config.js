/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Bắt middleware áp dụng cho các route cần auth
  matcher: ['/dang-tin', '/tin-cua-toi', '/admin/:path*'],
};

module.exports = nextConfig;
