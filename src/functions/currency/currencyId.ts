import { ChainId, Currency, Token } from '@sushiswap/sdk'

export function currencyId(
    currency: Currency,
    chainId = ChainId.MAINNET
): string {
    console.log({ currency }, Currency.getNativeCurrency(chainId))
    if (currency === Currency.getNativeCurrency(chainId))
        return Currency.getNativeCurrencySymbol(chainId)
    if (currency instanceof Token) return currency.address
    throw new Error('invalid currency')
}
