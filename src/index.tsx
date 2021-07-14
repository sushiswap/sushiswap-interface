import './styles/index.css'
import '@fontsource/dm-sans/index.css'
import 'react-tabs/style/react-tabs.css'
import './bootstrap'

import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { KashiProvider } from 'kashi'
import React, { StrictMode } from 'react'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import Blocklist from './components/Blocklist'
import { NetworkContextName } from './constants'
import App from './pages/App'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'
import LanguageProvider from 'language'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false
}

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID)
    ReactGA.set({
        customBrowserType: !isMobile
            ? 'desktop'
            : 'web3' in window || 'ethereum' in window
            ? 'mobileWeb3'
            : 'mobileRegular'
    })
} else {
    ReactGA.initialize('test', { testMode: true, debug: true })
}

window.addEventListener('error', error => {
    ReactGA.exception({
        description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
        fatal: true
    })
})

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

ReactDOM.render(
    <StrictMode>
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
                <Blocklist>
                    <Provider store={store}>
                        <Updaters />
                        <LanguageProvider>
                            <ThemeProvider>
                                <ThemedGlobalStyle />
                                <KashiProvider>
                                    <Router>
                                        <App />
                                    </Router>
                                </KashiProvider>
                            </ThemeProvider>
                        </LanguageProvider>
                    </Provider>
                </Blocklist>
            </Web3ProviderNetwork>
        </Web3ReactProvider>
    </StrictMode>,
    document.getElementById('root')
)
