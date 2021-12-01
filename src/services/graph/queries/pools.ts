import gql from 'graphql-tag'

const tridentPoolsSubQuery = `
  __typename
  id
  kpi {
    volumeUSD
    liquidity
    liquidityUSD
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

export const poolHourSnapshotsQuery = gql`
  query PoolHourBuckets($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: PoolHourBucket_filter) {
    poolHourSnapshots(first: $first, skip: $skip, block: $block, where: $where, orderBy: date, orderDirection: desc) {
      id
      date
      totalValueLockedUSD
      volumeUSD
      feesUSD
      transactionCount
    }
  }
`

export const poolDaySnapshotsQuery = gql`
  query PoolDayBuckets($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: PoolDayBucket_filter) {
    poolDaySnapshots(first: $first, skip: $skip, block: $block, where: $where, orderBy: date, orderDirection: desc) {
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

export const getTridentPositionsQuery = gql`
  query getTridentPositionsQuery(
    $first: Int = 1000
    $skip: Int = 0
    $block: Block_height
    $where: LiquidityPosition_filter
  ) {
    liquidityPositions(
      first: $first
      skip: $skip
      block: $block
      where: $where
      orderBy: balance
      orderDirection: desc
    ) {
      id
      balance
      pool {
        ${tridentPoolsSubQuery}
      }
    }
  }
`

export const poolKpisQuery = gql`
  query poolKpisQuery($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: PoolKpi_filter) {
    poolKpis(first: $first, skip: $skip, block: $block, where: $where) {
      fees
      feesUSD
      volume
      volumeUSD
      liquidity
      liquidityUSD
      transactionCount
    }
  }
`
