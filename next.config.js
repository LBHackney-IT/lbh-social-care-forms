module.exports = {
  distDir: 'build/_next',
  target: 'server',
  future: {
    webpack5: true,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self';font-src fonts.gstatic.com;style-src 'self' fonts.googleapis.com",
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
