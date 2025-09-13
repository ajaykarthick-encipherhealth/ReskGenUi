/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: false,
  // useFileSystemPublicRoutes:true,
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    images: {
      useSharp: true,
    },
    // Ensure we only import the parts of libraries we use
    modularizeImports: {
      antd: {
        transform: 'antd/es/{{member}}',
        preventFullImport: true,
      },
      '@ant-design/icons': {
        transform: '@ant-design/icons/{{member}}',
        preventFullImport: true,
      },
    },
  },
  compiler: {
    // Strip console.* in production to reduce bundle size
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    // Drop moment.js locales (~300kb) if moment is used
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)', // Apply this header to all routes
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;