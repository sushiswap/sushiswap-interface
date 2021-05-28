const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const linguiConfig = require('./lingui.config.js')
const { locales, sourceLocale } = linguiConfig

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
    locales,
    defaultLocale: sourceLocale,
  },
  publicRuntimeConfig: {
    locales
  }
})
