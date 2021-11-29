import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

import { getPoolDayBuckets, getPoolHourBuckets, getTridentPools, PoolBucket, TridentPool } from '../fetchers/pools'
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
