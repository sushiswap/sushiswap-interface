import { featureEnabled } from 'functions/feature'
import { useActiveWeb3React } from 'services/web3'
import {
  getBentoBox,
  getBentoStrategies,
  getBentoTokens,
  getBentoUserTokens,
  getKashiPairs,
  getUserKashiPairs,
  getClones,
} from 'services/graph/fetchers'
import { useBlock } from 'services/graph/hooks'
import { Feature } from 'enums'
import useSWR, { SWRConfiguration } from 'swr'
import stringify from 'fast-json-stable-stringify'

interface useKashiPairsProps {
  timestamp?: number
  block?: number
  chainId: number
  shouldFetch?: boolean
  user?: string
  subset?: string[]
}

export function useClones({ chainId, shouldFetch = true }, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(shouldFetch ? () => ['clones', chainId] : null, (_, chainId) => getClones(chainId), swrConfig)
  return data
}

export function useKashiPairs(
  { timestamp, block, chainId, shouldFetch = true, user, subset }: useKashiPairsProps,
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, chainId, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch ? featureEnabled(Feature['KASHI'], chainId) : false

  const variables = {
    block: block ? { number: block } : undefined,
    where: {
      user: user?.toLowerCase(),
      id_in: subset?.map((id) => id.toLowerCase()),
    },
  }

  const { data } = useSWR(
    shouldFetch ? () => ['kashiPairs', chainId, stringify(variables)] : null,
    (_, chainId) => getKashiPairs(chainId, variables),
    swrConfig
  )

  return data
}

export function useUserKashiPairs(variables = undefined, chainId = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId: chainIdSelected, account } = useActiveWeb3React()
  chainId = chainId ?? chainIdSelected

  const shouldFetch = chainId && account

  variables =
    Object.keys(variables ?? {}).includes('user') && account
      ? variables
      : account
      ? { ...variables, user: account.toLowerCase() }
      : ''

  const { data } = useSWR(
    shouldFetch ? ['userKashiPairs', chainId, stringify(variables)] : null,
    () => getUserKashiPairs(chainId, variables),
    swrConfig
  )

  return data
}

export function useBentoUserTokens(
  variables = undefined,
  chainId = undefined,
  swrConfig: SWRConfiguration = undefined
) {
  const { chainId: chainIdSelected, account } = useActiveWeb3React()
  chainId = chainId ?? chainIdSelected

  const shouldFetch = chainId && account

  variables = Object.keys(variables ?? {}).includes('user')
    ? variables
    : account
    ? { ...variables, user: account.toLowerCase() }
    : ''

  const { data } = useSWR(
    shouldFetch ? ['bentoUserTokens', chainId, stringify(variables)] : null,
    () => getBentoUserTokens(chainId, variables),
    swrConfig
  )

  return data
}

interface useBentoBoxProps {
  timestamp?: number
  block?: number
  chainId: number
  shouldFetch?: boolean
}

export function useBentoBox(
  { timestamp, block, chainId, shouldFetch = true }: useBentoBoxProps,
  swrConfig?: SWRConfiguration
) {
  const blockFetched = useBlock({ timestamp, chainId, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch && chainId ? featureEnabled(Feature.BENTOBOX, chainId) : false

  const variables = {
    block: block ? { number: block } : undefined,
  }

  const { data } = useSWR(
    shouldFetch ? ['bentoBox', chainId, stringify(variables)] : null,
    () => getBentoBox(chainId, variables),
    swrConfig
  )

  return data
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

  shouldFetch = shouldFetch && chainId ? featureEnabled(Feature.BENTOBOX, chainId) : false

  const variables = {
    block: block ? { number: block } : undefined,
    where: {
      id_in: subset?.map((id) => id?.toLowerCase()),
    },
  }

  const { data } = useSWR(
    shouldFetch ? ['bentoTokens', chainId, stringify(variables)] : null,
    () => getBentoTokens(chainId, variables),
    swrConfig
  )

  return data
}

interface useBentoStrategies {
  timestamp?: number
  block?: number
  subset?: string[]
  chainId: number
  shouldFetch?: boolean
}

// subset of tokens, not strategies
export function useBentoStrategies(
  { timestamp, block, subset, chainId, shouldFetch = true }: useBentoTokensProps,
  swrConfig?: SWRConfiguration
) {
  const blockFetched = useBlock({ timestamp, chainId, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  const variables = {
    block: block ? { number: block } : undefined,
    where: {
      token_in: subset?.map((id) => id?.toLowerCase()),
    },
  }

  const { data } = useSWR(
    shouldFetch ? ['bentoStrategies', chainId, stringify(variables)] : null,
    () => getBentoStrategies(chainId, variables),
    swrConfig
  )

  return data as { token: string; apy: number; targetPercentage: number }[]
}
