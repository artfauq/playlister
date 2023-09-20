const nextTranslate = require('next-translate-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['components', 'config', 'hooks', 'lib', 'modules', 'pages', 'theme', 'types', 'utils'],
  },
  i18n: {
    localeDetection: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.scdn.co',
      },
      {
        protocol: 'https',
        hostname: '**.spotifycdn.com',
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextTranslate(nextConfig);
