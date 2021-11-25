import { ChainId } from '@sushiswap/core-sdk'
import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions/feature'
import { getBentoBox, getBentoStrategies, getBentoTokens, getClones, getKashiPairs } from 'app/services/graph/fetchers'
import { useBlock } from 'app/services/graph/hooks'
import stringify from 'fast-json-stable-stringify'
import useSWR, { SWRConfiguration } from 'swr'

interface useKashiPairsProps {
  chainId: ChainId
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useClones({ chainId, shouldFetch = true }, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(shouldFetch ? () => ['clones', chainId] : null, (_, chainId) => getClones(chainId), swrConfig)
  return data
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

interface useBentoTokensProps {
  timestamp?: number
  block?: number
  subset?: string[]
  chainId: number
  shouldFetch?: boolean
}

export function useBentoTokens(
  { timestamp, block, subset, chainId, shouldFetch = true }: useBentoTokensProps,
  swrConfig?: SWRConfiguration
) {
  const blockFetched = useBlock({ timestamp, chainId, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  const variables = {
    block: block ? { number: block } : undefined,
    where: {
      id_in: subset?.map((id) => id?.toLowerCase()),
    },
  }

  const { data } = useSWR(
    shouldFetch && chainId && featureEnabled(Feature.BENTOBOX, chainId)
      ? ['bentoTokens', chainId, stringify(variables)]
      : null,
    () => getBentoTokens(chainId, variables),
    swrConfig
  )

  return data
}
