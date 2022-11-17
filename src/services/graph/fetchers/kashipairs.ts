import { ChainId } from '@sushiswap/core-sdk'
import { GRAPH_HOST } from 'app/services/graph/constants'

import {
  dataKashiPairsQuery,
  kashiPairQuery,
  kashiPairsDayDataQuery,
  kashiTokenDayDataQuery,
  kashiTokenQuery,
  kashiTokensQuery,
} from '../queries'
import { pager, pagerRequestOnce } from './pager'

const KASHI = {
  [ChainId.ETHEREUM]: 'sushiswap/bentobox',
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-bentobox',
  [ChainId.FANTOM]: 'sushiswap/fantom-bentobox',
  [ChainId.BSC]: 'sushiswap/bsc-bentobox',
  [ChainId.MATIC]: 'sushiswap/matic-bentobox',
}

const KASHINew = {
  [ChainId.ARBITRUM]: 'sushiswap/kashi-arbitrum',
  [ChainId.MATIC]: 'sushiswap/kashi-polygon',
}

// @ts-ignore TYPE NEEDS FIXING
const fetcher = async (chainId = ChainId.ETHEREUM, query, variables = undefined) =>
  // @ts-ignore TYPE NEEDS FIXING
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${KASHI[chainId]}`, query, variables)

// @ts-ignore TYPE NEEDS FIXING
const fetcherNew = async (chainId = ChainId.ETHEREUM, query, variables = undefined) =>
  // @ts-ignore TYPE NEEDS FIXING
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${KASHINew[chainId]}`, query, variables)

// @ts-ignore TYPE NEEDS FIXING
const fetcherWithLimit = async (chainId = ChainId.ETHEREUM, query, variables = undefined) =>
  // @ts-ignore TYPE NEEDS FIXING
  pagerRequestOnce(`${GRAPH_HOST[chainId]}/subgraphs/name/${KASHI[chainId]}`, query, variables)

export const getDataKashiPair = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  const data = await fetcher(chainId, kashiPairQuery, variables)
  return data
}

export const getDataKashiPairs = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  const data = await fetcherNew(chainId, dataKashiPairsQuery)
  return data
}

export const getDataKashiPairsDayData = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  const data = await fetcherWithLimit(chainId, kashiPairsDayDataQuery, variables)
  return data
}

export const getDataKashiToken = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  const data = await fetcherNew(chainId, kashiTokenQuery, variables)
  return data
}

export const getDataKashiTokens = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  const data = await fetcherNew(chainId, kashiTokensQuery)
  return data
}

export const getDataTokenPairsDayData = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  const data = await fetcherWithLimit(chainId, kashiTokenDayDataQuery, variables)
  return data
}
