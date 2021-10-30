import { Feature, featureEnabled } from 'functions/feature'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import {
  getBentoBox,
  getBentoStrategies,
  getBentoTokens,
  getBentoUserTokens,
  getKashiPairs,
  getUserKashiPairs,
} from 'services/graph/fetchers'
import { useBlock } from 'services/graph/hooks'
import useSWR, { SWRConfiguration } from 'swr'

interface useKashiPairsProps {
  timestamp?: number
  block?: number
  chainId: number
  shouldFetch?: boolean
  user?: string
  subset?: string[]
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
    shouldFetch ? () => ['kashiPairs', chainId, JSON.stringify(variables)] : null,
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
    shouldFetch ? ['userKashiPairs', chainId, JSON.stringify(variables)] : null,
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
    shouldFetch ? ['bentoUserTokens', chainId, JSON.stringify(variables)] : null,
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
    shouldFetch ? ['bentoBox', chainId, JSON.stringify(variables)] : null,
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
    shouldFetch ? ['bentoTokens', chainId, JSON.stringify(variables)] : null,
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

  shouldFetch = shouldFetch && chainId ? featureEnabled(Feature.BENTOBOX, chainId) : false

  const variables = {
    block: block ? { number: block } : undefined,
    where: {
      token_in: subset?.map((id) => id?.toLowerCase()),
    },
  }

  const { data } = useSWR(
    shouldFetch ? ['bentoStrategies', chainId, JSON.stringify(variables)] : null,
    () => getBentoStrategies(chainId, variables),
    swrConfig
  )

  return data as { token: string; apy: number; targetPercentage: number }[]
}
