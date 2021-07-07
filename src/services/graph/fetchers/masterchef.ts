import {
  masterChefV1PairAddressesQuery,
  masterChefV1SushiPerBlockQuery,
  masterChefV1TotalAllocPointQuery,
  masterChefV2PairAddressesQuery,
  miniChefPairAddressesQuery,
  miniChefPoolsQuery,
  poolsQuery,
  poolsV2Query,
} from '../queries'

import { ChainId } from '@sushiswap/sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'

export const MINICHEF = {
  [ChainId.MATIC]: 'sushiswap/matic-minichef',
  [ChainId.XDAI]: 'matthewlilley/xdai-minichef',
  [ChainId.HARMONY]: 'sushiswap/harmony-minichef',
}

export const miniChef = async (query, chainId = ChainId.MAINNET) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MINICHEF[chainId]}`, query)

export const MASTERCHEF_V2 = {
  [ChainId.MAINNET]: 'jiro-ono/sushitestsubgraph',
}

export const masterChefV2 = async (query, chainId = ChainId.MAINNET) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MASTERCHEF_V2[chainId]}`, query)

export const MASTERCHEF_V1 = {
  [ChainId.MAINNET]: 'sushiswap/master-chef',
}

export const masterChefV1 = async (query, chainId = ChainId.MAINNET) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MASTERCHEF_V1[chainId]}`, query)

export const getMasterChefV1TotalAllocPoint = async () => {
  const {
    masterChef: { totalAllocPoint },
  } = await masterChefV1(masterChefV1TotalAllocPointQuery)
  return totalAllocPoint
}

export const getMasterChefV1SushiPerBlock = async () => {
  const {
    masterChef: { sushiPerBlock },
  } = await masterChefV1(masterChefV1SushiPerBlockQuery)
  return sushiPerBlock / 1e18
}

export const getMasterChefV1Farms = async () => {
  const { pools } = await masterChefV1(poolsQuery)
  return pools
}

export const getMasterChefV1PairAddreses = async () => {
  const { pools } = await masterChefV1(masterChefV1PairAddressesQuery)
  return pools
}

export const getMasterChefV2Farms = async () => {
  const { pools } = await masterChefV2(poolsV2Query)
  return pools
}

export const getMasterChefV2PairAddreses = async () => {
  const { pools } = await masterChefV2(masterChefV2PairAddressesQuery)
  return pools
}

export const getMiniChefFarms = async (chainId = ChainId.MAINNET) => {
  const { pools } = await miniChef(miniChefPoolsQuery, chainId)
  return pools
}

export const getMiniChefPairAddreses = async (chainId = ChainId.MAINNET) => {
  console.debug("getMiniChefPairAddreses")
  const { pools } = await miniChef(miniChefPairAddressesQuery, chainId)
  console.log({ pools })
  return pools
}
