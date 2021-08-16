const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

const linguiConfig = require('./lingui.config.js')

const { locales, sourceLocale } = linguiConfig

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(
  withPWA({
    webpack: (config) => {
      config.module.rules = [
        ...config.module.rules,
        {
          resourceQuery: /raw-lingui/,
          type: 'javascript/auto',
        },
      ]

      return config
    },
    pwa: {
      dest: 'public',
      runtimeCaching,
      disable: process.env.NODE_ENV === 'development',
    },
    images: {
      domains: ['assets.sushi.com', 'res.cloudinary.com', 'raw.githubusercontent.com', 'logos.covalenthq.com'],
    },
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: '/',
          destination: '/swap',
          permanent: true,
        },
        {
          source: '/zap',
          destination: '/',
          permanent: true,
        },
        {
          source: '/yield',
          destination: '/farm',
          permanent: true,
        },
        {
          source: '/bento',
          destination: '/bentobox',
          permanent: true,
        },
        {
          source: '/bento/kashi',
          destination: '/lend',
          permanent: true,
        },
        // Analytics
        {
          source: '/analytics',
          destination: '/analytics/dashboard',
          permanent: true,
        },
        {
          source: '/portfolio',
          destination: '/analytics/portfolio',
          permanent: true,
        },
      ]
    },
    async rewrites() {
      return [
        {
          source: '/stake',
          destination: '/bar',
        },
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
          source: '/limit-order',
          destination: '/exchange/limit-order',
        },
        {
          source: '/limit-order/:token*',
          destination: '/exchange/limit-order/:token*',
        },
        {
          source: '/open-order',
          destination: '/exchange/open-order',
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
        {
          source: '/me',
          destination: '/user',
        },
        {
          source: '/balances',
          destination: '/user/balances',
        },
      ]
    },
    i18n: {
      localeDetection: true,
      locales,
      defaultLocale: sourceLocale,
    },
  })
)

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
