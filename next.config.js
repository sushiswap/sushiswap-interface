const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const linguiConfig = require('./lingui.config.js')
const defaultTheme = require('tailwindcss/defaultTheme')

const { ChainId } = require('@sushiswap/core-sdk')

const { locales, sourceLocale } = linguiConfig
const { screens } = defaultTheme

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
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
  // experimental: {
  //   nextScriptWorkers: true,
  // },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  swcMinify: false,
  reactStrictMode: true,
  // pwa: {
  //   dest: 'public',
  //   runtimeCaching,
  //   disable: process.env.NODE_ENV === 'development',
  // },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  async redirects() {
    return [
      {
        source: '/pools',
        destination: '/',
        permanent: true,
      },
      {
        source: '/',
        destination: '/swap',
        permanent: true,
      },
      // {
      //   source: '/swap/:path*',
      //   destination: 'https://www.sushi.com/swap',
      //   permanent: true,
      // },
      {
        source: '/home',
        destination: 'https://www.sushi.com/swap',
        permanent: true,
      },
      // {
      //   source: '/farm/:path*',
      //   destination: 'https://www.sushi.com/earn',
      //   permanent: true,
      // },
      {
        source: '/farms/special',
        destination: 'https://www.sushi.com/earn',
        permanent: true,
      },
      {
        source: '/onsen/:path*',
        destination: 'https://www.sushi.com/earn',
        permanent: true,
      },
      {
        source: '/farms/:path*',
        destination: 'https://www.sushi.com/earn',
        permanent: true,
      },
      {
        source: '/stake',
        destination: 'https://www.sushi.com/earn',
        permanent: true,
      },
      {
        source: '/borrow',
        destination: '/kashi',
        permanent: true,
      },
      {
        source: '/lend',
        destination: '/kashi',
        permanent: true,
      },
      {
        source: '/inari',
        destination: '/tools/inari',
        permanent: true,
      },
      {
        source: '/bento/balances',
        destination: '/account',
        permanent: true,
      },
      {
        source: '/analytics/dashboard',
        destination: '/analytics',
        permanent: true,
      },
      {
        source: '/analytics/pairs/:path*',
        destination: '/analytics/pools/:path*',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/add/:token*',
        destination: '/legacy/add/:token*',
      },
      {
        source: '/remove/:token*',
        destination: '/legacy/remove/:token*',
      },
      {
        source: '/create/:token*',
        destination: '/legacy/add/:token*',
      },
      {
        source: '/open-order',
        destination: '/limit-order/open-order',
      },
      {
        source: '/pool',
        destination: '/legacy/pool',
      },
      {
        source: '/find',
        destination: '/legacy/find',
      },
      {
        source: '/migrate',
        destination: '/legacy/migrate',
      },
      {
        source: '/me',
        destination: '/user',
      },
    ]
  },
  i18n: {
    localeDetection: true,
    locales,
    defaultLocale: sourceLocale,
  },
  // serverRuntimeConfig: {},
  publicRuntimeConfig: {
    breakpoints: screens,

    [ChainId.ETHEREUM]: {
      features: [],
    },
  },
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withBundleAnalyzer(nextConfig)

// Don't delete this console log, useful to see the config in Vercel deployments
// console.log('next.config.js', JSON.stringify(module.exports, null, 2))
