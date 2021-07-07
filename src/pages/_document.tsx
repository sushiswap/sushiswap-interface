import Document, { Head, Html, Main, NextScript } from 'next/document'

import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
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
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="SUSHI App" />
          <meta
            name="description"
            content="Be a DeFi Chef with Sushi. Swap, earn, stack yields, lend, borrow, leverage all on one decentralized, community driven platform. Welcome home to DeFi"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#F338C3" />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

          <link rel="manifest" href="/site.webmanifest" />

          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />

          <link rel="apple-touch-icon" href="/touch-icon-iphone.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/touch-icon-ipad.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/touch-icon-iphone-retina.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/touch-icon-ipad-retina.png" />

          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-precomposed.png" />

          <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
          <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/apple-touch-icon-57x57-precomposed.png" />

          <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
          <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/apple-touch-icon-60x60-precomposed.png" />

          <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
          <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/apple-touch-icon-72x72-precomposed.png" />

          <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
          <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/apple-touch-icon-76x76-precomposed.png" />

          <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
          <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/apple-touch-icon-114x114-precomposed.png" />

          <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
          <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/apple-touch-icon-120x120-precomposed.png" />

          <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
          <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/apple-touch-icon-144x144-precomposed.png" />

          <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
          <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/apple-touch-icon-152x152-precomposed.png" />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
          <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-180x180-precomposed.png" />

          <link
            href="/iphone5_splash.png"
            media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/iphone6_splash.png"
            media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/iphoneplus_splash.png"
            media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/iphonex_splash.png"
            media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/iphonexr_splash.png"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/iphonexsmax_splash.png"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/ipad_splash.png"
            media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/ipadpro1_splash.png"
            media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/ipadpro3_splash.png"
            media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/ipadpro2_splash.png"
            media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />

          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="shortcut icon" href="/favicon.ico" />

          <link rel="manifest" href="/manifest.json" />

          {/* <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' /> */}

          <meta name="twitter:card" content="app" />
          <meta name="twitter:url" content="https://sushi.com" />
          <meta name="twitter:title" content="SUSHI App" />
          <meta
            name="twitter:description"
            content="Be a DeFi Chef with Sushi. Swap, earn, stack yields, lend, borrow, leverage all on one decentralized, community driven platform. Welcome home to DeFi"
          />
          <meta name="twitter:image" content="https://app.sushi.com/icons/icon-192x192.png" />
          <meta name="twitter:creator" content="@SushiSwap" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="SUSHI App" />

          <meta property="og:site_name" content="SUSHI App" />
          <meta property="og:url" content="https://sushi.com" />
          <meta property="og:image" content="https://app.sushi.com/apple-touch-icon.png" />
          <meta
            key="og:description"
            property="og:description"
            content="Be a DeFi Chef with Sushi. Swap, earn, stack yields, lend, borrow, leverage all on one decentralized, community driven platform. Welcome home to DeFi"
          />

          {/* apple splash screen images */}
          {/* <link rel="apple-touch-startup-image" href="/images/apple_splash_2048.png" sizes="2048x2732" />
          <link rel="apple-touch-startup-image" href="/images/apple_splash_1668.png" sizes="1668x2224" />
          <link rel="apple-touch-startup-image" href="/images/apple_splash_1536.png" sizes="1536x2048" />
          <link rel="apple-touch-startup-image" href="/images/apple_splash_1125.png" sizes="1125x2436" />
          <link rel="apple-touch-startup-image" href="/images/apple_splash_1242.png" sizes="1242x2208" />
          <link rel="apple-touch-startup-image" href="/images/apple_splash_750.png" sizes="750x1334" />
          <link rel="apple-touch-startup-image" href="/images/apple_splash_640.png" sizes="640x1136" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
