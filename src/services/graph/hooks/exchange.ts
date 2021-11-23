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
  getOnePrice,
  getPicklePrice,
  getRulerPrice,
  getSpellPrice,
  getStakePrice,
  getSushiPrice,
  getToken,
  getTokenDayData,
  getTokenPairs,
  getTokens,
  getTransactions,
  getTruPrice,
  getYggPrice,
  getNativePrice,
  getPairs,
} from '../fetchers'
import useSWR, { SWRConfiguration } from 'swr'
import { ChainId } from '@sushiswap/core-sdk'
import { ethPriceQuery } from '../queries'
import { useActiveWeb3React } from '../../../services/web3'
import { useBlock } from './blocks'
import stringify from 'fast-json-stable-stringify'

interface useFactoryProps {
  chainId: number
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useFactory({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: useFactoryProps) {
  const { data } = useSWR(
    shouldFetch ? ['factory', chainId, stringify(variables)] : null,
    () => getFactory(chainId, variables),
    swrConfig
  )
  return data
}

interface useNativePriceProps {
  chainId: number
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useNativePrice({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: useNativePriceProps) {
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

interface useLiquidityPositionsProps {
  timestamp?: number
  block?: number
  chainId: number
  shouldFetch?: boolean
  user?: string
}

export function useLiquidityPositions(
  { timestamp, block, chainId = ChainId.ETHEREUM, shouldFetch = true, user }: useLiquidityPositionsProps,
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
    shouldFetch ? ['liquidityPositions', chainId, stringify(variables)] : null,
    (_, chainId) => getLiquidityPositions(chainId, variables),
    swrConfig
  )
  return data
}

interface useSushiPairsProps {
  chainId: ChainId
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useSushiPairs({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: useSushiPairsProps) {
  const { data } = useSWR(
    shouldFetch ? ['sushiPairs', chainId, stringify(variables)] : null,
    (_, chainId) => getPairs(chainId, variables),
    swrConfig
  )
  return data
}

interface useTokensProps {
  chainId: number
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useTokens(
  { chainId = ChainId.ETHEREUM, variables, shouldFetch = true }: useTokensProps,
  swrConfig: SWRConfiguration = undefined
) {
  const { data } = useSWR(
    shouldFetch ? ['tokens', chainId, stringify(variables)] : null,
    (_, chainId) => getTokens(chainId, variables),
    swrConfig
  )
  return data ?? []
}

interface useTokenDayDataProps {
  timestamp?: number
  block?: number
  chainId: number
  shouldFetch?: boolean
  token: string
  first?: number
}

export function useTokenDayData(
  { timestamp, block, chainId = ChainId.ETHEREUM, shouldFetch = true, token, first }: useTokenDayDataProps,
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, chainId, shouldFetch: shouldFetch && !!timestamp })
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
    shouldFetch ? ['tokenDayDaya', chainId, stringify(variables)] : null,
    (_, chainId) => getTokenDayData(chainId, variables),
    swrConfig
  )
  return data
}

interface useDayDataProps {
  timestamp?: number
  block?: number
  chainId: number
  shouldFetch?: boolean
  first?: number
}

export function useDayData(
  { timestamp, block, chainId = ChainId.ETHEREUM, shouldFetch = true, first }: useDayDataProps,
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, chainId, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  shouldFetch = shouldFetch && !!chainId

  const variables = {
    first: first,
    block: block ? { number: block } : undefined,
  }

  const { data } = useSWR(
    shouldFetch ? ['dayData', chainId, stringify(variables)] : null,
    (_, chainId) => getDayData(chainId, variables),
    swrConfig
  )
  return data
}

interface useTransactionsProps {
  chainId: number
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useTransactions({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: useTransactionsProps) {
  const { data } = useSWR(
    shouldFetch ? ['transactions', chainId, stringify(variables)] : null,
    (_, chainId) => getTransactions(chainId, variables),
    swrConfig
  )
  return data
}

interface useTokenPairsProps {
  chainId: number
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useTokenPairs({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: useTokenPairsProps) {
  const { data } = useSWR(
    shouldFetch ? ['tokenPairs', chainId, stringify(variables)] : null,
    (_, chainId) => getTokenPairs(chainId, variables),
    swrConfig
  )
  return data
}
