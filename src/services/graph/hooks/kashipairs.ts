import { ChainId } from '@sushiswap/core-sdk'
import stringify from 'fast-json-stable-stringify'
import { useMemo } from 'react'
import useSWR from 'swr'

import {
  getDataKashiPair,
  getDataKashiPairs,
  getDataKashiPairsDayData,
  getDataKashiToken,
  getDataKashiTokens,
  getDataTokenPairsDayData,
} from '../fetchers'
import { GraphProps } from '../interfaces'

export function useDataKashiPair({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const data = useSWR(
    shouldFetch ? () => ['dataKashiPair', chainId, stringify(variables)] : null,
    // @ts-ignore
    (_, chainId) => getDataKashiPair(chainId, variables),
    swrConfig
  )

  return data
}

export function useDataKashiPairWithLoadingIndicator({
  chainId = ChainId.ETHEREUM,
  variables = undefined,
}: GraphProps) {
  const { data } = useDataKashiPair({ chainId, variables })
  return useMemo(() => {
    if (!data) return { data: undefined, loading: true }
    try {
      return { data: data, loading: false }
    } catch (error) {
      return { data: undefined, loading: true }
    }
  }, [data])
}

export function useDataKashiPairs({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const data = useSWR(
    shouldFetch ? () => ['dataKashiPairs', chainId, stringify(variables)] : null,
    // @ts-ignore
    (_, chainId) => getDataKashiPairs(chainId, variables),
    swrConfig
  )

  return data
}

export function useDataKashiPairsWithLoadingIndicator({ chainId = ChainId.ETHEREUM }) {
  const { data } = useDataKashiPairs({ chainId })
  return useMemo(() => {
    if (!data) return { data: undefined, loading: true }
    try {
      return { data: data, loading: false }
    } catch (error) {
      return { data: undefined, loading: true }
    }
  }, [data])
}

export function useDataKashiPairsDayData({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const data = useSWR(
    shouldFetch ? () => ['dataKashiPairsDayData', chainId, stringify(variables)] : null,
    // @ts-ignore
    (_, chainId) => getDataKashiPairsDayData(chainId, variables),
    swrConfig
  )

  return data
}

export function useDataKashiPairsDayDataWithLoadingIndicator({
  chainId = ChainId.ETHEREUM,
  variables = undefined,
}: GraphProps) {
  // Bandaid solution for now, might become permanent
  const { data } = useDataKashiPairsDayData({ chainId, variables })
  return useMemo(() => {
    if (!data) return { data: undefined, loading: true }
    try {
      return { data: data, loading: false }
    } catch (error) {
      return { data: undefined, loading: true }
    }
  }, [data])
}

export function useDataKashiToken({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const data = useSWR(
    shouldFetch ? () => ['dataKashiPairs', chainId, stringify(variables)] : null,
    // @ts-ignore
    (_, chainId) => getDataKashiToken(chainId, variables),
    swrConfig
  )

  return data
}

export function useDataKashiTokenWithLoadingIndicator({
  chainId = ChainId.ETHEREUM,
  variables = undefined,
}: GraphProps) {
  const { data } = useDataKashiToken({ chainId, variables })
  return useMemo(() => {
    if (!data) return { data: undefined, loading: true }
    try {
      return { data: data, loading: false }
    } catch (error) {
      return { data: undefined, loading: true }
    }
  }, [data])
}

export function useDataKashiTokens({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const data = useSWR(
    shouldFetch ? () => ['dataKashiPairs', chainId, stringify(variables)] : null,
    // @ts-ignore
    (_, chainId) => getDataKashiTokens(chainId, variables),
    swrConfig
  )

  return data
}

export function useDataKashiTokensWithLoadingIndicator({ chainId = ChainId.ETHEREUM }) {
  const { data } = useDataKashiTokens({ chainId })
  return useMemo(() => {
    if (!data) return { data: undefined, loading: true }
    try {
      return { data: data, loading: false }
    } catch (error) {
      return { data: undefined, loading: true }
    }
  }, [data])
}

export function useDataKashiTokenDayData({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const data = useSWR(
    shouldFetch ? () => ['dataKashiTokenDayData', chainId, stringify(variables)] : null,
    // @ts-ignore
    (_, chainId) => getDataTokenPairsDayData(chainId, variables),
    swrConfig
  )

  return data
}

export function useDataKashiTokensDayDataWithLoadingIndicator({
  chainId = ChainId.ETHEREUM,
  variables = undefined,
}: GraphProps) {
  const { data } = useDataKashiTokenDayData({ chainId, variables })
  return useMemo(() => {
    if (!data) return { data: undefined, loading: true }
    try {
      return { data: data, loading: false }
    } catch (error) {
      return { data: undefined, loading: true }
    }
  }, [data])
}
