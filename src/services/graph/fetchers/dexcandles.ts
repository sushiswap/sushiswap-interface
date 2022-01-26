import { ChainId } from '@sushiswap/core-sdk'
import { pager } from 'app/services/graph'
import { GRAPH_HOST } from 'app/services/graph/constants'
import { barsQuery } from 'app/services/graph/queries/dexcandles'
import { SubscriptionClient } from 'subscriptions-transport-ws'

export const DEXCANDLES = {
  [ChainId.ETHEREUM]: 'sushiswap/candles',
  [ChainId.MATIC]: 'sushiswap/polygon-candles',
  [ChainId.FANTOM]: 'sushiswap/fantom-candles',
  [ChainId.AVALANCHE]: 'sushiswap/avalanche-candles',
}

export const client = (chainId = ChainId.ETHEREUM) =>
  // @ts-ignore TYPE NEEDS FIXING
  new SubscriptionClient(`wss://api.thegraph.com/subgraphs/name/${DEXCANDLES[chainId]}`, {
    reconnect: true,
  })

// @ts-ignore TYPE NEEDS FIXING
export const dexcandles = async (chainId = ChainId.ETHEREUM, query, variables = {}) =>
  // @ts-ignore TYPE NEEDS FIXING
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${DEXCANDLES[chainId]}`, query, variables)

export const getDexCandles = async (chainId = ChainId.ETHEREUM, variables = {}) => {
  const { candles } = await dexcandles(chainId, barsQuery, variables)
  return candles
}
