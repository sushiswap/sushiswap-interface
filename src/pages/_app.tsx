import '../bootstrap'
import '../styles/index.css'
import '@fontsource/dm-sans/index.css'
import 'react-tabs/style/react-tabs.css'

import * as Fathom from 'fathom-client'

import LanguageProvider, { activate } from '../language'

import type { AppProps } from 'next/app'
import ApplicationUpdater from '../state/application/updater'
import Head from 'next/head'
import { KashiProvider } from '../context'
import ListsUpdater from '../state/lists/updater'
import MulticallUpdater from '../state/multicall/updater'
import { Provider } from 'react-redux'
import ReactGA from 'react-ga'
import TransactionUpdater from '../state/transactions/updater'
import UserUpdater from '../state/user/updater'
import Web3ReactManager from '../components/Web3ReactManager'
import { Web3ReactProvider } from '@web3-react/core'
import dynamic from 'next/dynamic'
import getLibrary from '../functions/getLibrary'
import store from '../state'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Web3ProviderNetwork = dynamic(
    () => import('../components/Web3ProviderNetwork'),
    { ssr: false }
)

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

    const { pathname, query } = router

    useEffect(() => {
        // Initialize Fathom when the app loads
        // Example: yourdomain.com
        //  - Do not include https://
        //  - This must be an exact match of your domain.
        //  - If you're using www. for your domain, make sure you include that here.
        Fathom.load('JXKVUKNN', {
            includedDomains: ['sushiswap-interface-canary.vercel.app'],
        })

        function onRouteChangeComplete() {
            Fathom.trackPageview()
        }
        // Record a pageview when route changes
        router.events.on('routeChangeComplete', onRouteChangeComplete)

        // Unassign event listener
        return () => {
            router.events.off('routeChangeComplete', onRouteChangeComplete)
        }
    }, [])

    useEffect(() => {
        ReactGA.pageview(`${pathname}${query}`)
    }, [pathname, query])

    // TODO: Refactor KashiProvider to /state/kashi to align with rest of app currently
    const isKashi = ['/lend', '/borrow', '/create', '/balances'].some((path) =>
        router.asPath.includes(path)
    )

    // const Layout = isKashi
    //     ? ({ children }) => (
    //           <KashiProvider>
    //               <KashiLayout>{children}</KashiLayout>
    //           </KashiProvider>
    //       )
    //     : ({ children }) => <DefaultLayout>{children}</DefaultLayout>

    const KashiDataProvider = isKashi ? KashiProvider : NOOP

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
                        <Provider store={store}>
                            <Updaters />
                            <Web3ReactManager>
                                <KashiDataProvider>
                                    <Component {...pageProps} />
                                </KashiDataProvider>
                            </Web3ReactManager>
                        </Provider>
                    </LanguageProvider>
                </Web3ProviderNetwork>
            </Web3ReactProvider>
        </>
    )
}

export default MyApp
