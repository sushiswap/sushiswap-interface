const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
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
  i18n: {
    locales: ['de', 'en', 'es-AR', 'es', 'it', 'ro', 'ru', 'vi', 'zh-CN', 'zh-TW', 'ko', 'ja', 'fr'],
    defaultLocale: 'en',
  }
})
