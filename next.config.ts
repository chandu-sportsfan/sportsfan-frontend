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
    return {
      beforeFiles: [
        // Backend auth routes — proxy to admin panel
        { source: '/api/auth/login', destination: 'https://sportsfan360.vercel.app/api/auth/login' },
        { source: '/api/auth/register', destination: 'https://sportsfan360.vercel.app/api/auth/register' },
        { source: '/api/auth/send-otp', destination: 'https://sportsfan360.vercel.app/api/auth/send-otp' },
        { source: '/api/auth/verify-otp', destination: 'https://sportsfan360.vercel.app/api/auth/verify-otp' },
        { source: '/api/auth/set-password', destination: 'https://sportsfan360.vercel.app/api/auth/set-password' },
        { source: '/api/auth/host/:path*', destination: 'https://sportsfan360.vercel.app/api/auth/host/:path*' },
        { source: '/api/auth/forgot-password', destination: 'https://sportsfan360.vercel.app/api/auth/forgot-password' },
        { source: '/api/auth/google-sync', destination: 'https://sportsfan360.vercel.app/api/auth/google-sync' },

        // NextAuth internal routes — keep local, never proxy these
        { source: '/api/auth/session', destination: '/api/auth/session' },
        { source: '/api/auth/csrf', destination: '/api/auth/csrf' },
        { source: '/api/auth/providers', destination: '/api/auth/providers' },
        { source: '/api/auth/signin', destination: '/api/auth/signin' },
        { source: '/api/auth/signout', destination: '/api/auth/signout' },
        { source: '/api/auth/callback/:provider*', destination: '/api/auth/callback/:provider*' },
        { source: '/api/auth/_log', destination: '/api/auth/_log' },
      ],

      afterFiles: [
        // Everything else under /api goes to backend
        {
          source: '/api/:path*',
          destination: 'https://sportsfan360.vercel.app/api/:path*',
        },
        {
          source: '/Content/:path*',
          destination: 'https://sportsfan360.vercel.app/Content/:path*',
        },
      ],
    };
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
      { protocol: 'https', hostname: 'sportsfan360.vercel.app', port: '', pathname: '/Content/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'documents.iplt20.com', port: '', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;