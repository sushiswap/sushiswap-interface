import { ChainId } from '@sushiswap/core-sdk'
import { GRAPH_HOST } from 'app/services/graph/constants'
import {
  barHistoriesQuery,
  barQuery,
  barUserQuery,
  barXsushiQuery,
  barXsushiUserQuery,
} from 'app/services/graph/queries/bar'
import { request } from 'graphql-request'

const BAR = {
  [ChainId.ETHEREUM]: 'matthewlilley/bar',
}

// @ts-ignore TYPE NEEDS FIXING
const fetcher = async (query, variables?: { [key: string]: any }) =>
  request(`${GRAPH_HOST[ChainId.ETHEREUM]}/subgraphs/name/${BAR[ChainId.ETHEREUM]}`, query, variables)

export const getBar = async (variables?: { [key: string]: any }) => {
  const { bar } = await fetcher(barQuery, variables)
  return bar
}

export const getBarHistory = async (variables?: { [key: string]: any }) => {
  const { histories } = await fetcher(barHistoriesQuery, variables)
  return histories
}

export const getBarUser = async (variables?: { [key: string]: any }) => {
  const { user } = await fetcher(barUserQuery, variables)
  return user
}

const fetcherXsushi = async (query: any, variables?: { [key: string]: any }) =>
  request(`https://thegraph.com/hosted-service/subgraph/olastenberg/xsushi`, query, variables)

export const getBarXsushi = async (variables?: { [key: string]: any }) => {
  const { xsushi } = await fetcherXsushi(barXsushiQuery, variables)
  return xsushi
}

export const getBarXsushiUser = async (variables?: { [key: string]: any }) => {
  const { user } = await fetcherXsushi(barXsushiUserQuery, variables)
  return user
}
