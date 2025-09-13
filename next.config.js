/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  compress: true,
  webpack: (config, { isServer }) => {
    // Drop all Moment.js locales to reduce bundle size
    config.plugins.push(
      new (require('webpack')).IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ })
    );
    // Smaller source maps in production
    if (!isServer) {
      config.devtool = process.env.NODE_ENV === 'production' ? 'source-map' : config.devtool;
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;