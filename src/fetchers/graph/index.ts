import { ChainId } from '@sushiswap/sdk'
import { request } from 'graphql-request'

export const CHEF_V2 = {
    [ChainId.MAINNET]: 'sushiswap/master-chefv2',
    [ChainId.MATIC]: 'sushiswap/matic-minichef',
}

export const chefV2 = (query, chainId = ChainId.MAINNET) =>
    request(
        `https://api.thegraph.com/subgraphs/name/${CHEF_V2[chainId]}`,
        query
    )

export const CHEF = {
    [ChainId.MAINNET]: 'sushiswap/master-chef',
}

export const chef = (query, chainId = ChainId.MAINNET) =>
    request(`https://api.thegraph.com/subgraphs/name/${CHEF[chainId]}`, query)

export const BLOCKS = {
    [ChainId.MAINNET]: 'blocklytics/ethereum-blocks',
    [ChainId.XDAI]: 'matthewlilley/xdai-blocks',
    [ChainId.MATIC]: 'matthewlilley/polygon-blocks',
    [ChainId.FANTOM]: 'matthewlilley/fantom-blocks',
    [ChainId.BSC]: 'matthewlilley/bsc-blocks',
}

export const blocks = (query, chainId = ChainId.MAINNET) =>
    request(`https://api.thegraph.com/subgraphs/name/${BLOCKS[chainId]}`, query)

export const EXCHANGE = {
    [ChainId.MAINNET]: 'sushiswap/exchange',
    [ChainId.XDAI]: 'sushiswap/xdai-exchange',
    [ChainId.MATIC]: 'sushiswap/matic-exchange',
    [ChainId.FANTOM]: 'sushiswap/fantom-exchange',
    [ChainId.BSC]: 'sushiswap/bsc-exchange',
}
export const exchange = (query, chainId = ChainId.MAINNET) =>
    request(
        `https://api.thegraph.com/subgraphs/name/${EXCHANGE[chainId]}`,
        query
    )

const BAR = {
    [ChainId.MAINNET]: 'matthewlilley/bar',
}
export const bar = (query, chainId = ChainId.MAINNET) =>
    request(`https://api.thegraph.com/subgraphs/name/${BAR[chainId]}`, query)

export const BENTOBOX = {
    [ChainId.MAINNET]: 'sushiswap/bentobox',
    [ChainId.XDAI]: 'sushiswap/xdai-bentobox',
    [ChainId.MATIC]: 'sushiswap/matic-bentobox',
    [ChainId.FANTOM]: 'sushiswap/fantom-bentobox',
    [ChainId.BSC]: 'sushiswap/bsc-bentobox',
}
export const bentobox = (query, chainId = ChainId.MAINNET) =>
    request(
        `https://api.thegraph.com/subgraphs/name/${BENTOBOX[chainId]}`,
        query
    )

export const status = (subgraphName) =>
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
