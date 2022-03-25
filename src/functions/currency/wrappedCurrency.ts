import { ChainId, Currency, NATIVE, WNATIVE } from '@sushiswap/core-sdk'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency

  // @ts-ignore TYPE NEEDS FIXING
  if (currency.chainId in ChainId && currency.equals(WNATIVE[currency.chainId])) return NATIVE[currency.chainId]

  return currency
}

// [#sushiguard]
export const isWrappedReturnNativeSymbol = (chainId: ChainId | undefined, address: string): string => {
  if (!chainId) return address
  if (address.toLowerCase() === WNATIVE[chainId].address.toLowerCase()) {
    return NATIVE[chainId].symbol || address
  }

  return address
}
