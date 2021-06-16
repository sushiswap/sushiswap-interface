import { ChainId, Currency, Token, WETH } from "@sushiswap/sdk";

export function currencyId(
  currency: Currency,
  chainId = ChainId.MAINNET
): string {
  if (currency === Currency.getNativeCurrency(chainId))
    return Currency.getNativeCurrencySymbol(chainId);
  if (currency instanceof Token) return currency.address;
  throw new Error("invalid currency");
}
