import { ChainId } from '@sushiswap/sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'
import { barHistoriesQuery, barQuery } from '../queries/bar'

const BAR = {
  [ChainId.MAINNET]: 'matthewlilley/bar',
}

export const bar = async (query, variables = undefined) =>
  request(`https://api.thegraph.com/subgraphs/name/${BAR['1']}`, query, variables)

export const getBar = async (block: number) => {
  const { bar: barData } = await bar(barQuery, { block: block ? { number: block } : undefined })
  return barData
}

export const getBarHistory = async () => {
  const { histories } = await bar(barHistoriesQuery)
  return histories
}
