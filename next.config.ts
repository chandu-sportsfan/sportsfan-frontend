/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiTarget =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.NEXT_PUBLIC_ADMIN_URL ||
      'https://sportsfan360.vercel.app';

    return {
      beforeFiles: [
        // ── Auth routes → proxy to admin panel ──
        { source: '/api/auth/login', destination: `${apiTarget}/api/auth/login` },
        { source: '/api/auth/register', destination: `${apiTarget}/api/auth/register` },
        { source: '/api/auth/send-otp', destination: `${apiTarget}/api/auth/send-otp` },
        { source: '/api/auth/verify-otp', destination: `${apiTarget}/api/auth/verify-otp` },
        { source: '/api/auth/set-password', destination: `${apiTarget}/api/auth/set-password` },
        { source: '/api/auth/host/:path*', destination: `${apiTarget}/api/auth/host/:path*` },
        { source: '/api/auth/forgot-password', destination: `${apiTarget}/api/auth/forgot-password` },

        // ── FIX: Keep these watch-along nested routes LOCAL (Next.js handles them) ──
        { source: '/api/watch-along/matches', destination: '/api/watch-along/matches' },
        { source: '/api/watch-along/matches/:matchId', destination: '/api/watch-along/matches/:matchId' },
        { source: '/api/watch-along/matches/:matchId/predictions', destination: '/api/watch-along/matches/:matchId/predictions' },
        { source: '/api/watch-along/matches/:matchId/predictions/:path*', destination: '/api/watch-along/matches/:matchId/predictions/:path*' },
        { source: '/api/watch-along/matches/:matchId/chats', destination: '/api/watch-along/matches/:matchId/chats' },
        { source: '/api/watch-along/matches/:matchId/chats/:path*', destination: '/api/watch-along/matches/:matchId/chats/:path*' },
        { source: '/api/watch-along/matches/:matchId/quiz', destination: '/api/watch-along/matches/:matchId/quiz' },
        { source: '/api/watch-along/matches/:matchId/quiz/:path*', destination: '/api/watch-along/matches/:matchId/quiz/:path*' },
        { source: '/api/watch-along/matches/:matchId/emoji-storm', destination: '/api/watch-along/matches/:matchId/emoji-storm' },
        { source: '/api/watch-along/matches/:matchId/emoji-storm/:path*', destination: '/api/watch-along/matches/:matchId/emoji-storm/:path*' },
      ],

      afterFiles: [
        // Team360
        { source: '/api/team360', destination: `${apiTarget}/api/team360` },
        { source: '/api/team360/:path*', destination: `${apiTarget}/api/team360/:path*` },
        { source: '/api/team360-playlist', destination: `${apiTarget}/api/team360-playlist` },
        { source: '/api/team360-playlist/:path*', destination: `${apiTarget}/api/team360-playlist/:path*` },

        // Cricket Articles
        { source: '/api/cricket-articles', destination: `${apiTarget}/api/cricket-articles` },
        { source: '/api/cricket-articles/:path*', destination: `${apiTarget}/api/cricket-articles/:path*` },

        // Player Profile
        { source: '/api/player-profile', destination: `${apiTarget}/api/player-profile` },
        { source: '/api/player-profile/:path*', destination: `${apiTarget}/api/player-profile/:path*` },
        { source: '/api/playersprofile-playlist', destination: `${apiTarget}/api/playersprofile-playlist` },
        { source: '/api/playersprofile-playlist/:path*', destination: `${apiTarget}/api/playersprofile-playlist/:path*` },

        // Club Profile
        { source: '/api/club-profile', destination: `${apiTarget}/api/club-profile` },
        { source: '/api/club-profile/:path*', destination: `${apiTarget}/api/club-profile/:path*` },

        // Watch Along — only room-level routes go to admin panel
        // (match/predictions/quiz/chats are handled locally via beforeFiles above)
        { source: '/api/watch-along', destination: `${apiTarget}/api/watch-along` },
        { source: '/api/watch-along/:path*', destination: `${apiTarget}/api/watch-along/:path*` },

        // Events
        { source: '/api/events', destination: `${apiTarget}/api/events` },
        { source: '/api/events/:path*', destination: `${apiTarget}/api/events/:path*` },

        // Cloudinary
        { source: '/api/cloudinary/audio', destination: `${apiTarget}/api/cloudinary/audio` },
        { source: '/api/cloudinary/plays', destination: `${apiTarget}/api/cloudinary/plays` },
        { source: '/api/cloudinary/:path*', destination: `${apiTarget}/api/cloudinary/:path*` },

        // Plays
        { source: '/api/plays', destination: `${apiTarget}/api/plays` },
        { source: '/api/plays/:path*', destination: `${apiTarget}/api/plays/:path*` },

        { source: '/api/cloudinary/plays', destination: `${apiTarget}/api/cloudinary/plays` },
        { source: '/api/cloudinary/plays/:path*', destination: `${apiTarget}/api/cloudinary/plays/:path*` },

        // Global Search
        { source: '/api/global-search', destination: `${apiTarget}/api/global-search` },
        { source: '/api/global-search/:path*', destination: `${apiTarget}/api/global-search/:path*` },

        // Static content
        { source: '/Content/:path*', destination: `${apiTarget}/Content/:path*` },

        // Host Rooms
        { source: '/api/hostrooms', destination: `${apiTarget}/api/hostrooms` },
        { source: '/api/hostrooms/:path*', destination: `${apiTarget}/api/hostrooms/:path*` },

        // Audio Signals
        { source: '/api/audio-messages', destination: `${apiTarget}/api/audio-messages` },
        { source: '/api/audio-messages/:path*', destination: `${apiTarget}/api/audio-messages/:path*` },

        // Audio Drops
        { source: '/api/request-drop', destination: `${apiTarget}/api/request-drop` },
        { source: '/api/request-drop/:path*', destination: `${apiTarget}/api/request-drop/:path*` },

        // Sportsfan360 Profile
        { source: '/api/sportsfan360card', destination: `${apiTarget}/api/sportsfan360card` },

        { source: '/api/auth/host/me', destination: `${apiTarget}/api/auth/host/me` },

        // Feedback
        { source: '/api/feedback/questions', destination: `${apiTarget}/api/feedback/questions` },
        { source: '/api/feedback/questions/:path*', destination: `${apiTarget}/api/feedback/questions/:path*` },
        { source: '/api/feedback/submissions', destination: `${apiTarget}/api/feedback/submissions` },
        { source: '/api/feedback/submissions/:path*', destination: `${apiTarget}/api/feedback/submissions/:path*` },

        { source: '/api/auth/google-signup', destination: `${apiTarget}/api/auth/google-signup` },

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