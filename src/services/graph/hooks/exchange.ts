import { ethPriceQuery, liquidityPositionSubsetQuery, pairSubsetQuery, tokenQuery } from '../queries'
import {
  exchange,
  getAlcxPrice,
  getBundle,
  getCvxPrice,
  getLiquidityPositionSubset,
  getMaticPrice,
  getSushiPrice,
  getTokenPrice,
  getTokens,
} from '../fetchers'
import { getEthPrice, getPairSubset, getPairs } from '../fetchers'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from '../../../hooks'

export function useExchange(query, variables, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const res = useSWR([chainId, query, variables], exchange, swrConfig)
  return res
}

export function useEthPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const res = useSWR(
    chainId ? [chainId, 'ethPrice', JSON.stringify(variables)] : null,
    () => getEthPrice(chainId, variables),
    swrConfig
  )
  return res
}

export function useAlcxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const res = useSWR(chainId && chainId === ChainId.MAINNET ? 'aclxPrice' : null, () => getAlcxPrice(), swrConfig)
  return res
}

export function useCvxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const res = useSWR(chainId && chainId === ChainId.MAINNET ? 'cvxPrice' : null, () => getCvxPrice(), swrConfig)
  return res
}

export function useMaticPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const res = useSWR(chainId && chainId === ChainId.MATIC ? 'maticPrice' : null, () => getMaticPrice(), swrConfig)
  return res
}

export function useSushiPrice(swrConfig: SWRConfiguration = undefined) {
  const res = useSWR('sushiPrice', () => getSushiPrice(), swrConfig)
  return res
}

export function useBundle(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const res = useSWR(
    chainId ? [chainId, ethPriceQuery, JSON.stringify(variables)] : null,
    () => getBundle(chainId, undefined, variables),
    swrConfig
  )
  return res
}

export function useLiquidityPositionSubset(user, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && user
  const res = useSWR(
    shouldFetch ? ['liquidityPositionSubset', chainId, user] : null,
    (_, chainId, user) => getLiquidityPositionSubset(chainId, user),
    swrConfig
  )
  return res
}

export function usePairs(variables = undefined, query = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
  const res = useSWR(
    shouldFetch ? ['pairs', chainId, query, JSON.stringify(variables)] : null,
    (_, chainId) => getPairs(chainId, query, variables),
    swrConfig
  )
  return res
}

export function usePairSubset(pairAddresses, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()

  const shouldFetch = chainId && pairAddresses && pairAddresses.length

  const res = useSWR(
    shouldFetch ? ['pairSubset', chainId, pairAddresses] : null,
    (_, chainId, pairAddresses) => getPairSubset(chainId, { pairAddresses }),
    swrConfig
  )

  return res
}

export function useTokens(variables = undefined, query = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
  const res = useSWR(
    shouldFetch ? ['tokens', chainId, query, JSON.stringify(variables)] : null,
    (_, chainId) => getTokens(chainId, query, variables),
    swrConfig
  )
  return res
}
