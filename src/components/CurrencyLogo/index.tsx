import { ChainId, Currency, ETHER, Token } from '@sushiswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import AvalancheLogo from '../../assets/images/avalanche-logo.png'
import BinanceCoinLogo from '../../assets/images/binance-coin-logo.png'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import FantomLogo from '../../assets/images/fantom-logo.png'
import HarmonyLogo from '../../assets/images/harmony-logo.png'
import HecoLogo from '../../assets/images/heco-logo.png'
import MaticLogo from '../../assets/images/matic-logo.png'
import MoonbeamLogo from '../../assets/images/moonbeam-logo.png'
import xDaiLogo from '../../assets/images/xdai-logo.png'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

import { getMaticTokenLogoURL } from '../../constants/maticTokenMapping'

const getTokenLogoURL = (address: string, chainId: any) => {
    let imageURL
    if (chainId === ChainId.MAINNET) {
        imageURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
    } else if (chainId === ChainId.BSC) {
        imageURL = `https://v1exchange.pancakeswap.finance/images/coins/${address}.png`
    } else if (chainId === ChainId.MATIC) {
        imageURL = getMaticTokenLogoURL(address)
    } else {
        imageURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
    }
    return imageURL
}

const StyledNativeCurrencyLogo = styled.img<{ size: string }>`
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
    border-radius: 10px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    // border-radius: ${({ size }) => size};
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
    // background-color: ${({ theme }) => theme.white};
`

const logo: { readonly [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: EthereumLogo,
    [ChainId.FANTOM]: FantomLogo,
    [ChainId.FANTOM_TESTNET]: FantomLogo,
    [ChainId.MATIC]: MaticLogo,
    [ChainId.MATIC_TESTNET]: MaticLogo,
    [ChainId.XDAI]: xDaiLogo,
    [ChainId.BSC]: BinanceCoinLogo,
    [ChainId.BSC_TESTNET]: BinanceCoinLogo,
    [ChainId.MOONBASE]: MoonbeamLogo,
    [ChainId.AVALANCHE]: AvalancheLogo,
    [ChainId.FUJI]: AvalancheLogo,
    [ChainId.HECO]: HecoLogo,
    [ChainId.HECO_TESTNET]: HecoLogo,
    [ChainId.HARMONY]: HarmonyLogo,
    [ChainId.HARMONY_TESTNET]: HarmonyLogo
}

export default function CurrencyLogo({
    currency,
    size = '24px',
    style
}: {
    currency?: Currency
    size?: string
    style?: React.CSSProperties
}) {
    const { chainId } = useActiveWeb3React()
    const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

    const srcs: string[] = useMemo(() => {
        if (currency === ETHER) return []

        if (currency instanceof Token) {
            if (currency instanceof WrappedTokenInfo) {
                return [...uriLocations, getTokenLogoURL(currency.address, chainId)]
            }

            return [getTokenLogoURL(currency.address, chainId)]
        }
        return []
    }, [chainId, currency, uriLocations])

    if (currency === ETHER && chainId) {
        return <StyledNativeCurrencyLogo src={logo[chainId]} size={size} style={style} />
    }

    return <StyledLogo size={size} srcs={srcs} alt={`${currency?.getSymbol(chainId) ?? 'token'} logo`} style={style} />
}
