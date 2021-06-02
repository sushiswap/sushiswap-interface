import Document, { Head, Html, Main, NextScript } from 'next/document'

import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
            sheet.seal()
        }
    }

    render() {
        return (
            <Html lang="en" dir="ltr">
                <Head>
                    <meta name="application-name" content="SUSHI App" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta
                        name="apple-mobile-web-app-status-bar-style"
                        content="default"
                    />
                    <meta
                        name="apple-mobile-web-app-title"
                        content="SUSHI App"
                    />
                    <meta
                        name="description"
                        content="Best PWA App in the world"
                    />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta
                        name="msapplication-config"
                        content="/static/icons/browserconfig.xml"
                    />
                    <meta name="msapplication-TileColor" content="#0D0415" />
                    <meta name="msapplication-tap-highlight" content="no" />
                    <meta name="theme-color" content="#F338C3" />

                    <link
                        rel="apple-touch-icon"
                        href="/static/icons/touch-icon-iphone.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="152x152"
                        href="/static/icons/touch-icon-ipad.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href="/static/icons/touch-icon-iphone-retina.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="167x167"
                        href="/static/icons/touch-icon-ipad-retina.png"
                    />

                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href="/static/icons/favicon-32x32.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                        href="/static/icons/favicon-16x16.png"
                    />
                    <link rel="manifest" href="/static/manifest.json" />
                    <link
                        rel="mask-icon"
                        href="/static/icons/safari-pinned-tab.svg"
                        color="#5bbad5"
                    />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    {/* <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' /> */}

                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:url" content="https://sushi.com" />
                    <meta name="twitter:title" content="SUSHI App" />
                    <meta
                        name="twitter:description"
                        content="Best PWA App in the world"
                    />
                    <meta
                        name="twitter:image"
                        content="https://sushi.com/static/icons/android-chrome-192x192.png"
                    />
                    <meta name="twitter:creator" content="@SushiSwap" />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="SUSHI App" />
                    <meta
                        property="og:description"
                        content="Best PWA App in the world"
                    />
                    <meta property="og:site_name" content="SUSHI App" />
                    <meta property="og:url" content="https://sushi.com" />
                    <meta
                        property="og:image"
                        content="https://sushi.com/static/icons/apple-touch-icon.png"
                    />

                    {/* apple splash screen images */}
                    <link
                        rel="apple-touch-startup-image"
                        href="/static/images/apple_splash_2048.png"
                        sizes="2048x2732"
                    />
                    <link
                        rel="apple-touch-startup-image"
                        href="/static/images/apple_splash_1668.png"
                        sizes="1668x2224"
                    />
                    <link
                        rel="apple-touch-startup-image"
                        href="/static/images/apple_splash_1536.png"
                        sizes="1536x2048"
                    />
                    <link
                        rel="apple-touch-startup-image"
                        href="/static/images/apple_splash_1125.png"
                        sizes="1125x2436"
                    />
                    <link
                        rel="apple-touch-startup-image"
                        href="/static/images/apple_splash_1242.png"
                        sizes="1242x2208"
                    />
                    <link
                        rel="apple-touch-startup-image"
                        href="/static/images/apple_splash_750.png"
                        sizes="750x1334"
                    />
                    <link
                        rel="apple-touch-startup-image"
                        href="/static/images/apple_splash_640.png"
                        sizes="640x1136"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
