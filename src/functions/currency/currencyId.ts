import { ChainId, Currency } from '@sushiswap/sdk'

export function currencyId(currency: Currency): string {
  if ([ChainId.CELO].includes(currency.chainId)) {
    return currency.wrapped.address
  }

  if (currency.isNative) return 'ETH'

  if (currency.isToken) return currency.address
  throw new Error('invalid currency')
}

// export function currencyId(
//   currency: Currency,
//   chainId = ChainId.MAINNET
// ): string {
//   if (currency === Currency.getNativeCurrency(chainId))
//     return Currency.getNativeCurrencySymbol(chainId);
//   if (currency instanceof Token) return currency.address;
//   throw new Error("invalid currency");
// }
