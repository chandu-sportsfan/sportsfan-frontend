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
        // All other /api/auth/* (session, callback, signin, signout) handled locally by NextAuth
      ],

      afterFiles: [
        // Team360
        { source: '/api/team360', destination: 'https://sportsfan360.vercel.app/api/team360' },
        { source: '/api/team360/:path*', destination: 'https://sportsfan360.vercel.app/api/team360/:path*' },
        { source: '/api/team360-playlist', destination: 'https://sportsfan360.vercel.app/api/team360-playlist' },
        { source: '/api/team360-playlist/:path*', destination: 'https://sportsfan360.vercel.app/api/team360-playlist/:path*' },

        // Cricket Articles
        { source: '/api/cricket-articles', destination: 'https://sportsfan360.vercel.app/api/cricket-articles' },
        { source: '/api/cricket-articles/:path*', destination: 'https://sportsfan360.vercel.app/api/cricket-articles/:path*' },

        // Player Profile
        { source: '/api/player-profile', destination: 'https://sportsfan360.vercel.app/api/player-profile' },
        { source: '/api/player-profile/:path*', destination: 'https://sportsfan360.vercel.app/api/player-profile/:path*' },
        { source: '/api/playersprofile-playlist', destination: 'https://sportsfan360.vercel.app/api/playersprofile-playlist' },
        { source: '/api/playersprofile-playlist/:path*', destination: 'https://sportsfan360.vercel.app/api/playersprofile-playlist/:path*' },

        // Club Profile
        { source: '/api/club-profile', destination: 'https://sportsfan360.vercel.app/api/club-profile' },
        { source: '/api/club-profile/:path*', destination: 'https://sportsfan360.vercel.app/api/club-profile/:path*' },

        // Watch Along
        { source: '/api/watch-along', destination: 'https://sportsfan360.vercel.app/api/watch-along' },
        { source: '/api/watch-along/:path*', destination: 'https://sportsfan360.vercel.app/api/watch-along/:path*' },

        // Events
        { source: '/api/events', destination: 'https://sportsfan360.vercel.app/api/events' },
        { source: '/api/events/:path*', destination: 'https://sportsfan360.vercel.app/api/events/:path*' },

        // Cloudinary
        { source: '/api/cloudinary/audio', destination: 'https://sportsfan360.vercel.app/api/cloudinary/audio' },
        { source: '/api/cloudinary/plays', destination: 'https://sportsfan360.vercel.app/api/cloudinary/plays' },
        { source: '/api/cloudinary/:path*', destination: 'https://sportsfan360.vercel.app/api/cloudinary/:path*' },

        // Plays
        { source: '/api/plays', destination: 'https://sportsfan360.vercel.app/api/plays' },
        { source: '/api/plays/:path*', destination: 'https://sportsfan360.vercel.app/api/plays/:path*' },

        // Global Search
        { source: '/api/global-search', destination: 'https://sportsfan360.vercel.app/api/global-search' },
        { source: '/api/global-search/:path*', destination: 'https://sportsfan360.vercel.app/api/global-search/:path*' },

        // Static content
        { source: '/Content/:path*', destination: 'https://sportsfan360.vercel.app/Content/:path*' },

        // Host Rooms
        { source: '/api/hostrooms', destination: 'https://sportsfan360.vercel.app/api/hostrooms' },
        { source: '/api/hostrooms/:path*', destination: 'https://sportsfan360.vercel.app/api/hostrooms/:path*' },
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