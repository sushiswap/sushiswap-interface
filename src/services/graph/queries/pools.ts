import gql from 'graphql-tag'

const subQuery = `
  totalValueLockedUSD
  twapEnabled
  swapFee
  assets {
    id
    metaData {
      name
      symbol
    }
  }
`

// Schema not finalized for: 'concentratedLiquidityPools', 'indexPools', 'hybridPools'
const allPools = ['constantProductPools']

export const getTridentPoolsQuery = gql`
  {
    ${allPools.map(
      (pool) =>
        `${pool}(orderBy:totalValueLockedUSD, orderDirection:desc) {
          ${subQuery}
         }
        `
    )}
  }
`

/* Need support for amountUSD */
export const getSwapsForPoolQuery = gql`
  query poolSwapQuery($poolAddress: String!) {
    swaps(where: { pool: $poolAddress }) {
      amountIn
      amountOut
      transaction {
        timestamp
      }
      recipient
      tokenIn {
        metaData {
          symbol
        }
      }
      tokenOut {
        metaData {
          symbol
        }
      }
    }
  }
`
