import { ChainId } from '@sushiswap/core-sdk'
import { GRAPH_HOST } from 'app/services/graph/constants'
import { request } from 'graphql-request'

import { candlesQuery } from '../queries/candles'

const CANDLE = {
  [ChainId.ETHEREUM]: 'sushiswap/candles',
}

// @ts-ignore TYPE NEEDS FIXING
const fetcher = async (query, variables?: { [key: string]: any }) =>
  request(`${GRAPH_HOST[ChainId.ETHEREUM]}/subgraphs/name/${CANDLE[ChainId.ETHEREUM]}`, query, variables)

export const getCandles = async (variables?: { [key: string]: any }) => {
  const { candles } = await fetcher(candlesQuery, variables)
  return candles
}
