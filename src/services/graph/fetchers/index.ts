import {
  ethPriceQuery,
  liquidityPositionSubsetQuery,
  masterChefV1SushiPerBlockQuery,
  masterChefV1TotalAllocPointQuery,
  miniChefPoolsQuery,
  pairSubsetQuery,
  pairsQuery,
  poolsQuery,
  poolsV2Query,
  tokenPriceQuery,
} from '../queries'

import { ChainId } from '@sushiswap/sdk'
import { Chef } from '../../../features/farm/enum'
import { request } from 'graphql-request'

export * from './blocks'
export * from './exchange'

export const MINICHEF = {
  [ChainId.MATIC]: 'sushiswap/matic-minichef',
  [ChainId.XDAI]: 'matthewlilley/xdai-minichef',
}

export const miniChef = async (query, chainId = ChainId.MAINNET) =>
  request(`https://api.thegraph.com/subgraphs/name/${MINICHEF[chainId]}`, query)

export const MASTERCHEF_V2 = {
  [ChainId.MAINNET]: 'sushiswap/master-chefv2',
}

export const masterChefV2 = async (query, chainId = ChainId.MAINNET) =>
  request(`https://api.thegraph.com/subgraphs/name/${MASTERCHEF_V2[chainId]}`, query)

export const MASTERCHEF_V1 = {
  [ChainId.MAINNET]: 'sushiswap/master-chef',
}

export const masterChefV1 = async (query, chainId = ChainId.MAINNET) =>
  request(`https://api.thegraph.com/subgraphs/name/${MASTERCHEF_V1[chainId]}`, query)

export const getMasterChefV1TotalAllocPoint = async () => {
  const { masterChef } = await masterChefV1(masterChefV1TotalAllocPointQuery)
  return masterChef?.totalAllocPoint
}

export const getMasterChefV1SushiPerBlock = async () => {
  const { masterChef } = await masterChefV1(masterChefV1SushiPerBlockQuery)
  return masterChef?.sushiPerBlock
}

export const getMasterChefV1Farms = async () => {
  const { pools } = await masterChefV1(poolsQuery)
  return pools
}

export const getMasterChefV2Farms = async () => {
  const { pools } = await masterChefV2(poolsV2Query)
  return pools
}

export const getMiniChefFarms = async (chainId = ChainId.MAINNET) => {
  const { pools } = await miniChef(miniChefPoolsQuery, chainId)
  return pools
}

const BAR = {
  [ChainId.MAINNET]: 'matthewlilley/bar',
}
export const bar = async (query, chainId = ChainId.MAINNET) =>
  request(`https://api.thegraph.com/subgraphs/name/${BAR[chainId]}`, query)

export const status = async (subgraphName) =>
  request(
    'https://api.thegraph.com/index-node/graphql',
    `
        indexingStatusForCurrentVersion(subgraphName: "${subgraphName}") {
            synced
            health
            fatalError {
              message
              block {
                number
                hash
              }
              handler
            }
            chains {
              chainHeadBlock {
                number
              }
              latestBlock {
                number
              }
            }
          }
        `
  )
