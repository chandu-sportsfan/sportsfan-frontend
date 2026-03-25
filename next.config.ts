// next.config.js (main frontend)
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://sportsfan360.vercel.app/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;