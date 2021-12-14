import { useEffect, useMemo } from 'react'
import useSWR, { SWRConfiguration } from 'swr'

import {
  getKashiPairs,
  getUserKashiPairs,
  getBentoUserTokens,
  getBentoBox,
  getBentoTokens,
  getBentoStrategies,
} from '../fetchers/bentobox'
import { useActiveWeb3React } from '../../../hooks'
import { ChainId } from '@sushiswap/sdk'
import { Feature, featureEnabled } from '../../../functions/feature'
import { useBlock } from './blocks'

export function useKashiPairs(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()

  const shouldFetch = chainId && [ChainId.MAINNET, ChainId.MATIC, ChainId.ARBITRUM].includes(chainId)

  // useEffect(() => {
  //   console.log('debug', { shouldFetch, chainId, pairAddresses })
  // }, [shouldFetch, chainId, pairAddresses])

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

  return data as { token: string; apy: number; targetPercentage: number; utilization: number }[]
}
