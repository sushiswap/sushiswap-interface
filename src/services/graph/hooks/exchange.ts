import { ChainId } from '@sushiswap/core-sdk'
import { useActiveWeb3React } from 'app/services/web3'
import stringify from 'fast-json-stable-stringify'
import useSWR, { SWRConfiguration } from 'swr'

import {
  getAlcxPrice,
  getAvaxPrice,
  getBundle,
  getCeloPrice,
  getCvxPrice,
  getDayData,
  getFactory,
  getLiquidityPositions,
  getMaticPrice,
  getMovrPrice,
  getMphPrice,
  getNativePrice,
  getOnePrice,
  getPairDayData,
  getPairs,
  getPicklePrice,
  getRulerPrice,
  getSpellPrice,
  getStakePrice,
  getSushiPrice,
  getTokenDayData,
  getTokenPairs,
  getTokens,
  getTruPrice,
  getYggPrice,
} from '../fetchers'
import { GraphProps } from '../interfaces'
import { ethPriceQuery } from '../queries'

export function useFactory({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['factory', chainId, stringify(variables)] : null,
    () => getFactory(chainId, variables),
    swrConfig
  )
  return data
}

export function useNativePrice({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['nativePrice', chainId, stringify(variables)] : null,
    () => getNativePrice(chainId, variables),
    swrConfig
  )

  return data
}

export function useEthPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['ethPrice', stringify(variables)], () => getNativePrice(variables), swrConfig)
  return data
}

export function useStakePrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['stakePrice', stringify(variables)], () => getStakePrice(variables), swrConfig)
  return data
}

export function useSpellPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR('spellPrice', () => getSpellPrice(), swrConfig)
  return data
}

export function useOnePrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['onePrice', stringify(variables)], () => getOnePrice(variables), swrConfig)
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

export function useYggPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.ETHEREUM ? ['yggPrice', stringify(variables)] : null,
    () => getYggPrice(),
    swrConfig
  )
  return data
}

export function useRulerPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.ETHEREUM ? ['rulerPrice', stringify(variables)] : null,
    () => getRulerPrice(variables),
    swrConfig
  )
  return data
}

export function useTruPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.ETHEREUM ? ['truPrice', stringify(variables)] : null,
    () => getTruPrice(),
    swrConfig
  )
  return data
}

export function useAlcxPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(
    shouldFetch ? ['aclxPrice', stringify(variables)] : null,
    () => getAlcxPrice(variables),
    swrConfig
  )
  return data
}

export function useCvxPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(
    shouldFetch ? ['cvxPrice', stringify(variables)] : null,
    () => getCvxPrice(variables),
    swrConfig
  )
  return data
}

export function usePicklePrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.ETHEREUM ? ['picklePrice', stringify(variables)] : null,
    () => getPicklePrice(),
    swrConfig
  )
  return data
}

export function useMphPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId && chainId === ChainId.ETHEREUM ? ['mphPrice', stringify(variables)] : null,
    () => getMphPrice(),
    swrConfig
  )
  return data
}

export function useAvaxPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['avaxPrice', stringify(variables)], () => getAvaxPrice(variables), swrConfig)
  return data
}

export function useMaticPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['maticPrice', stringify(variables)], () => getMaticPrice(variables), swrConfig)
  return data
}

export function useSushiPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['sushiPrice', stringify(variables)], () => getSushiPrice(variables), swrConfig)
  return data
}

export function useBundle(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId ? [chainId, ethPriceQuery, stringify(variables)] : null, () => getBundle(), swrConfig)
  return data
}

export function useLiquidityPositions({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['liquidityPositions', chainId, stringify(variables)] : null,
    (_, chainId) => getLiquidityPositions(chainId, variables),
    swrConfig
  )
  return data
}

export function useSushiPairs({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['sushiPairs', chainId, stringify(variables)] : null,
    (_, chainId) => getPairs(chainId, variables),
    swrConfig
  )
  return data
}

export function useTokens({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['tokens', chainId, stringify(variables)] : null,
    (_, chainId) => getTokens(chainId, variables),
    swrConfig
  )
  return data ?? []
}

export function usePairDayData({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['pairDayData', chainId, stringify(variables)] : null,
    (_, chainId) => getPairDayData(chainId, variables),
    swrConfig
  )
  return data
}

export function useTokenDayData(
  { chainId, variables, shouldFetch = true }: GraphProps,
  swrConfig: SWRConfiguration = undefined
) {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['tokenDayData', chainId, stringify(variables)] : null,
    (_, chainId) => getTokenDayData(chainId, variables),
    swrConfig
  )
  return data
}

export function useDayData({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['dayData', chainId, stringify(variables)] : null,
    (_, chainId) => getDayData(chainId, variables),
    swrConfig
  )
  return data
}

export function useTokenPairs({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['tokenPairs', chainId, stringify(variables)] : null,
    (_, chainId) => getTokenPairs(chainId, variables),
    swrConfig
  )
  return data
}
