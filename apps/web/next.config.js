/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  i18n: {
    locales: ['en', 'zh-HK'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['localhost', 'cdn.vercel.com', 'your-cdn.com'],
  },
};

module.exports = nextConfig;
