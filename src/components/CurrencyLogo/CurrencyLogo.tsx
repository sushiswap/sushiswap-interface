// TODO (amiller68): #SdkChange / #SdkPublish
import { ChainId, Currency, WNATIVE } from '@figswap/core-sdk'
import useHttpLocations from 'app/hooks/useHttpLocations'
import { WrappedTokenInfo } from 'app/state/lists/wrappedTokenInfo'
import React, { FunctionComponent, useMemo } from 'react'

import Logo, { UNKNOWN_ICON } from '../Logo'

  // TODO (amiller68): #FilecoinMainnet

const BLOCKCHAIN = {
  [ChainId.WALLABY]: 'wallaby',
}

// @ts-ignore TYPE NEEDS FIXING
export const getCurrencyLogoUrls = (currency: Currency): string[] => {
  const urls: string[] = []

  // TODO (amiller68): Host proper logos on github
  if (currency.chainId in BLOCKCHAIN) {
    // For now, all we need is USDC. It should be hosted here
    urls.push(
      `https://raw.githubusercontent.com/banyancomputer/interface/master/.github/logos/${
        // @ts-ignore TYPE NEEDS FIXING
        BLOCKCHAIN[currency.chainId]
      }/${currency.symbol?.toLowerCase()}.svg`
    )
    // TODO (amiller68): Add fallbacks for other tokens
  }
  return urls
}

const FilecoinLogo = 'https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=007'

const LOGO: Record<number, string> = {
  [ChainId.WALLABY]: FilecoinLogo,
}

export interface CurrencyLogoProps {
  currency?: Currency
  size?: string | number
  style?: React.CSSProperties
  className?: string
}

const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({ currency, size = '24px', className, style }) => {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI || currency.tokenInfo.logoURI : undefined
  )
  const srcs: string[] = useMemo(() => {
    if (currency?.isNative || currency?.equals(WNATIVE[currency.chainId])) {
      // @ts-ignore TYPE NEEDS FIXING
      return [LOGO[currency.chainId], UNKNOWN_ICON]
    }

    if (currency?.isToken) {
      const defaultUrls = [...getCurrencyLogoUrls(currency)]
      // console.log({ defaultUrls })

      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls, UNKNOWN_ICON]
      }
      return defaultUrls
    }

    return [UNKNOWN_ICON]
  }, [currency, uriLocations])

  return <Logo srcs={srcs} width={size} height={size} alt={currency?.symbol} className={className} style={style} />
}

export default CurrencyLogo
