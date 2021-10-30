import { ChainId } from '@sushiswap/core-sdk'
import { request } from 'graphql-request'
import { GRAPH_HOST } from 'services/graph/constants'
import { barHistoriesQuery, barQuery } from 'services/graph/queries/bar'

const BAR = {
  [ChainId.ETHEREUM]: 'matthewlilley/bar',
}

export const bar = async (query, variables = undefined) =>
  request(`${GRAPH_HOST[ChainId.ETHEREUM]}/subgraphs/name/${BAR[ChainId.ETHEREUM]}`, query, variables)

export const getBar = async (block: number) => {
  const { bar: barData } = await bar(barQuery, { block: block ? { number: block } : undefined })
  return barData
}

export const getBarHistory = async () => {
  const { histories } = await bar(barHistoriesQuery)
  return histories
}
