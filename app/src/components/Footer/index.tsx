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
        <footer className="flex-shrink-0">
            <div className="flex items-center justify-between w-screen px-4">
                {chainId &&
                    [ChainId.MAINNET, ChainId.BSC, ChainId.XDAI, ChainId.FANTOM, ChainId.MATIC].includes(chainId) && (
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
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    />
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
                <Polling />
            </div>
        </footer>
    )
}

export default Footer
