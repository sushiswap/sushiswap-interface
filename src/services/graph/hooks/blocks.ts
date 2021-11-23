import { getAverageBlockTime, getBlock, getMassBlocks } from '../fetchers'
import { useActiveWeb3React } from '../../../services/web3'
import useSWR, { SWRConfiguration } from 'swr'
import { useMemo } from 'react'
import { ChainId } from '@sushiswap/core-sdk'
import stringify from 'fast-json-stable-stringify'

interface useBlockProps {
  timestamp?: number
  daysAgo?: number
  chainId?: number
  shouldFetch?: boolean
}

export function useBlock(
  { timestamp, daysAgo, chainId = ChainId.ETHEREUM, shouldFetch = true }: useBlockProps = {},
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

interface useMassBlocksProps {
  timestamps: number[] | string[]
  swrConfig?: SWRConfiguration
}

export function useMassBlocks({ timestamps, swrConfig = undefined }: useMassBlocksProps) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['massBlocks', chainId, stringify(timestamps)] : null,
    (_, chainId) => getMassBlocks(chainId, timestamps),
    swrConfig
  )

  return data
}

export function useAverageBlockTime({ chainId = ChainId.ETHEREUM, swrConfig = undefined }) {
  const { data } = useSWR(
    chainId ? ['averageBlockTime', chainId] : null,
    (_, chainId) => getAverageBlockTime(chainId),
    swrConfig
  )
  return data
}
