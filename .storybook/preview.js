import '../src/styles/index.css'
import { i18n } from '@lingui/core'
import * as plurals from 'make-plural'
import { I18nProvider } from '@lingui/react'
import Web3ReactManager from '../src/components/Web3ReactManager'
import Web3ProviderNetwork from '../src/components/Web3ProviderNetwork'
import { Web3ReactProvider } from '@web3-react/core'
import getLibrary from '../src/functions/getLibrary'
import store from '../src/state'
import { Provider as ReduxProvider } from 'react-redux'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => {
    i18n.loadLocaleData('en', { plurals: plurals['en'] })
    i18n.load('en', {})
    i18n.activate('en')

    return (
      <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <ReduxProvider store={store}>
                <Story />
              </ReduxProvider>
            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </I18nProvider>
    )
  },
]
