import { ChainId } from '@figswap/core-sdk'
import { GRAPH_HOST } from 'app/services/graph/constants'
import {
  barHistoriesQuery,
  barQuery,
  barUserQuery,
  barXsushiQuery,
  barXsushiUserQuery,
  feesQuery,
} from 'app/services/graph/queries/bar'
import { getUnixTime, startOfHour, startOfMinute, startOfSecond, subDays } from 'date-fns'
import { request } from 'graphql-request'

const BAR = {
  [ChainId.ETHEREUM]: 'olastenberg/bar',
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
  request(`${GRAPH_HOST[ChainId.ETHEREUM]}/subgraphs/name/jiro-ono/xsushi`, query, variables)

export const getBarXsushi = async (variables?: { [key: string]: any }) => {
  const { xsushi } = await fetcherXsushi(barXsushiQuery, variables)
  return xsushi
}

export const getBarXsushiUser = async (variables?: { [key: string]: any }) => {
  const { user } = await fetcherXsushi(barXsushiUserQuery, variables)
  return user
}

// @ts-ignore TYPE NEEDS FIXING
export const getFees = async (variables) => {
  const { fees } = await fetcherXsushi(feesQuery, variables)
  return fees
}

// @ts-ignore TYPE NEEDS FIXING
export const getBarFeesDaysAgo = async (days) => {
  const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), days))))
  const start = getUnixTime(date)
  const end = getUnixTime(Date.now())

  const { fees } = await fetcherXsushi(feesQuery, {
    where: {
      createdAtTimestamp_gt: start,
      createdAtTimestamp_lt: end,
    },
  })

  const totalSushi = fees?.reduce(
    //@ts-ignore TYPE NEEDS FIXING
    (previousValue, currentValue) => {
      return previousValue + currentValue.amount / 1e18
    },
    0
  )

  return totalSushi
}
