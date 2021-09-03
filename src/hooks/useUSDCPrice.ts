import { ChainId, Currency, CurrencyAmount, Price, Token, USDC } from '@sushiswap/sdk'

import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { useV2TradeExactOut } from './useV2Trades'

// import { wrappedCurrency } from "../functions/currency/wrappedCurrency";

// Stablecoin amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
const STABLECOIN_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.MAINNET]: CurrencyAmount.fromRawAmount(USDC[ChainId.MAINNET], 100_000e6),
  [ChainId.ROPSTEN]: CurrencyAmount.fromRawAmount(USDC[ChainId.ROPSTEN], 100_000e6),
  [ChainId.KOVAN]: CurrencyAmount.fromRawAmount(USDC[ChainId.KOVAN], 100_000e6),
  [ChainId.MATIC]: CurrencyAmount.fromRawAmount(USDC[ChainId.MATIC], 100_000e6),
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(USDC[ChainId.FANTOM], 100_000e6),
  [ChainId.BSC]: CurrencyAmount.fromRawAmount(USDC[ChainId.BSC], 100_000e18),
  [ChainId.HARMONY]: CurrencyAmount.fromRawAmount(USDC[ChainId.HARMONY], 100_000e6),
  [ChainId.HECO]: CurrencyAmount.fromRawAmount(USDC[ChainId.HECO], 100_000e6),
  [ChainId.OKEX]: CurrencyAmount.fromRawAmount(USDC[ChainId.OKEX], 100_000e18),
  [ChainId.XDAI]: CurrencyAmount.fromRawAmount(USDC[ChainId.XDAI], 100_000e6),
  [ChainId.ARBITRUM]: CurrencyAmount.fromRawAmount(USDC[ChainId.ARBITRUM], 100_000e6),
  [ChainId.CELO]: undefined,
}

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price<Currency, Token> | undefined {
  const { chainId } = useActiveWeb3React()

  const amountOut = chainId ? STABLECOIN_AMOUNT_OUT[chainId] : undefined
  const stablecoin = amountOut?.currency

  const v2USDCTrade = useV2TradeExactOut(currency, amountOut, {
    maxHops: 3,
  })

  return useMemo(() => {
    if (!currency || !stablecoin) {
      return undefined
    }

    // handle usdc
    if (currency?.wrapped.equals(stablecoin)) {
      return new Price(stablecoin, stablecoin, '1', '1')
    }

    // use v2 price if available
    if (v2USDCTrade) {
      const { numerator, denominator } = v2USDCTrade.route.midPrice
      return new Price(currency, stablecoin, denominator, numerator)
    }

    return undefined
  }, [currency, stablecoin, v2USDCTrade])
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
