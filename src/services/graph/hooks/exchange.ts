import {
  exchange,
  getAlcxPrice,
  getBundle,
  getCvxPrice,
  getLiquidityPositions,
  getMaticPrice,
  getOnePrice,
  getStakePrice,
  getSushiPrice,
  getAvaxPrice,
  getTokens,
  getDayData,
  getFactory,
  getToken,
  getTokenPairs,
  getTransactions,
  getTokenDayData,
} from '../fetchers'
import { getEthPrice, getPairs } from '../fetchers'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import { ethPriceQuery } from '../queries'
import { useActiveWeb3React } from '../../../hooks'

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

export function useNativePrice(variables = undefined, chainId = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId: chainIdSelected } = useActiveWeb3React()
  chainId = chainId ?? chainIdSelected

  // TODO: Check if all chains have correct native tokens (OKEX, FANTOM, CELO)
  const map = {
    [ChainId.MAINNET]: getEthPrice,
    [ChainId.XDAI]: getStakePrice,
    [ChainId.MATIC]: getEthPrice,
    [ChainId.FANTOM]: getEthPrice,
    [ChainId.BSC]: getEthPrice,
    [ChainId.HARMONY]: getOnePrice,
    [ChainId.OKEX]: getEthPrice,
    [ChainId.AVALANCHE]: getAvaxPrice,
    [ChainId.CELO]: getEthPrice,
  }

  const fetcher = map[chainId] ?? getEthPrice

  const { data } = useSWR([fetcher.name, JSON.stringify(variables)], () => fetcher(variables), swrConfig)

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

export function useMaticPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MATIC
  const { data } = useSWR(
    shouldFetch ? ['maticPrice', JSON.stringify(variables)] : null,
    () => getMaticPrice(variables),
    swrConfig
  )
  return data
}

export function useAvaxPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.AVALANCHE
  const { data } = useSWR(
    shouldFetch ? ['avaxPrice', JSON.stringify(variables)] : null,
    () => getAvaxPrice(variables),
    swrConfig
  )
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

export function useLiquidityPositions(
  variables = undefined,
  chainId = undefined,
  swrConfig: SWRConfiguration = undefined
) {
  const { chainId: chainIdSelected } = useActiveWeb3React()
  chainId = chainId ?? chainIdSelected
  const shouldFetch = chainId
  const { data } = useSWR(
    shouldFetch ? ['liquidityPositions', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getLiquidityPositions(chainId, variables),
    swrConfig
  )
  return data
}

export function useSushiPairs(
  variables = undefined,
  query = undefined,
  chainId = undefined,
  swrConfig: SWRConfiguration = undefined
) {
  const { chainId: chainIdSelected } = useActiveWeb3React()
  chainId = chainId ?? chainIdSelected
  const shouldFetch = chainId
  const { data } = useSWR(
    shouldFetch ? ['sushiPairs', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getPairs(chainId, variables, query),
    swrConfig
  )
  return data
}

export function useTokens(
  variables = undefined,
  query = undefined,
  chainId = undefined,
  swrConfig: SWRConfiguration = undefined
) {
  const { chainId: chainIdSelected } = useActiveWeb3React()
  chainId = chainId ?? chainIdSelected
  const shouldFetch = chainId
  const { data } = useSWR(
    shouldFetch ? ['tokens', chainId, query, JSON.stringify(variables)] : null,
    (_, chainId) => getTokens(chainId, query, variables),
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

export function useTokenDayData(variables, query = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
  const { data } = useSWR(
    shouldFetch ? ['tokenDayDaya', chainId, query, JSON.stringify(variables)] : null,
    (_, chainId) => getTokenDayData(chainId, query, variables),
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
