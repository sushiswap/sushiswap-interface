import { ChainId, Currency, CurrencyAmount, Price, Token, USD } from '@sushiswap/core-sdk'
import { calcTokenPrices } from '@sushiswap/trident-sdk'
import { useAllCommonPools } from 'app/hooks/useBestTridentTrade'
import { useMemo } from 'react'

import { useActiveWeb3React } from '../services/web3'

// StableCoin amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
export const STABLECOIN_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.ETHEREUM]: CurrencyAmount.fromRawAmount(USD[ChainId.ETHEREUM], 100_000e6),
  [ChainId.ROPSTEN]: CurrencyAmount.fromRawAmount(USD[ChainId.ROPSTEN], 100_000e6),
  [ChainId.KOVAN]: CurrencyAmount.fromRawAmount(USD[ChainId.KOVAN], 100_000e1),
  [ChainId.MATIC]: CurrencyAmount.fromRawAmount(USD[ChainId.MATIC], 100_000e6),
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(USD[ChainId.FANTOM], 100_000e6),
  [ChainId.BSC]: CurrencyAmount.fromRawAmount(USD[ChainId.BSC], 100_000e18),
  [ChainId.HARMONY]: CurrencyAmount.fromRawAmount(USD[ChainId.HARMONY], 100_000e6),
  [ChainId.HECO]: CurrencyAmount.fromRawAmount(USD[ChainId.HECO], 100_000e6),
  [ChainId.OKEX]: CurrencyAmount.fromRawAmount(USD[ChainId.OKEX], 100_000e18),
  [ChainId.XDAI]: CurrencyAmount.fromRawAmount(USD[ChainId.XDAI], 100_000e6),
  [ChainId.ARBITRUM]: CurrencyAmount.fromRawAmount(USD[ChainId.ARBITRUM], 100_000e6),
  [ChainId.CELO]: CurrencyAmount.fromRawAmount(USD[ChainId.CELO], 100_000e18),
  [ChainId.MOONRIVER]: CurrencyAmount.fromRawAmount(USD[ChainId.MOONRIVER], 100_000e6),
}

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price<Currency, Token> | undefined {
  const { chainId } = useActiveWeb3React()
  const amountOut = chainId ? STABLECOIN_AMOUNT_OUT[chainId] : undefined
  const stableCoin = amountOut?.currency
  const pools = useAllCommonPools(currency, amountOut?.currency)

  return useMemo(() => {
    if (!currency || !stableCoin) {
      return undefined
    }

    if (currency.wrapped.equals(stableCoin)) {
      return new Price(stableCoin, stableCoin, '1', '1')
    }

    try {
      return calcTokenPrices(pools, stableCoin)?.[currency.wrapped.address]
    } catch (e) {
      return undefined
    }
  }, [currency, pools, stableCoin])
}

export function useUSDCValue(currencyAmount: CurrencyAmount<Currency> | undefined) {
  const price = useUSDCPrice(currencyAmount?.wrapped.currency)

  return useMemo(() => {
    if (!price || !currencyAmount) return undefined

    try {
      return price.quote(currencyAmount.wrapped)
    } catch (error) {
      return undefined
    }
  }, [currencyAmount, price])
}
