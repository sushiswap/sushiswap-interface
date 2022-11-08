// TODO (amiller68): #SdkChange Not use the SDK's ChainId enum
import { Currency } from 'sdk'

export function currencyId(currency: Currency): string {
  // Note (amiller68): #WallabyOnly
  // if ([ChainId.CELO].includes(currency.chainId)) {
  //   return currency.wrapped.address
  // }

  if (currency.isNative) return 'ETH'

  if (currency.isToken) return currency.address

  throw new Error('invalid currency')
}
