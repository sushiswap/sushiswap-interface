import { aprToApy, formatNumber, formatPercent } from 'app/functions'
import { useOneDayBlock, useTwoDayBlock } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

import {
  getPoolDayBuckets,
  getPoolHourBuckets,
  getPoolKpis,
  getTridentPools,
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
    () => getTridentPools(chainId, variables),
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

export function usePoolKpis({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-pool-kpis', chainId, stringify(variables)] : null,
    () => getPoolKpis(chainId, variables),
    swrConfig
  )
}

export function useOneDayPoolKpis({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  const oneDayBlock = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const _variables = {
    ...variables,
    block: oneDayBlock,
  }

  return useSWR(
    shouldFetch && !!chainId ? ['trident-pool-kpis', chainId, stringify(_variables)] : null,
    () => getPoolKpis(chainId, _variables),
    swrConfig
  )
}

export function useTwoDayPoolKpis({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  const twoDayBlock = useTwoDayBlock({ chainId, shouldFetch: !!chainId })
  const _variables = {
    ...variables,
    block: twoDayBlock,
  }

  return useSWR(
    shouldFetch && !!chainId ? ['trident-pool-kpis', chainId, stringify(_variables)] : null,
    () => getPoolKpis(chainId, _variables),
    swrConfig
  )
}

export function useRollingPoolStats({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  const { data: poolKpis } = usePoolKpis({
    chainId,
    shouldFetch,
    variables,
    swrConfig,
  })
  const { data: oneDayPoolKpis } = useOneDayPoolKpis({
    chainId,
    shouldFetch,
    variables,
    swrConfig,
  })
  const { data: twoDayPoolKpis } = useTwoDayPoolKpis({
    chainId,
    shouldFetch,
    variables,
    swrConfig,
  })

  if (!poolKpis || !oneDayPoolKpis || !twoDayPoolKpis) {
    return []
  }

  return oneDayPoolKpis.map((el, i) => {
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
          ((oneDayPoolKpis?.[i]?.volumeUSD - twoDayPoolKpis?.[i]?.volumeUSD) / oneDayPoolKpis?.[i]?.liquidityUSD)) *
          100 -
        100,
      transactions: poolKpis?.[i]?.transactionCount - oneDayPoolKpis?.[i]?.transactionCount,
      transactions24hChange:
        ((poolKpis?.[i]?.transactionCount - oneDayPoolKpis?.[i]?.transactionCount) /
          (oneDayPoolKpis?.[i]?.transactionCount - twoDayPoolKpis?.[i]?.transactionCount)) *
          100 -
        100,
      apy: aprToApy(
        ((poolKpis?.[i]?.feesUSD - oneDayPoolKpis?.[i]?.feesUSD) / poolKpis?.[i]?.liquidityUSD) * 100,
        3650
      ),
    }
  })
}

export const useGetAllTridentPools = () => {
  const { chainId } = useActiveWeb3React()
  return useSWR(['getAllTridentPools', chainId], () => getTridentPools(chainId))
}
