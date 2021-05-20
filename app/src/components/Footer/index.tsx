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
        <footer className="flex items-center justify-between w-screen p-4 mx-auto text-center text-low-emphesis">
            {chainId && chainId === ChainId.MATIC && (
                <ExternalLink
                    id={`polygon-bridge-link`}
                    href="https://wallet.matic.network/bridge/"
                    className="text-low-emphesis"
                >
                    {i18n._(t`Matic Bridge`)}
                </ExternalLink>
            )}
            {chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.XDAI, ChainId.FANTOM, ChainId.MATIC].includes(chainId) && (
                <ExternalLink
                    id={`analytics-nav-link`}
                    href={ANALYTICS_URL[chainId] || 'https://analytics.sushi.com'}
                    className="text-low-emphesis"
                >
                    {i18n._(t`Analytics`)}
                </ExternalLink>
            )}
            <Polling />
        </footer>
    )
}

export default Footer
