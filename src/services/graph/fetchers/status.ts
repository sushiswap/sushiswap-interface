import { ChainId } from '@sushiswap/core-sdk'
import { GRAPH_HOST } from 'app/services/graph/constants'
import { request } from 'graphql-request'

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
