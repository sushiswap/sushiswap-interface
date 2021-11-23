import { ChainId } from '@sushiswap/core-sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'
import { barHistoriesQuery, barQuery } from '../queries/bar'

const fetcher = async (query, variables = undefined) =>
  request(`${GRAPH_HOST[ChainId.ETHEREUM]}/subgraphs/name/matthewlilley/bar`, query, variables)

export const getBar = async (variables = undefined) => {
  const { bar } = await fetcher(barQuery, variables)
  return bar
}

export const getBarHistory = async (variables = undefined) => {
  const { histories } = await fetcher(barHistoriesQuery, variables)
  return histories
}
