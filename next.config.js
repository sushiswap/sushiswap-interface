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
            disable: process.env.NODE_ENV === 'development',
            // runtimeCaching,
            // disable: process.env.NODE_ENV === 'development',
            // register: true,
            // scope: '.',
            // sw: 'service-worker.js',
        },
        future: {
            webpack5: true,
        },
        images: {
            domains: ['assets.sushi.com', 'res.cloudinary.com'],
            // loader: 'cloudinary',
            // path: 'http://res.cloudinary.com/dnz2bkszg/image/fetch/',
        },
        reactStrictMode: true,
        // async redirects() {
        //     return [
        //         {
        //             source: '/',
        //             destination: '/swap',
        //             permanent: true,
        //         },
        //     ]
        // },
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
