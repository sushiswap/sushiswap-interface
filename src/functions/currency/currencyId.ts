// TODO (amiller68): #SdkChange Not use the SDK's ChainId enum
import { Currency } from '@figswap/core-sdk'

export function currencyId(currency: Currency): string {
  // Note (amiller68): #WallabyOnly
  // if ([ChainId.CELO].includes(currency.chainId)) {
  //   return currency.wrapped.address
  // }

  // Note (amiller68): #WallabyOnly - Our native currency is FIL or tFIL
  // if (currency.isNative) return 'ETH'
  if (currency.isNative) return currency.symbol ?? 'FIL'

  if (currency.isToken) return currency.address

  throw new Error('invalid currency')
}
