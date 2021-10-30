import { ChainId, Currency, NATIVE, WNATIVE } from '@sushiswap/core-sdk'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency

  if (currency.chainId in ChainId && currency.equals(WNATIVE[currency.chainId])) return NATIVE[currency.chainId]

  return currency
}
