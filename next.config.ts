// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'https://sportsfan360.vercel.app/api/:path*',
//       },
//       // Add rewrite for Content folder (where your images are stored)
//       {
//         source: '/Content/:path*',
//         destination: 'https://sportsfan360.vercel.app/Content/:path*',
//       },
//     ];
//   },
  
//   async headers() {
//     return [
//       {
//         // Apply these headers to all routes
//         source: '/:path*',
//         headers: [
//           {
//             key: 'Cross-Origin-Resource-Policy',
//             value: 'cross-origin',
//           },
//           {
//             key: 'Cross-Origin-Embedder-Policy',
//             value: 'unsafe-none',
//           },
//         ],
//       },
//       {
//         // Specific headers for API routes
//         source: '/api/:path*',
//         headers: [
//           {
//             key: 'Access-Control-Allow-Origin',
//             value: '*',
//           },
//           {
//             key: 'Access-Control-Allow-Methods',
//             value: 'GET, POST, PUT, DELETE, OPTIONS',
//           },
//           {
//             key: 'Access-Control-Allow-Headers',
//             value: 'Content-Type, Authorization',
//           },
//         ],
//       },
//     ];
//   },
  
//   // Configure Next.js Image component for remote images
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'sportsfan360.vercel.app',
//         port: '',
//         pathname: '/Content/**',
//       },
//       // Add Cloudinary for video thumbnails
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//         port: '',
//         pathname: '/**',
//       },
//       // Add IPL/T20 documents domain
//       {
//         protocol: 'https',
//         hostname: 'documents.iplt20.com',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
// };

// module.exports = nextConfig;
















/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // ✅ Auth routes handled LOCALLY by frontend's own NextAuth
      // Do NOT proxy /api/auth/* to admin panel

      // ✅ Only proxy non-auth API calls to admin backend
      {
        source: '/api/admin/:path*',
        destination: 'https://sportsfan360.vercel.app/api/:path*',
      },

      // ✅ Keep this — proxies backend login/signup/etc
      // BUT exclude auth/* from the catch-all below
      {
        source: '/api/((?!auth).*)',   // matches /api/* EXCEPT /api/auth/*
        destination: 'https://sportsfan360.vercel.app/api/$1',
      },

      // ✅ Content/images proxy — fine as-is
      {
        source: '/Content/:path*',
        destination: 'https://sportsfan360.vercel.app/Content/:path*',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sportsfan360.vercel.app',
        port: '',
        pathname: '/Content/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
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