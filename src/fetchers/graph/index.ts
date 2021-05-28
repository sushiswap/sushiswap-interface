import { ChainId } from '@sushiswap/sdk'
import { request } from 'graphql-request'

const EXCHANGE = {
    [ChainId.MAINNET]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
    [ChainId.XDAI]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/xdai-exchange',
    [ChainId.MATIC]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange',
    [ChainId.FANTOM]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/fantom-exchange',
    [ChainId.BSC]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-exchange',
}
export const exchange = (query, chainId = ChainId.MAINNET) =>
    request(EXCHANGE[chainId], query)

const BAR = {
    [ChainId.MAINNET]:
        'https://api.thegraph.com/subgraphs/name/matthewlilley/bar',
}
export const bar = (query, chainId = ChainId.MAINNET) =>
    request(BAR[chainId], query)

const BENTOBOX = {
    [ChainId.MAINNET]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/bentobox',
    [ChainId.XDAI]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/xdai-bentobox',
    [ChainId.MATIC]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/matic-bentobox',
    [ChainId.FANTOM]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/fantom-bentobox',
    [ChainId.BSC]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-bentobox',
}
export const bentobox = (query, chainId = ChainId.MAINNET) =>
    request(BENTOBOX[chainId], query)

// indexingStatusForCurrentVersion(subgraphName: "org/subgraph") {
//     synced
//     health
//     fatalError {
//       message
//       block {
//         number
//         hash
//       }
//       handler
//     }
//     chains {
//       chainHeadBlock {
//         number
//       }
//       latestBlock {
//         number
//       }
//     }
//   }
