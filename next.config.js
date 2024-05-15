/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // useFileSystemPublicRoutes:true,
  poweredByHeader: false,
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
}

module.exports = nextConfig