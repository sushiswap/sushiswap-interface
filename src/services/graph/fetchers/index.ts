import {
    ethPriceQuery,
    liquidityPositionSubsetQuery,
    pairSubsetQuery,
    pairsQuery,
    poolsQuery,
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

export const getMasterChefV1Farms = async (query) => {
    const { pools } = await masterChefV1(query)
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
