import '../bootstrap'
import '../styles/index.css'
import '@fontsource/dm-sans/index.css'
import 'react-virtualized/styles.css'
import 'react-tabs/style/react-tabs.css'

import * as plurals from 'make-plural/plurals'

import { Fragment, FunctionComponent } from 'react'
import { NextComponentType, NextPageContext } from 'next'
import store, { persistor } from '../state'

import type { AppProps } from 'next/app'
import ApplicationUpdater from '../state/application/updater'
import DefaultLayout from '../layouts/Default'
import Head from 'next/head'
import { I18nProvider } from '@lingui/react'
import ListsUpdater from '../state/lists/updater'
import MulticallUpdater from '../state/multicall/updater'
import { PersistGate } from 'redux-persist/integration/react'
import ReactGA from 'react-ga'
import { Provider as ReduxProvider } from 'react-redux'
import TransactionUpdater from '../state/transactions/updater'
import UserUpdater from '../state/user/updater'
import Web3ReactManager from '../components/Web3ReactManager'
import { Web3ReactProvider } from '@web3-react/core'
import dynamic from 'next/dynamic'
import getLibrary from '../functions/getLibrary'
import { i18n } from '@lingui/core'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Web3ProviderNetwork = dynamic(() => import('../components/Web3ProviderNetwork'), { ssr: false })

if (typeof window !== 'undefined' && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextComponentType<NextPageContext> & {
    Layout: FunctionComponent
    Provider: FunctionComponent
  }
}) {
  const router = useRouter()

  const { pathname, query, locale } = router

  useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, { testMode: process.env.NODE_ENV === 'development' })

    const errorHandler = (error) => {
      ReactGA.exception({
        description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
        fatal: true,
      })
    }

    window.addEventListener('error', errorHandler)

    return () => window.removeEventListener('error', errorHandler)
  }, [])

  useEffect(() => {
    ReactGA.pageview(`${pathname}${query}`)
  }, [pathname, query])

  useEffect(() => {
    async function load(locale) {
      const { messages } = await import(`@lingui/loader!./../../locale/${locale}.po`)
      i18n.loadLocaleData(locale, { plurals: plurals[locale] })
      i18n.load(locale, messages)
      i18n.activate(locale)
    }
    load(locale)
  }, [locale])

  // Allows for conditionally setting a provider to be hoisted per page
  const Provider = Component.Provider || Fragment

  // Allows for conditionally setting a layout to be hoisted per page
  const Layout = Component.Layout || DefaultLayout

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title key="title">SUSHI</title>
        <meta
          name="description"
          content="Be a DeFi Chef with Sushi. Swap, earn, stack yields, lend, borrow, leverage all on one decentralized, community driven platform. Welcome home to DeFi"
        />

        <meta name="application-name" content="SUSHI App" />
        <meta name="apple-mobile-web-app-title" content="SUSHI App" />

        <meta name="twitter:url" content="https://app.sushi.com" />
        <meta name="twitter:title" content="SUSHI App" />
        <meta
          name="twitter:description"
          content="Be a DeFi Chef with Sushi. Swap, earn, stack yields, lend, borrow, leverage all on one decentralized, community driven platform. Welcome home to DeFi"
        />
        <meta name="twitter:image" content="https://app.sushi.com/icons/icon-192x192.png" />

        <meta key="og:title" property="og:title" content="SUSHI App" />
        <meta key="og:site_name" property="og:site_name" content="SUSHI App" />
        <meta key="og:url" property="og:url" content="https://app.sushi.com" />
        <meta key="og:image" property="og:image" content="https://app.sushi.com/apple-touch-icon.png" />
        <meta
          key="og:description"
          property="og:description"
          content="Be a DeFi Chef with Sushi. Swap, earn, stack yields, lend, borrow, leverage all on one decentralized, community driven platform. Welcome home to DeFi"
        />
      </Head>
      <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <ReduxProvider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <>
                    <ListsUpdater />
                    <UserUpdater />
                    <ApplicationUpdater />
                    <TransactionUpdater />
                    <MulticallUpdater />
                  </>
                  <Provider>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </Provider>
                </PersistGate>
              </ReduxProvider>
            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </I18nProvider>
    </>
  )
}

export default MyApp
