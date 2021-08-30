import {
  exchange,
  getAlcxPrice,
  getAvaxPrice,
  getBundle,
  getCvxPrice,
  getDayData,
  getFactory,
  getLiquidityPositions,
  getMaticPrice,
  getMphPrice,
  getNativePrice,
  getOnePrice,
  getPicklePrice,
  getRulerPrice,
  getStakePrice,
  getSushiPrice,
  getToken,
  getTokenDayData,
  getTokenPairs,
  getTokens,
  getTransactions,
  getTruPrice,
  getYggPrice,
} from '../fetchers'
import { getEthPrice, getPairs } from '../fetchers'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import { ethPriceQuery } from '../queries'
import { useActiveWeb3React } from '../../../hooks'
import { useBlock } from './blocks'
import { first } from 'lodash'

interface useFactoryProps {
  timestamp?: number
  block?: number
  chainId?: number
  shouldFetch?: boolean
}

export function useFactory(
  { timestamp, block, chainId = useActiveWeb3React().chainId, shouldFetch = true }: useFactoryProps = {},
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch && !!chainId

  const variables = {
    block: block ? { number: block } : undefined,
  }

  const { data } = useSWR(
    shouldFetch ? ['factory', chainId, JSON.stringify(variables)] : null,
    () => getFactory(chainId, variables),
    swrConfig
  )
  return data
}

interface useNativePriceProps {
  timestamp?: number
  block?: number
  chainId?: number
  shouldFetch?: boolean
}

export function useNativePrice(
  { timestamp, block, chainId = useActiveWeb3React().chainId, shouldFetch = true }: useNativePriceProps = {},
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, chainId, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch && !!chainId

  const variables = {
    block: block ? { number: block } : undefined,
  }

  const { data } = useSWR(
    shouldFetch ? ['nativePrice', chainId, JSON.stringify(variables)] : null,
    () => getNativePrice(chainId, variables),
    swrConfig
  )

  return data
}

export function useEthPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['ethPrice', JSON.stringify(variables)], () => getEthPrice(variables), swrConfig)
  return data
}

export function useStakePrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['stakePrice', JSON.stringify(variables)], () => getStakePrice(variables), swrConfig)
  return data
}

export function useOnePrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['onePrice', JSON.stringify(variables)], () => getOnePrice(variables), swrConfig)
  return data
}

export function useYggPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.MAINNET ? ['yggPrice', JSON.stringify(variables)] : null,
    () => getYggPrice(),
    swrConfig
  )
  return data
}

export function useRulerPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.MAINNET ? ['rulerPrice', JSON.stringify(variables)] : null,
    () => getRulerPrice(variables),
    swrConfig
  )
  return data
}

export function useTruPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.MAINNET ? ['truPrice', JSON.stringify(variables)] : null,
    () => getTruPrice(),
    swrConfig
  )
  return data
}

export function useAlcxPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(
    shouldFetch ? ['aclxPrice', JSON.stringify(variables)] : null,
    () => getAlcxPrice(variables),
    swrConfig
  )
  return data
}

export function useCvxPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(
    shouldFetch ? ['cvxPrice', JSON.stringify(variables)] : null,
    () => getCvxPrice(variables),
    swrConfig
  )
  return data
}

export function usePicklePrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.MAINNET ? ['picklePrice', JSON.stringify(variables)] : null,
    () => getPicklePrice(),
    swrConfig
  )
  return data
}

export function useMphPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.MAINNET ? ['mphPrice', JSON.stringify(variables)] : null,
    () => getMphPrice(),
    swrConfig
  )
  return data
}

export function useAvaxPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['avaxPrice', JSON.stringify(variables)], () => getAvaxPrice(variables), swrConfig)
  return data
}

export function useMaticPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['maticPrice', JSON.stringify(variables)], () => getMaticPrice(variables), swrConfig)
  return data
}

export function useSushiPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['sushiPrice', JSON.stringify(variables)], () => getSushiPrice(variables), swrConfig)
  return data
}

export function useBundle(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId ? [chainId, ethPriceQuery, JSON.stringify(variables)] : null,
    () => getBundle(),
    swrConfig
  )
  return data
}

interface useLiquidityPositionsProps {
  timestamp?: number
  block?: number
  chainId?: number
  shouldFetch?: boolean
  user?: string
}

export function useLiquidityPositions(
  {
    timestamp,
    block,
    chainId = useActiveWeb3React().chainId,
    shouldFetch = true,
    user,
  }: useLiquidityPositionsProps = {},
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, chainId, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch && !!chainId

  const variables = {
    block: block ? { number: block } : undefined,
    where: {
      user: user?.toLowerCase(),
      liquidityTokenBalance_gt: '0',
    },
  }

  const { data } = useSWR(
    shouldFetch ? ['liquidityPositions', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getLiquidityPositions(chainId, variables),
    swrConfig
  )
  return data
}

interface useSushiPairsProps {
  timestamp?: number
  block?: number
  chainId?: number
  shouldFetch?: boolean
  user?: string
  subset?: string[]
}

export function useSushiPairs(
  {
    timestamp,
    block,
    chainId = useActiveWeb3React().chainId,
    shouldFetch = true,
    user,
    subset,
  }: useSushiPairsProps = {},
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch && !!chainId

  const variables = {
    block: block ? { number: block } : undefined,
    where: {
      user: user?.toLowerCase(),
      id_in: subset?.map((id) => id.toLowerCase()),
    },
  }

  const { data } = useSWR(
    shouldFetch ? ['sushiPairs', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getPairs(chainId, variables),
    swrConfig
  )
  return data
}

interface useTokensProps {
  timestamp?: number
  block?: number
  chainId?: number
  shouldFetch?: boolean
  subset?: string[]
}

export function useTokens(
  { timestamp, block, chainId = useActiveWeb3React().chainId, shouldFetch = true, subset }: useTokensProps = {},
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch && !!chainId

  const variables = {
    block: block ? { number: block } : undefined,
    where: {
      id_in: subset?.map((id) => id.toLowerCase()),
    },
  }

  const { data } = useSWR(
    shouldFetch ? ['tokens', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getTokens(chainId, variables),
    swrConfig
  )
  return data
}

interface useTokenDayDataProps {
  timestamp?: number
  block?: number
  chainId?: number
  shouldFetch?: boolean
  token: string
  first?: number
}

export function useTokenDayData(
  { timestamp, block, chainId = useActiveWeb3React().chainId, shouldFetch = true, token, first }: useTokenDayDataProps,
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch && !!chainId

  const variables = {
    first: first,
    block: block ? { number: block } : undefined,
    where: {
      token: token?.toLowerCase(),
    },
  }

  const { data } = useSWR(
    shouldFetch ? ['tokenDayDaya', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getTokenDayData(chainId, variables),
    swrConfig
  )
  return data
}

interface useDayDataProps {
  timestamp?: number
  block?: number
  chainId?: number
  shouldFetch?: boolean
  first?: number
}

export function useDayData(
  { timestamp, block, chainId = useActiveWeb3React().chainId, shouldFetch = true, first }: useDayDataProps = {},
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch && !!chainId

  const variables = {
    first: first,
    block: block ? { number: block } : undefined,
  }

  const { data } = useSWR(
    shouldFetch ? ['dayData', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getDayData(chainId, variables),
    swrConfig
  )
  return data
}

interface useTransactionsProps {
  timestamp?: number
  block?: number
  chainId?: number
  shouldFetch?: boolean
  first?: number
  pairs: string[]
}

export function useTransactions(
  { timestamp, block, chainId = useActiveWeb3React().chainId, shouldFetch = true, first, pairs }: useTransactionsProps,
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch && !!chainId

  const variables = {
    first: first,
    block: block ? { number: block } : undefined,
    where: {
      pair_in: pairs?.map((id) => id.toLowerCase()),
    },
  }

  const { data } = useSWR(
    shouldFetch ? ['transactions', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getTransactions(chainId, variables),
    swrConfig
  )
  return data
}

interface useTokenPairsProps {
  timestamp?: number
  block?: number
  chainId?: number
  shouldFetch?: boolean
  token: string
}

export function useTokenPairs(
  { timestamp, block, chainId = useActiveWeb3React().chainId, shouldFetch = true, token }: useTokenPairsProps,
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch && !!chainId

  const variables = {
    id: token?.toLowerCase(),
    block: block ? { number: block } : undefined,
  }

  const { data } = useSWR(
    shouldFetch ? ['tokenPairs', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getTokenPairs(chainId, variables),
    swrConfig
  )
  return data
}
