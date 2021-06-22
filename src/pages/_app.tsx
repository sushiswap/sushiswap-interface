import '../bootstrap'
import '../styles/index.css'
import '@fontsource/dm-sans/index.css'
import 'react-tabs/style/react-tabs.css'

import LanguageProvider, { activate } from '../language'

import type { AppProps } from 'next/app'
import ApplicationUpdater from '../state/application/updater'
import DefaultLayout from '../layouts/Default'
import { FC } from 'react'
import Head from 'next/head'
import ListsUpdater from '../state/lists/updater'
import MulticallUpdater from '../state/multicall/updater'
import { NextComponentType } from 'next'
import { Provider } from 'react'
import ReactGA from 'react-ga'
import { Provider as ReduxProvider } from 'react-redux'
import TransactionUpdater from '../state/transactions/updater'
import UserUpdater from '../state/user/updater'
import Web3ReactManager from '../components/Web3ReactManager'
import { Web3ReactProvider } from '@web3-react/core'
import dynamic from 'next/dynamic'
import getLibrary from '../functions/getLibrary'
import store from '../state'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Web3ProviderNetwork = dynamic(() => import('../components/Web3ProviderNetwork'), { ssr: false })

if (typeof window !== 'undefined' && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

const NOOP = ({ children }) => children

function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextComponentType & {
    Layout: FC
    Provider: any
  }
}) {
  useEffect(() => {
    // Activate the default locale on page load
    activate('en')
  }, [])
  const router = useRouter()

  const { pathname, query } = router

  useEffect(() => {
    ReactGA.pageview(`${pathname}${query}`)
  }, [pathname, query])

  // Allows for conditionally setting a provider to be hoisted per page
  const Provider = Component.Provider || NOOP

  // Allows for conditionally setting a layout to be hoisted per page
  const Layout = Component.Layout || (({ children }) => <DefaultLayout>{children}</DefaultLayout>)

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <LanguageProvider>
            <Web3ReactManager>
              <ReduxProvider store={store}>
                <Updaters />
                <Provider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </Provider>
              </ReduxProvider>
            </Web3ReactManager>
          </LanguageProvider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </>
  )
}

export default MyApp
