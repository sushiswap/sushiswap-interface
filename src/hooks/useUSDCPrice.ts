import { ChainId, Currency, CurrencyAmount, Price, Token, TradeType, USD } from '@sushiswap/core-sdk'
import { useBestTridentTrade } from 'app/hooks/useBestTridentTrade'
import { useMemo } from 'react'

import { useActiveWeb3React } from '../services/web3'

// StableCoin amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
export const STABLECOIN_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.ETHEREUM]: CurrencyAmount.fromRawAmount(USD[ChainId.ETHEREUM], 100_000e6),
  [ChainId.ROPSTEN]: CurrencyAmount.fromRawAmount(USD[ChainId.ROPSTEN], 100_000e6),
  [ChainId.KOVAN]: CurrencyAmount.fromRawAmount(USD[ChainId.KOVAN], 100_000e6),
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
  const tridentAmountOut = useMemo(
    () => (chainId ? CurrencyAmount.fromRawAmount(USD[chainId], '1000000') : undefined),
    [chainId]
  )
  const stableCoin = amountOut?.currency

  const { trade } = useBestTridentTrade(TradeType.EXACT_OUTPUT, tridentAmountOut, currency)

  return useMemo(() => {
    if (!currency || !stableCoin) {
      return undefined
    }

    // handle usdc
    if (currency?.wrapped.equals(stableCoin)) {
      return new Price(stableCoin, stableCoin, '1', '1')
    }

    if (trade) {
      const { numerator, denominator } = trade.executionPrice
      return new Price(currency, stableCoin, denominator, numerator)
    }

    return undefined
  }, [currency, stableCoin, trade])
}

export function useUSDCValue(currencyAmount: CurrencyAmount<Currency> | undefined | null) {
  const price = useUSDCPrice(currencyAmount?.currency)

  return useMemo(() => {
    if (!price || !currencyAmount) return null
    try {
      return price.quote(currencyAmount)
    } catch (error) {
      return null
    }
  }, [currencyAmount, price])
}
