import {
    ethPriceQuery,
    liquidityPositionSubsetQuery,
    miniChefPoolsQuery,
    pairSubsetQuery,
    pairsQuery,
    poolsQuery,
    poolsV2Query,
    tokenPriceQuery,
} from '../queries'

import { ChainId } from '@sushiswap/sdk'
import { request } from 'graphql-request'

export * from './blocks'
export * from './exchange'

export const MINICHEF = {
    [ChainId.MATIC]: 'sushiswap/matic-minichef',
}

export const miniChef = async (query) =>
    request(
        `https://api.thegraph.com/subgraphs/name/${MINICHEF[ChainId.MATIC]}`,
        query
    )

export const MASTERCHEF_V2 = {
    [ChainId.MAINNET]: 'sushiswap/master-chefv2',
}

export const masterChefV2 = async (query) =>
    request(
        `https://api.thegraph.com/subgraphs/name/${
            MASTERCHEF_V2[ChainId.MAINNET]
        }`,
        query
    )

export const MASTERCHEF_V1 = {
    [ChainId.MAINNET]: 'sushiswap/master-chef',
}

export const masterChefV1 = async (query) =>
    request(
        `https://api.thegraph.com/subgraphs/name/${
            MASTERCHEF_V1[ChainId.MAINNET]
        }`,
        query
    )

export const getMasterChefV1Farms = async () => {
    const { pools } = await masterChefV1(poolsQuery)
    return pools
}

export const getMasterChefV2Farms = async () => {
    const { pools } = await masterChefV2(poolsV2Query)
    return pools
}

export const getMiniChefFarms = async () => {
    const { pools } = await miniChef(miniChefPoolsQuery)
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
