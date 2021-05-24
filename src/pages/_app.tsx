import '../bootstrap'
import '../styles/globals.css'
import '@fontsource/dm-sans/index.css'
import 'react-tabs/style/react-tabs.css'

import LanguageProvider, { activate } from '../language'

import type { AppProps } from 'next/app'
import ApplicationUpdater from '../state/application/updater'
import { GlobalStyle } from '../theme'
import Head from 'next/head'
import { KashiProvider } from '../context'
import ListsUpdater from '../state/lists/updater'
import MulticallUpdater from '../state/multicall/updater'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
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

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        // Activate the default locale on page load
        activate('en')
    }, [])
    const router = useRouter()

    // TODO: Refactor KashiProvider to /state/kashi to align with rest of app currently
    const KashiDataProvider =
        router.asPath.includes('/lend') || router.asPath.includes('/borrow') || router.asPath.includes('/create')
            ? KashiProvider
            : NOOP
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                />
                <meta name="description" content="Description" />
                <meta name="keywords" content="Keywords" />
                <title>Sushi</title>

                <link rel="manifest" href="/manifest.json" />
                <link href="/icons/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
                <link href="/icons/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
                <link rel="apple-touch-icon" href="/apple-icon.png"></link>
                <meta name="theme-color" content="#F338C3" />
            </Head>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Web3ProviderNetwork getLibrary={getLibrary}>
                    <LanguageProvider>
                        <GlobalStyle />
                        <ThemeProvider theme={{}}>
                            <Provider store={store}>
                                <KashiDataProvider>
                                    <Updaters />
                                    <Web3ReactManager>
                                        <Component {...pageProps} />
                                    </Web3ReactManager>
                                </KashiDataProvider>
                            </Provider>
                        </ThemeProvider>
                    </LanguageProvider>
                </Web3ProviderNetwork>
            </Web3ReactProvider>
        </>
    )
}

export default MyApp
