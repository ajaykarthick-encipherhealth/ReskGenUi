/** @type {import('next').NextConfig} */
const nextConfig = {
  rules: [{ test: /\.txt$/, use: 'raw-loader' }],
}

module.exports = nextConfig