const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

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
        future: {
            webpack5: true,
        },
        images: {
            domains: [
                'raw.githubusercontent.com',
                'ftmscan.com',
                'cloudflare-ipfs.com',
            ],
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
)

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
