import { ChainId } from '@sushiswap/sdk'
import { request } from 'graphql-request'

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
