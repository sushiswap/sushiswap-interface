import { ethPriceQuery, liquidityPositionSubsetQuery, pairSubsetQuery, tokenQuery } from '../queries'
import {
  exchange,
  getAlcxPrice,
  getBundle,
  getCvxPrice,
  getLiquidityPositionSubset,
  getMaticPrice,
  getOnePrice,
  getStakePrice,
  getSushiPrice,
  getTokenPrice,
} from '../fetchers'
import { getEthPrice, getPairSubset, getPairs } from '../fetchers'
import { useEffect, useMemo } from 'react'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from '../../../hooks'

export function useExchange(query, variables, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR([chainId, query, variables], exchange, swrConfig)
  return data
}

export function useEthPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR('ethPrice', () => getEthPrice(), swrConfig)
  return data
}

export function useStakePrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.XDAI
  const { data } = useSWR(shouldFetch ? 'stakePrice' : null, () => getStakePrice(), swrConfig)
  return data
}

export function useOnePrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.HARMONY
  const { data } = useSWR(shouldFetch ? 'onePrice' : null, () => getOnePrice(), swrConfig)
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

export function useMaticPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId && chainId === ChainId.MATIC ? 'maticPrice' : null, () => getMaticPrice(), swrConfig)
  return data
}

export function useSushiPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR('sushiPrice', () => getSushiPrice(), swrConfig)
  return data
}

export function useBundle(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR([ChainId.MAINNET, ethPriceQuery], getBundle, swrConfig)
  return data
}

export function useLiquidityPositionSubset(user, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && user
  const { data } = useSWR(
    shouldFetch ? ['liquidityPositionSubset', chainId, user] : null,
    (_, chainId, user) => getLiquidityPositionSubset(chainId, user),
    swrConfig
  )
  return data
}

export function usePairs(pairAddresses = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
  const { data } = useSWR(shouldFetch ? ['pairs', chainId] : null, (_, chainId) => getPairs(chainId), swrConfig)
  return data
}

export function usePairSubset(pairAddresses, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && pairAddresses && pairAddresses.length
  // useEffect(() => {
  //   console.log('debug', { shouldFetch, chainId, pairAddresses })
  // }, [shouldFetch, chainId, pairAddresses])
  const { data } = useSWR(
    shouldFetch ? () => ['sushiPairs', chainId, pairAddresses] : null,
    (_, chainId, pairAddresses) => getPairSubset(chainId, { pairAddresses }),
    swrConfig
  )
  return data
}
