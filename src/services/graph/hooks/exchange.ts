import {
  exchange,
  getAlcxPrice,
  getBundle,
  getCeloPrice,
  getCvxPrice,
  getDayData,
  getFactory,
  getLiquidityPositions,
  getMaticPrice,
  getMovrPrice,
  getMphPrice,
  getOnePrice,
  getPicklePrice,
  getRulerPrice,
  getSpellPrice,
  getGnoPrice,
  getSushiPrice,
  getToken,
  getTokenPairs,
  getTokens,
  getTransactions,
  getTruPrice,
  getYggPrice,
  getEthPrice,
  getOhmPrice,
  getFusePrice,
  getMagicPrice,
  getPairs,
} from '../fetchers'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import { ethPriceQuery } from '../queries'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { useBlock } from './blocks'

export function useExchange(variables = undefined, query = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId ? [chainId, query, JSON.stringify(variables)] : null,
    () => exchange(chainId, query, variables),
    swrConfig
  )
  return data
}

export function useFactory(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId ? ['factory', chainId, JSON.stringify(variables)] : null,
    () => getFactory(chainId, variables),
    swrConfig
  )
  return data
}

export function useEthPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId ? ['ethPrice', JSON.stringify(variables)] : null,
    () => getEthPrice(chainId, variables),
    swrConfig
  )
  return data
}

export function useGnoPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.XDAI
  const { data } = useSWR(shouldFetch ? 'gnoPrice' : null, () => getGnoPrice(), swrConfig)
  return data
}

export function useSpellPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR('spellPrice', () => getSpellPrice(), swrConfig)
  return data
}

export function useOnePrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.HARMONY
  const { data } = useSWR(shouldFetch ? 'onePrice' : null, () => getOnePrice(), swrConfig)
  return data
}

export function useCeloPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.CELO
  const { data } = useSWR(shouldFetch ? 'celoPrice' : null, () => getCeloPrice(), swrConfig)
  return data
}

export function useMovrPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MOONRIVER
  const { data } = useSWR(shouldFetch ? 'movrPrice' : null, () => getMovrPrice(), swrConfig)
  return data
}

export function useOhmPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
  const { data } = useSWR(shouldFetch ? 'ohmPrice' : null, () => getOhmPrice(chainId), swrConfig)
  return data
}

export function useFusePrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
  const { data } = useSWR(shouldFetch ? 'fusePrice' : null, () => getFusePrice(), swrConfig)
  return data
}

export function useYggPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId && chainId === ChainId.MAINNET ? 'yggPrice' : null, () => getYggPrice(), swrConfig)
  return data
}

export function useRulerPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.MAINNET ? 'rulerPrice' : null,
    () => getRulerPrice(),
    swrConfig
  )
  return data
}

export function useTruPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId && chainId === ChainId.MAINNET ? 'truPrice' : null, () => getTruPrice(), swrConfig)
  return data
}

export function useAlcxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId && chainId === ChainId.MAINNET ? 'aclxPrice' : null, () => getAlcxPrice(), swrConfig)
  return data
}

export function useCvxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId && chainId === ChainId.MAINNET ? 'cvxPrice' : null, () => getCvxPrice(), swrConfig)
  return data
}

export function usePicklePrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.MAINNET ? 'picklePrice' : null,
    () => getPicklePrice(),
    swrConfig
  )
  return data
}

export function useMphPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId && chainId === ChainId.MAINNET ? 'mphPrice' : null, () => getMphPrice(), swrConfig)
  return data
}

export function useMaticPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId && chainId === ChainId.MATIC ? 'maticPrice' : null, () => getMaticPrice(), swrConfig)
  return data
}

export function useMagicPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.ARBITRUM ? 'magicPrice' : null,
    () => getMagicPrice(),
    swrConfig
  )
  return data
}

export function useSushiPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR('sushiPrice', () => getSushiPrice(), swrConfig)
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

export function useLiquidityPositions(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
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
  chainId: number
  shouldFetch?: boolean
  user?: string
  subset?: string[]
}

export function useSushiPairs(
  { timestamp, block, chainId, shouldFetch = true, user, subset }: useSushiPairsProps,
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, chainId, shouldFetch: shouldFetch && !!timestamp })
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
  { timestamp, block, chainId, shouldFetch = true, subset }: useTokensProps,
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, chainId, shouldFetch: shouldFetch && !!timestamp })
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

export function useToken(variables, query = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
  const { data } = useSWR(
    shouldFetch ? ['token', chainId, query, JSON.stringify(variables)] : null,
    (_, chainId) => getToken(chainId, query, variables),
    swrConfig
  )
  return data
}

export function useDayData(variables = undefined, query = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
  const { data } = useSWR(
    shouldFetch ? ['dayData', chainId, query, JSON.stringify(variables)] : null,
    (_, chainId) => getDayData(chainId, query, variables),
    swrConfig
  )
  return data
}

export function useTransactions(variables = undefined, query = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
  const { data } = useSWR(
    shouldFetch ? ['transactions', chainId, query, JSON.stringify(variables)] : null,
    (_, chainId) => getTransactions(chainId, query, variables),
    swrConfig
  )
  return data
}

export function useTokenPairs(variables = undefined, query = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
  const { data } = useSWR(
    shouldFetch ? ['tokenPairs', chainId, query, JSON.stringify(variables)] : null,
    (_, chainId) => getTokenPairs(chainId, query, variables),
    swrConfig
  )
  return data
}
