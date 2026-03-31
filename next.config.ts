// // next.config.js (main frontend)
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'https://sportsfan360.vercel.app/api/:path*',
//       },
//     ];
//   },
// };

// module.exports = nextConfig;




// main-frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://sportsfan360.vercel.app/api/:path*',
      },
      // Add rewrite for Content folder (where your images are stored)
      {
        source: '/Content/:path*',
        destination: 'https://sportsfan360.vercel.app/Content/:path*',
      },
    ];
  },
  // Configure Next.js Image component for remote images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sportsfan360.vercel.app',
        port: '',
        pathname: '/Content/**',
      },
    ],
  },
};

module.exports = nextConfig;