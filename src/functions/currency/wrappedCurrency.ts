import { ChainId, Currency, NATIVE, WNATIVE } from '@sushiswap/sdk'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency

  // if (formattedChainId && currency.equals(WETH9_EXTENDED[formattedChainId]))
  //   return ExtendedEther.onChain(currency.chainId)

  if (currency.chainId in ChainId && currency.equals(WNATIVE[currency.chainId])) return NATIVE[currency.chainId]

  return currency
}
