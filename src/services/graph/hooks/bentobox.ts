import useSWR, { SWRConfiguration } from 'swr'
import { getKashiPairs, getBentoBox, getBentoStrategies } from '../fetchers/bentobox'
import { ChainId } from '@sushiswap/core-sdk'
import stringify from 'fast-json-stable-stringify'

interface useKashiPairsProps {
  chainId: ChainId
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useKashiPairs({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: useKashiPairsProps) {
  const { data } = useSWR(
    shouldFetch ? () => ['kashiPairs', chainId, stringify(variables)] : null,
    (_, chainId) => getKashiPairs(chainId, variables),
    swrConfig
  )
  return data
}

interface useBentoBoxProps {
  chainId: ChainId
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useBentoBox({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig,
}: useBentoBoxProps) {
  const { data } = useSWR(
    shouldFetch ? ['bentoBox', chainId, stringify(variables)] : null,
    () => getBentoBox(chainId, variables),
    swrConfig
  )

  return data
}

interface useBentoStrategiesProps {
  chainId: ChainId
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

// subset of tokens, not strategies
export function useBentoStrategies({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: useBentoStrategiesProps) {
  const { data } = useSWR(
    shouldFetch ? ['bentoStrategies', chainId, stringify(variables)] : null,
    () => getBentoStrategies(chainId, variables),
    swrConfig
  )

  return data as { token: string; apy: number; targetPercentage: number }[]
}
