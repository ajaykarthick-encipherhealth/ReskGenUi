/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // useFileSystemPublicRoutes:true,
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    images: {
      useSharp: true,
    },
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
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*.(png|jpg|jpeg|webp|svg|gif|ico|mp3|csv|json|xlsx)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig