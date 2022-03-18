import { aprToApy, formatNumber, formatPercent } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import { useOneDayBlock, useTwoDayBlock } from 'app/services/graph'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

import {
  getPoolDayBuckets,
  getPoolHourBuckets,
  getPoolKpi,
  getPoolKpis,
  getTridentPools,
  getTridentPoolTransactions,
  PoolBucket,
  TridentPool,
} from '../fetchers/pools'
import { GraphProps } from '../interfaces'

export function useTridentPools({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps): TridentPool[] {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['trident-pools', chainId, stringify(variables)] : null,
    () => getTridentPools({ chainId, variables }),
    swrConfig
  )
  return data
}

export function usePoolHourBuckets({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps): PoolBucket[] {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['trident-pool-hour-buckets', chainId, stringify(variables)] : null,
    () => getPoolHourBuckets(chainId, variables),
    swrConfig
  )
  return data
}

export function usePoolDayBuckets({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps): PoolBucket[] {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['trident-pool-day-buckets', chainId, stringify(variables)] : null,
    () => getPoolDayBuckets(chainId, variables),
    swrConfig
  )
  return data
}

export function usePoolKpi({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-pool-kpis', chainId, stringify(variables)] : null,
    () => getPoolKpi(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function usePoolKpis({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-pool-kpis', chainId, stringify(variables)] : null,
    () => getPoolKpis(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING

export function useOneDayPoolKpis({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-pool-kpis', chainId, stringify(variables)] : null,
    () => getPoolKpis(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useTwoDayPoolKpis({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-pool-kpis', chainId, stringify(variables)] : null,
    () => getPoolKpis(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useRollingPoolStats({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  const oneDayBlock = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const twoDayBlock = useTwoDayBlock({ chainId, shouldFetch: !!chainId })

  const {
    data: poolKpis,
    isValidating: poolKpisIsValidating,
    error: poolKpisError,
  } = usePoolKpis({
    chainId,
    shouldFetch,
    variables,
    swrConfig,
  })
  const {
    data: oneDayPoolKpis,
    isValidating: oneDayPoolKpisIsValidating,
    error: oneDayPoolKpisError,
  } = useOneDayPoolKpis({
    chainId,
    shouldFetch,
    variables: { ...variables, block: oneDayBlock },
    swrConfig,
  })
  const {
    data: twoDayPoolKpis,
    isValidating: twoDayPoolKpisIsValidating,
    error: twoDayPoolKpisError,
  } = useTwoDayPoolKpis({
    chainId,
    shouldFetch,
    variables: { ...variables, block: twoDayBlock },
    swrConfig,
  })

  return {
    isValidating: poolKpisIsValidating || oneDayPoolKpisIsValidating || twoDayPoolKpisIsValidating,
    error: poolKpisError || oneDayPoolKpisError || twoDayPoolKpisError,
    data:
      poolKpis && oneDayPoolKpis && twoDayPoolKpis
        ? oneDayPoolKpis.map((el: any, i: number) => {
            console.log({
              kpi: poolKpis?.[i],
              kpi2: oneDayPoolKpis?.[i],
              apy: aprToApy(
                ((poolKpis?.[i]?.feesUSD - oneDayPoolKpis?.[i]?.feesUSD) / poolKpis?.[i]?.liquidityUSD) * 100,
                3650
              ),
            })
            return {
              volume: formatNumber(poolKpis?.[i]?.volumeUSD - oneDayPoolKpis?.[i]?.volumeUSD, true, false),
              volume24hChange:
                ((poolKpis?.[i]?.volumeUSD - oneDayPoolKpis?.[i]?.volumeUSD) /
                  (oneDayPoolKpis?.[i]?.volumeUSD - twoDayPoolKpis?.[i]?.volumeUSD)) *
                  100 -
                100,
              fees: formatNumber(poolKpis?.[i]?.feesUSD - oneDayPoolKpis?.[i]?.feesUSD, true, false),
              fees24hChange:
                ((poolKpis?.[i]?.feesUSD - oneDayPoolKpis?.[i]?.feesUSD) /
                  (oneDayPoolKpis?.[i]?.feesUSD - twoDayPoolKpis?.[i]?.feesUSD)) *
                  100 -
                100,
              liquidity: formatPercent(
                ((poolKpis?.[i]?.volumeUSD - oneDayPoolKpis?.[i]?.volumeUSD) / poolKpis?.[i]?.liquidityUSD) * 100
              ),
              liquidity24hChange:
                ((poolKpis?.[i]?.volumeUSD - oneDayPoolKpis?.[i]?.volumeUSD) /
                  poolKpis?.[i]?.liquidityUSD /
                  ((oneDayPoolKpis?.[i]?.volumeUSD - twoDayPoolKpis?.[i]?.volumeUSD) /
                    oneDayPoolKpis?.[i]?.liquidityUSD)) *
                  100 -
                100,
              transactions: poolKpis?.[i]?.transactionCount - oneDayPoolKpis?.[i]?.transactionCount,
              transactions24hChange:
                ((poolKpis?.[i]?.transactionCount - oneDayPoolKpis?.[i]?.transactionCount) /
                  (oneDayPoolKpis?.[i]?.transactionCount - twoDayPoolKpis?.[i]?.transactionCount)) *
                  100 -
                100,
              apy:
                (Math.max(0, poolKpis?.[i]?.feesUSD - oneDayPoolKpis?.[i]?.feesUSD) * 365 * 100) /
                poolKpis?.[i]?.liquidityUSD,
            }
          })
        : [],
  }
}

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTransactions({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-transactions', chainId, stringify(variables)] : null,
    () => getTridentPoolTransactions(chainId, variables),
    swrConfig
  )
}

export const useGetAllTridentPools = ({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) => {
  const tokens = useAllTokens()
  // const allowedAssets = useMemo(() => Object.keys(tokens).map((address) => address.toLowerCase()), [tokens])
  return useSWR<TridentPool[]>(
    shouldFetch ? ['getAllTridentPools', chainId] : null,
    () => getTridentPools({ chainId, tokens }),
    swrConfig
  )
}
