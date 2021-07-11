import { ANALYTICS_URL } from '../../constants'
import { ChainId } from '@sushiswap/sdk'
import ExternalLink from '../ExternalLink'
import Polling from '../Polling'
import { t } from '@lingui/macro'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

const Footer = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  return (
    // <footer className="absolute bottom-0 flex items-center justify-between w-screen h-20 p-4 mx-auto text-center text-low-emphesis">
    <footer className="flex-shrink-0 w-full">
      <div className="flex items-center justify-between h-20 px-4">
        {chainId && chainId in ANALYTICS_URL && (
          <ExternalLink
            id={`analytics-nav-link`}
            href={ANALYTICS_URL[chainId] || 'https://analytics.sushi.com'}
            className="text-low-emphesis"
          >
            <div className="flex items-center space-x-2">
              <div>{i18n._(t`Analytics`)}</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </ExternalLink>
        )}
        {chainId && chainId === ChainId.MATIC && (
          <ExternalLink
            id={`polygon-bridge-link`}
            href="https://wallet.matic.network/bridge/"
            className="text-low-emphesis"
          >
            {i18n._(t`Matic Bridge`)}
          </ExternalLink>
        )}
        {chainId && chainId === ChainId.HARMONY && (
          <ExternalLink
            id={`harmony-bridge-link`}
            href=" https://bridge.harmony.one/tokens"
            className="text-low-emphesis"
          >
            {i18n._(t`Harmony Bridge`)}
          </ExternalLink>
        )}
        <Polling />
      </div>
    </footer>
  )
}

export default Footer
