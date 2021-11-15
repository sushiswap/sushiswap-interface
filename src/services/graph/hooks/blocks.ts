import { getAverageBlockTime, getBlock, getMassBlocks } from '../fetchers'
import useSWR, { SWRConfiguration } from 'swr'

import { useActiveWeb3React } from '../../../hooks'
import { useMemo } from 'react'
import { ChainId } from '@sushiswap/sdk'

interface useBlockProps {
  timestamp?: number
  daysAgo?: number
  chainId?: number
  shouldFetch?: boolean
}

export function useBlock(
  { timestamp, daysAgo, chainId = ChainId.MAINNET, shouldFetch = true }: useBlockProps = {},
  swrConfig: SWRConfiguration = undefined
) {
  shouldFetch = shouldFetch && !!chainId
  timestamp = timestamp
    ? String(timestamp).length !== 13
      ? Number(timestamp)
      : Math.floor(Number(timestamp) / 1000)
    : undefined

  timestamp = useMemo(
    () => (daysAgo ? Math.floor(Date.now() / 1000) - daysAgo * 86400 : timestamp),
    [daysAgo, timestamp]
  )

  const { data } = useSWR(
    shouldFetch ? ['block', chainId, timestamp] : null,
    (_, chainId, timestamp) => getBlock(chainId, timestamp),
    swrConfig
  )

  return data
}

export function useMassBlocks(timestamps: number[] | string[], swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['massBlocks', chainId] : null,
    (_, chainId) => getMassBlocks(chainId, timestamps),
    swrConfig
  )

  return data
}

export function useAverageBlockTime(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['averageBlockTime', chainId] : null,
    (_, chainId) => getAverageBlockTime(chainId),
    swrConfig
  )

  return data
}
