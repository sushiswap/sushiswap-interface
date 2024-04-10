const linguiConfig = require('./lingui.config.js')
const defaultTheme = require('tailwindcss/defaultTheme')
const { locales, sourceLocale } = linguiConfig
const { screens } = defaultTheme

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
// @ts-check
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
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
        source: '/',
        destination: 'https://www.sushi.com/swap',
        permanent: true,
      },

      {
        source: '/swap',
        destination: 'https://www.sushi.com/swap',
        permanent: true,
      },
      {
        source: '/home',
        destination: 'https://www.sushi.com/swap',
        permanent: true,
      },
      {
        source: '/pools',
        destination: 'https://www.sushi.com/pool',
        permanent: true,
      },
      {
        source: '/farms/special',
        destination: 'https://www.sushi.com/pool',
        permanent: true,
      },
      {
        source: '/onsen/:path*',
        destination: 'https://www.sushi.com/pool',
        permanent: true,
      },
      {
        source: '/farms/:path*',
        destination: 'https://www.sushi.com/pool',
        permanent: true,
      },
      {
        source: '/stake',
        destination: 'https://www.sushi.com/pool',
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
        source: '/analytics/:path*',
        destination: 'https://www.sushi.com/analytics',
        permanent: true,
      }
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
  },
}

module.exports = withBundleAnalyzer(nextConfig)