import { ChainId, Currency, CurrencyAmount, Price, Token, USD } from '@figswap/core-sdk'
import { useMemo } from 'react'

import { useActiveWeb3React } from '../services/web3'
import { useV2TradeExactOut } from './useV2Trades'

// StableCoin amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
export const STABLECOIN_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  // TODO (amiller68): #FilecoinMainnet - Update these values
  [ChainId.WALLABY]: CurrencyAmount.fromRawAmount(USD[ChainId.WALLABY], 100_000e6),
  // Note (amiller68): #WallabyOnly
  // [ChainId.ETHEREUM]: CurrencyAmount.fromRawAmount(USD[ChainId.ETHEREUM], 100_000e6),
  // [ChainId.ROPSTEN]: CurrencyAmount.fromRawAmount(USD[ChainId.ROPSTEN], 100_000e6),
  // [ChainId.KOVAN]: CurrencyAmount.fromRawAmount(USD[ChainId.KOVAN], 100_000e1),
  // [ChainId.MATIC]: CurrencyAmount.fromRawAmount(USD[ChainId.MATIC], 100_000e6),
  // [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(USD[ChainId.FANTOM], 100_000e6),
  // [ChainId.BSC]: CurrencyAmount.fromRawAmount(USD[ChainId.BSC], 100_000e18),
  // [ChainId.HARMONY]: CurrencyAmount.fromRawAmount(USD[ChainId.HARMONY], 100_000e6),
  // [ChainId.HECO]: CurrencyAmount.fromRawAmount(USD[ChainId.HECO], 100_000e6),
  // [ChainId.OKEX]: CurrencyAmount.fromRawAmount(USD[ChainId.OKEX], 100_000e18),
  // [ChainId.XDAI]: CurrencyAmount.fromRawAmount(USD[ChainId.XDAI], 100_000e6),
  // [ChainId.ARBITRUM]: CurrencyAmount.fromRawAmount(USD[ChainId.ARBITRUM], 100_000e6),
  // [ChainId.CELO]: CurrencyAmount.fromRawAmount(USD[ChainId.CELO], 100_000e18),
  // [ChainId.MOONRIVER]: CurrencyAmount.fromRawAmount(USD[ChainId.MOONRIVER], 100_000e6),
  // [ChainId.FUSE]: CurrencyAmount.fromRawAmount(USD[ChainId.FUSE], 100_000e6),
  // [ChainId.TELOS]: CurrencyAmount.fromRawAmount(USD[ChainId.TELOS], 100_000e6),
  // [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(USD[ChainId.AVALANCHE], 100_000e6),
  // [ChainId.MOONBEAM]: CurrencyAmount.fromRawAmount(USD[ChainId.MOONBEAM], 100_000e6),
}

/**
 * TODO (amiller68): #Research what this is for
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price<Currency, Token> | undefined {
  const { chainId } = useActiveWeb3React()
  // console.log('useUSDCPrice -> start', currency, chainId)

  // Get the currency amount of 1 USD for whatever chain we're on
  const amountOut = chainId ? STABLECOIN_AMOUNT_OUT[chainId] : undefined
  const stablecoin = amountOut?.currency

  // const allowedPools = useAllCommonPools(currency, stablecoin)

  const v2USDCTrade = useV2TradeExactOut(currency, amountOut, {
    maxHops: 2,
  })
  // console.log('useUSDCPrice -> v2USDCTrade', v2USDCTrade)

  return useMemo(() => {
    if (!currency || !stablecoin) {
      return undefined
    }

    // handle usdc
    if (currency?.wrapped.equals(stablecoin)) {
      return new Price(stablecoin, stablecoin, '1', '1')
    }

    if (v2USDCTrade) {
      const { numerator, denominator } = v2USDCTrade.route.midPrice
      return new Price(currency, stablecoin, denominator, numerator)
    }

    // const prices = calcTokenPrices(allowedPools, stablecoin)
    // return prices[(currency as Token).address]

    return undefined
  }, [currency, stablecoin, v2USDCTrade])
}

// Note (amiller68): This is used in the priceImpact calculation
export function useUSDCValue(currencyAmount: CurrencyAmount<Currency> | undefined | null) {
  // console.log('useUSDCValue -> start', currencyAmount)
  // Bandaid solution for now, might become permanent
  const price = useUSDCPrice(currencyAmount?.currency)
  // console.log('useUSDCValue -> price', price, 'for', currencyAmount)

  return useMemo(() => {
    if (!price || !currencyAmount) return null
    try {
      return price.quote(currencyAmount)
    } catch (error) {
      return null
    }
  }, [currencyAmount, price])
}

export function useUSDCPriceWithLoadingIndicator(currency?: Currency) {
  const price = useUSDCPrice(currency)
  return useMemo(() => {
    if (!price || !currency) return { price: undefined, loading: false }
    try {
      return { price, loading: false }
    } catch (error) {
      return { price: undefined, loading: false }
    }
  }, [currency, price])
}

export function useUSDCValueWithLoadingIndicator(currencyAmount: CurrencyAmount<Currency> | undefined) {
  const price = useUSDCPrice(currencyAmount?.currency)
  return useMemo(() => {
    if (!price || !currencyAmount) return { value: undefined, loading: false }
    try {
      return { value: price.quote(currencyAmount), loading: false }
    } catch (error) {
      return { value: undefined, loading: false }
    }
  }, [currencyAmount, price])
}
