import gql from 'graphql-tag'

const tridentPoolsSubQuery = `
  __typename
  id
  volumeUSD
  liquidity
  liquidityUSD
  feesUSD
  #transactionCount
  twapEnabled
  swapFee
  token0 {
    id
    name
    symbol
    decimals
  }
  token1 {
    id
    name
    symbol
    decimals
  }
  reserve0
  reserve1
  apr
`

// Schema not finalized for: 'concentratedLiquidityPools', 'indexPools', 'hybridPools'
const allPools = ['pairs']

export const getTridentPoolsQuery = gql`
  query getTridentsPoolsQuery(
    $first: Int = 1000
    $skip: Int = 0
    $block: Block_height
    $where: Pair_filter
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
  query PoolHourSnapshots($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: PairHourSnapshot_filter) {
    pairHourSnapshots(first: $first, skip: $skip, block: $block, where: $where, orderBy: date, orderDirection: desc) {
      id
      date
      liquidityUSD
      volumeUSD
      feesUSD
      transactionCount
    }
  }
`

export const poolDaySnapshotsQuery = gql`
  query poolDaySnapshots($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: PairDaySnapshot_filter) {
    pairDaySnapshots(first: $first, skip: $skip, block: $block, where: $where, orderBy: date, orderDirection: desc) {
      id
      date
      liquidityUSD
      volumeUSD
      feesUSD
      transactionCount
    }
  }
`

export const getTransactionsForPoolQuery = gql`
  query poolTransactionsQuery($first: Int = 1000, $skip: Int = 0, $poolAddress: String!) {
    mints: mints(first: $first, skip: $skip, where: { pair: $poolAddress }) {
      id
      pair {
        token0 {
          symbol
          price {
            derivedUSD: lastUsdPrice
          }
        }
        token1 {
          symbol
          price {
            derivedUSD: lastUsdPrice
          }
        }
      }
      amount0
      amount1
      transaction {
        id
        timestamp: createdAtTimestamp
      }
      origin: sender
      sender
      recipient: to
      logIndex
    }
    burns: burns(first: $first, skip: $skip, where: { pair: $poolAddress }) {
      id
      pair {
        token0 {
          symbol
          price {
            derivedUSD: lastUsdPrice
          }
        }
        token1 {
          symbol
          price {
            derivedUSD: lastUsdPrice
          }
        }
      }
      transaction {
        id
        timestamp: createdAtTimestamp
      }
      amount0
      amount1
      origin: sender
      sender
      recipient: to
      logIndex
    }
    swaps: swaps(first: $first, skip: $skip, where: { pair: $poolAddress }) {
      amountIn
      amountOut
      transaction {
        id
        timestamp: createdAtTimestamp
      }
      recipient: to
      tokenIn {
        symbol
        price {
          derivedUSD: lastUsdPrice
        }
      }
      tokenOut {
        symbol
        price {
          derivedUSD: lastUsdPrice
        }
      }
    }
  }
`

/* Need support for amountUSD */
export const getSwapsForPoolQuery = gql`
  query poolSwapQuery($poolAddress: String!) {
    swaps(where: { pair: $poolAddress }) {
      amountIn
      amountOut
      transaction {
        timestamp
      }
      recipient
      tokenIn {
        symbol
        price {
          derivedUSD
        }
      }
      tokenOut {
        symbol
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
      pair {
        ${tridentPoolsSubQuery}
      }
    }
  }
`

export const poolKpiQuery = gql`
  query poolKpiQuery($id: String!, $block: Block_height, $where: Pair_filter) {
    pairs(id: $id, block: $block, where: $where) {
      id
      feesUSD
      volumeUSD
      liquidity
      liquidityUSD
      #transactionCount
    }
  }
`

export const poolKpisQuery = gql`
  query poolKpisQuery($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: Pair_filter) {
    pairs(first: $first, skip: $skip, block: $block, where: $where) {
      id
      feesUSD
      volumeUSD
      liquidity
      liquidityUSD
      #transactionCount
    }
  }
`
