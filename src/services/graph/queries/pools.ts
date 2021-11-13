import gql from 'graphql-tag'

const tridentPoolsSubQuery = `
  id
  kpi {
    volumeUSD
    totalValueLockedUSD
    feesUSD
    transactionCount
  }
  twapEnabled
  swapFee
  assets {
    token {
      id
      name
      symbol
      decimals
    }
  }
`

// Schema not finalized for: 'concentratedLiquidityPools', 'indexPools', 'hybridPools'
const allPools = ['constantProductPools']

export const getTridentPoolsQuery = gql`
  query getTridentsPoolsQuery(
    $first: Int = 1000
    $skip: Int = 0
    $block: Block_height
    $where: ConstantProductPool_filter
  )
  {
    ${allPools.map(
      (pool) =>
        `${pool}(first: $first, skip: $skip, block: $block, where: $where) {
          ${tridentPoolsSubQuery}
         }
        `
    )}
  }
`

export const getPoolHourBuckets = gql`
  query getPoolHourBuckets($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: PoolHourBucket_filter) {
    poolHourBuckets(first: $first, skip: $skip, block: $block, where: $where, orderBy: date, orderDirection: desc) {
      id
      date
      totalValueLockedUSD
      volumeUSD
      feesUSD
      transactionCount
    }
  }
`

export const getPoolDayBuckets = gql`
  query getPoolDayBuckets($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: PoolDayBucket_filter) {
    poolDayBuckets(first: $first, skip: $skip, block: $block, where: $where, orderBy: date, orderDirection: desc) {
      id
      date
      totalValueLockedUSD
      volumeUSD
      feesUSD
      transactionCount
    }
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
