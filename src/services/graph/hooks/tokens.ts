import { formatNumber, formatPercent } from 'app/functions'
import { getTridentTokenPrices, useOneDayBlock, useTwoDayBlock } from 'app/services/graph'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

import {
  getTridentTokenDayBuckets,
  getTridentTokenHourBuckets,
  getTridentTokenKpi,
  getTridentTokenKpis,
  getTridentTokenPrice,
  getTridentTokens,
  TokenBucket,
} from '../fetchers'
import { GraphProps } from '../interfaces'

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTokens({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-tokens', chainId, variables] : null,
    () => getTridentTokens(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTokenPrices({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-token-prices', chainId, variables] : null,
    () => getTridentTokenPrices(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTokenPrice({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-token-price', chainId, variables] : null,
    () => getTridentTokenPrice(chainId, variables),
    swrConfig
  )
}

export function useTridentTokenHourBuckets({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps): TokenBucket[] {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['trident-token-hour-buckets', chainId, stringify(variables)] : null,
    () => getTridentTokenHourBuckets(chainId, variables),
    swrConfig
  )
  return data
}

export function useTridentTokenDayBuckets({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps): TokenBucket[] {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['trident-token-day-buckets', chainId, stringify(variables)] : null,
    () => getTridentTokenDayBuckets(chainId, variables),
    swrConfig
  )
  return data
}

export function useTridentTokenKpi({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-token-kpis', chainId, stringify(variables)] : null,
    () => getTridentTokenKpi(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTokenKpis({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-token-kpis', chainId, stringify(variables)] : null,
    () => getTridentTokenKpis(chainId, variables),
    swrConfig
  )
}

export function useTridentOneDayTokenKpis({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-token-kpis', chainId, stringify(variables)] : null,
    () => getTridentTokenKpis(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTwoDayTokenKpis({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-token-kpis', chainId, stringify(variables)] : null,
    () => getTridentTokenKpis(chainId, variables),
    swrConfig
  )
}

export function useTridentRollingTokenStats({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data: oneDayBlock } = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const { data: twoDayBlock } = useTwoDayBlock({ chainId, shouldFetch: !!chainId })

  const {
    data: tokenKpis,
    isValidating: tokenKpisIsValidating,
    error: tokenKpisError,
  } = useTridentTokenKpis({
    chainId,
    shouldFetch,
    variables,
    swrConfig,
  })
  const {
    data: oneDayTokenKpis,
    isValidating: oneDayTokenKpisIsValidating,
    error: oneDayTokenKpisError,
  } = useTridentOneDayTokenKpis({
    chainId,
    shouldFetch,
    variables: { ...variables, block: oneDayBlock },
    swrConfig,
  })
  const {
    data: twoDayTokenKpis,
    isValidating: twoDayTokenKpisIsValidating,
    error: twoDayTokenKpisError,
  } = useTridentTwoDayTokenKpis({
    chainId,
    shouldFetch,
    variables: { ...variables, block: twoDayBlock },
    swrConfig,
  })

  return {
    isValidating: tokenKpisIsValidating || oneDayTokenKpisIsValidating || twoDayTokenKpisIsValidating,
    error: tokenKpisError || oneDayTokenKpisError || twoDayTokenKpisError,
    data: tokenKpis?.map((tokenKpi: any) => {
      const oneDayTokenKpi = oneDayTokenKpis?.find((oneDayTokenKpi: any) => oneDayTokenKpi.id === tokenKpi.id)
      const twoDayTokenKpi = twoDayTokenKpis?.find((twoDayTokenKpi: any) => twoDayTokenKpi.id === tokenKpi.id)

      const volume = formatNumber(
        oneDayTokenKpi?.volumeUSD ? tokenKpi.volumeUSD - oneDayTokenKpi.volumeUSD : tokenKpi.volumeUSD,
        true,
        false
      )

      const volume24hChange =
        ((tokenKpi?.volumeUSD - oneDayTokenKpi?.volumeUSD) / (oneDayTokenKpi?.volumeUSD - twoDayTokenKpi?.volumeUSD)) *
          100 -
        100

      const fees = formatNumber(
        oneDayTokenKpi ? tokenKpi?.feesUSD - oneDayTokenKpi?.feesUSD : tokenKpi?.feesUSD,
        true,
        false
      )

      const fees24hChange =
        ((tokenKpi?.feesUSD - oneDayTokenKpi?.feesUSD) / (oneDayTokenKpi?.feesUSD - twoDayTokenKpi?.feesUSD)) * 100 -
        100

      const liquidity = formatPercent(
        ((oneDayTokenKpi ? tokenKpi?.volumeUSD - oneDayTokenKpi?.volumeUSD : tokenKpi?.volumeUSD) /
          tokenKpi?.liquidityUSD) *
          100
      )

      const transactions = oneDayTokenKpi
        ? tokenKpi.transactionCount - oneDayTokenKpi.transactionCount
        : tokenKpi.transactionCount

      const apy =
        tokenKpi.liquidityUSD > 0
          ? (Math.max(0, oneDayTokenKpi ? tokenKpi?.feesUSD - oneDayTokenKpi?.feesUSD : tokenKpi?.feesUSD) *
              365 *
              100) /
            tokenKpi?.liquidityUSD
          : 0

      return {
        volume,
        volume24hChange,
        fees,
        fees24hChange,
        liquidity,
        liquidity24hChange:
          ((tokenKpi?.volumeUSD - oneDayTokenKpi?.volumeUSD) /
            tokenKpi?.liquidityUSD /
            ((oneDayTokenKpi?.volumeUSD - twoDayTokenKpi?.volumeUSD) / oneDayTokenKpi?.liquidityUSD)) *
            100 -
          100,
        transactions,
        transactions24hChange:
          ((tokenKpi?.transactionCount - oneDayTokenKpi?.transactionCount) /
            (oneDayTokenKpi?.transactionCount - twoDayTokenKpi?.transactionCount)) *
            100 -
          100,
        apy,
      }
    }),
  }
}
