import { ChainId, Currency, WNATIVE } from '@sushiswap/sdk'
import React, { FC, useMemo } from 'react'

import Image from 'next/image'
import Logo from '../Logo'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import { getMaticTokenLogoURL } from '../../constants/maticTokenMapping'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import useHttpLocations from '../../hooks/useHttpLocations'

const AvalancheLogo = '/images/tokens/avax-sqaure.jpg'
const BinanceCoinLogo = '/images/tokens/bnb-square.jpg'
const EthereumLogo = '/images/tokens/eth-square.jpg'
const FantomLogo = '/images/tokens/ftm-square.jpg'
const HarmonyLogo = '/images/native-tokens/one.png'
const HecoLogo = '/images/tokens/heco-square.jpg'
const MaticLogo = '/images/tokens/polygon-square.jpg'
const MoonbeamLogo = '/images/tokens/eth-square.jpg'
const OKExLogo = '/images/native-tokens/okt.png'
const xDaiLogo = '/images/native-tokens/xdai.png'
const CeloLogo = '/images/tokens/celo-square.jpg'

export const getTokenLogoURL = (address: string, chainId: ChainId) => {
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

const logo: { readonly [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: EthereumLogo,
  [ChainId.FANTOM]: FantomLogo,
  [ChainId.FANTOM_TESTNET]: FantomLogo,
  [ChainId.MATIC]: MaticLogo,
  [ChainId.MATIC_TESTNET]: MaticLogo,
  [ChainId.XDAI]: xDaiLogo,
  [ChainId.BSC]: BinanceCoinLogo,
  [ChainId.BSC_TESTNET]: BinanceCoinLogo,
  [ChainId.MOONBEAM_TESTNET]: MoonbeamLogo,
  [ChainId.AVALANCHE]: AvalancheLogo,
  [ChainId.AVALANCHE_TESTNET]: AvalancheLogo,
  [ChainId.HECO]: HecoLogo,
  [ChainId.HECO_TESTNET]: HecoLogo,
  [ChainId.HARMONY]: HarmonyLogo,
  [ChainId.HARMONY_TESTNET]: HarmonyLogo,
  [ChainId.OKEX]: OKExLogo,
  [ChainId.OKEX_TESTNET]: OKExLogo,
  [ChainId.ARBITRUM]: EthereumLogo,
  [ChainId.ARBITRUM_TESTNET]: EthereumLogo,
  [ChainId.CELO]: CeloLogo,
}

interface CurrencyLogoProps {
  currency?: Currency
  size?: string | number
  style?: React.CSSProperties
  className?: string
  squared?: boolean
}

const CurrencyLogo: FC<CurrencyLogoProps> = ({ currency, size = '24px', style, className = '', squared = true }) => {
  const { chainId } = useActiveWeb3React()
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (!currency || currency.isNative) return []

    if (currency.isToken) {
      const defaultUrls = currency.chainId === 1 ? [getTokenLogoURL(currency.address, 1)] : []
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls]
      }
      return defaultUrls
    }
    return []
  }, [currency, uriLocations])

  if (currency?.isNative || currency === WNATIVE[chainId]) {
    return (
      <Image
        width={size}
        height={size}
        alt={currency.symbol}
        className={`${squared ? 'rounded' : 'rounded-full'} ${className}`}
        src={logo[chainId] || `/images/tokens/unknown.png`}
        layout="fixed"
      />
    )
  }

  // console.log({ currency })

  return (
    <Logo
      width={size}
      height={size}
      className={`${squared ? 'rounded' : 'rounded-full'} ${className}`}
      style={style}
      srcs={srcs}
      alt={`${currency?.symbol ?? 'token'} logo`}
    />
  )
}

export default CurrencyLogo
