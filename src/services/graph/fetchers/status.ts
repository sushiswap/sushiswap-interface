import { ChainId } from '@sushiswap/core-sdk'
import { request } from 'graphql-request'
import { GRAPH_HOST } from 'services/graph/constants'

export const status = async (chainId = ChainId.ETHEREUM, subgraphName) =>
  request(
    `${GRAPH_HOST[chainId]}/index-node/graphql`,
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
