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
  getTokenPrice,
} from '../fetchers'
import { getEthPrice, getPairs } from '../fetchers'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import { ethPriceQuery } from '../queries'
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

export function useSushiPairs(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId
  const { data } = useSWR(
    shouldFetch ? ['sushiPairs', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getPairs(chainId, variables),
    swrConfig
  )
  return data
}
