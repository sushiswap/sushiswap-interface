const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const linguiConfig = require('./lingui.config.js')
const { locales, sourceLocale } = linguiConfig

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(
  withPWA({
    pwa: {
      dest: 'public',
      runtimeCaching,
      disable: process.env.NODE_ENV === 'development',
    },
    images: {
      domains: ['assets.sushi.com', 'res.cloudinary.com'],
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
    async rewrites() {
      return [
        // Bar
        {
          source: '/stake',
          destination: '/bar',
        },
        // Exchange
        // {
        //   source: '/',
        //   destination: '/swap',
        // },
        {
          source: '/add/:token*',
          destination: '/exchange/add/:token*',
        },
        {
          source: '/remove/:token*',
          destination: '/exchange/remove/:token*',
        },
        {
          source: '/create/:token*',
          destination: '/exchange/add/:token*',
        },
        {
          source: '/swap',
          destination: '/exchange/swap',
        },
        {
          source: '/swap/:token*',
          destination: '/exchange/swap/:token*',
        },
        {
          source: '/migrate',
          destination: '/exchange/migrate',
        },
        {
          source: '/pool',
          destination: '/exchange/pool',
        },
        {
          source: '/find',
          destination: '/exchange/find',
        },
        // Kashi
        {
          source: '/borrow',
          destination: '/kashi/borrow',
        },
        {
          source: '/borrow/:token*',
          destination: '/kashi/borrow/:token*',
        },
        {
          source: '/lend',
          destination: '/kashi/lend',
        },
        {
          source: '/lend/:token*',
          destination: '/kashi/lend/:token*',
        },
        // Onsen
        // {
        //   source: '/farm',
        //   destination: '/onsen',
        // },
        // {
        //   source: '/farm/:type*',
        //   destination: '/onsen/:type*',
        // },
      ]
    },
    i18n: {
      locales,
      defaultLocale: sourceLocale,
    },
    publicRuntimeConfig: {
      locales,
    },
  })
)

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
