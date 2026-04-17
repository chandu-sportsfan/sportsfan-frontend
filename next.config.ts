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
  
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
      {
        // Specific headers for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
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
      // Add Cloudinary for video thumbnails
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // Add IPL/T20 documents domain
      {
        protocol: 'https',
        hostname: 'documents.iplt20.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;