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
  getFusePrice,
  getGnoPrice,
  getLiquidityPositions,
  getMagicPrice,
  getMaticPrice,
  getMovrPrice,
  getMphPrice,
  getNativePrice,
  getOhmPrice,
  getOnePrice,
  getPairDayData,
  getPairs,
  getPicklePrice,
  getRulerPrice,
  getSpellPrice,
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
  const { data } = useSWR(['ethPrice'], () => getNativePrice(variables), swrConfig)
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
  const { data } = useSWR(['onePrice'], () => getOnePrice(), swrConfig)
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

export function useYggPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(shouldFetch ? ['yggPrice'] : null, () => getYggPrice(), swrConfig)
  return data
}

export function useRulerPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(shouldFetch ? ['rulerPrice'] : null, () => getRulerPrice(), swrConfig)
  return data
}

export function useTruPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId && chainId === ChainId.ETHEREUM ? ['truPrice'] : null, () => getTruPrice(), swrConfig)
  return data
}

export function useAlcxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(shouldFetch ? ['aclxPrice'] : null, () => getAlcxPrice(), swrConfig)
  return data
}

export function useCvxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(shouldFetch ? ['cvxPrice'] : null, () => getCvxPrice(), swrConfig)
  return data
}

export function usePicklePrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(shouldFetch ? ['picklePrice'] : null, () => getPicklePrice(), swrConfig)
  return data
}

export function useMphPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(shouldFetch ? ['mphPrice'] : null, () => getMphPrice(), swrConfig)
  return data
}

export function useAvaxPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['avaxPrice'], () => getAvaxPrice(), swrConfig)
  return data
}

export function useMaticPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['maticPrice'], () => getMaticPrice(), swrConfig)
  return data
}

export function useSushiPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['sushiPrice'], () => getSushiPrice(), swrConfig)
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
  const shouldFetch = chainId && chainId === ChainId.FUSE
  const { data } = useSWR(shouldFetch ? 'fusePrice' : null, () => getFusePrice(), swrConfig)
  return data
}

export function useMagicPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ARBITRUM
  const { data } = useSWR(shouldFetch ? 'magicPrice' : null, () => getMagicPrice(), swrConfig)
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
  return data
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
