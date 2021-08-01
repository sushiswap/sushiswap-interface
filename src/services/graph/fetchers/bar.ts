import { ChainId } from '@sushiswap/sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'
import { barHistoriesQuery, barQuery } from '../queries/bar'

const BAR = {
  [ChainId.MAINNET]: 'matthewlilley/bar',
}

export const bar = async (query, variables = undefined) =>
  request(`https://api.thegraph.com/subgraphs/name/${BAR['1']}`, query, variables)

export const getBar = async (query = barQuery, variables) => {
  const { bar: barData } = await bar(query, variables)
  return barData
}

export const getBarHistory = async (query = barHistoriesQuery, variables) => {
  const { histories } = await bar(query, variables)
  return histories
}
