const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  distDir: 'build',
  pwa: {
    dest: 'public',
    runtimeCaching,
    disable: process.env.NODE_ENV === 'development',
  },
  future: {
    webpack5: true
  },
  images: {
    domains: ['raw.githubusercontent.com', 'ftmscan.com', 'cloudflare-ipfs.com'],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap',
        permanent: true,
      },
    ]
  },
})
