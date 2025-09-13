/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  
  // Enable modern optimizations
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Enable compression
  compress: true,

  // Optimize bundle splitting
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@fortawesome/react-fontawesome',
      '@fortawesome/free-solid-svg-icons',
      'antd',
      'react-bootstrap',
      'primereact'
    ],
  },

  // Configure webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer for development
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      );
    }

    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for stable dependencies
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            enforce: true,
          },
          // Common chunk for shared code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          // UI libraries chunk
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](antd|react-bootstrap|primereact)[\\/]/,
            priority: 30,
            enforce: true,
          },
          // Charts chunk
          charts: {
            name: 'charts',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](echarts|highcharts)[\\/]/,
            priority: 30,
            enforce: true,
          },
        },
      };
    }

    // Tree shake unused code
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;

    // Optimize module concatenation
    config.optimization.concatenateModules = true;

    return config;
  },

  async headers() {
    return [
      {
        // Security and performance headers for all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        // Long-term caching for static assets
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        // Long-term caching for Next.js static assets
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        // Cache for images with proper headers
        source: '/(.*\\.(png|jpg|jpeg|gif|ico|svg|webp|avif))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding, Accept',
          },
        ],
      },
      {
        // Cache for fonts
        source: '/(.*\\.(woff|woff2|eot|ttf|otf))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        // Cache for CSS and JS files
        source: '/(.*\\.(css|js))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        // API routes - short cache with revalidation
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding, Authorization',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig