import gql from 'graphql-tag'

export const factoryQuery = gql`
  query factoryQuery($block: Block_height) {
    factories(first: 1, block: $block) {
      id
      volumeUSD
      liquidityUSD
    }
  }
`

export const userIdsQuery = gql`
  query userIdsQuery($first: Int! = 1000, $skip: Int! = 0) {
    users(first: $first, skip: $skip) {
      id
    }
  }
`
export const uniswapUserQuery = gql`
  query uniswapUserQuery($id: String!) {
    uniswapUser: user(id: $id) {
      id
      liquidityPositions {
        id
        liquidityTokenBalance
        # historicalSnapshots {
        #   id
        #   reserve0
        #   reserve1
        #   block
        #   timestamp
        #   liquidityTokenBalance
        #   liquidityTokenTotalSupply
        # }
      }
    }
  }
`

export const bundleFields = gql`
  fragment bundleFields on Bundle {
    id
    nativePrice
  }
`

export const nativePriceQuery = gql`
  query nativePriceQuery($id: Int! = 1, $block: Block_height) {
    bundles(id: $id, block: $block) {
      ...bundleFields
    }
  }
  ${bundleFields}
`

export const tokenPriceQuery = gql`
  query tokenPriceQuery($id: String!) {
    token(id: $id) {
      id
      price {
        derivedNative
      }
    }
  }
`

export const factoryDaySnapshotsFieldsQuery = gql`
  fragment factoryDaySnapshotsFields on FactoryDaySnapshot {
    id
    date
    volumeNative
    volumeUSD
    untrackedVolumeUSD
    liquidityNative
    liquidityUSD
    transactionCount
  }
`

// Dashboard...
export const factoryDaySnapshotsQuery = gql`
  query factoryDaySnapshots($first: Int! = 1000, $date: Int! = 0, $where: FactoryDaySnapshot_filter) {
    factoryDaySnapshots(first: $first, orderBy: date, orderDirection: desc, where: $where) {
      ...factoryDaySnapshotsFields
    }
  }
  ${factoryDaySnapshotsFieldsQuery}
`

// Pairs...
export const pairFieldsQuery = gql`
  fragment pairFields on Pair {
    id
    liquidityUSD
    liquidityNative
    volumeUSD
    untrackedVolumeUSD
    trackedLiquidityNative
    token0 {
      ...PairToken
    }
    token1 {
      ...PairToken
    }
    reserve0
    reserve1
    token0Price
    token1Price
    liquidity # totalSupply
    txCount
  }
  fragment PairToken on Token {
    id
    name
    symbol
    decimals
    liquidity
    price {
      derivedNative
    }
  }
`

export const pairQuery = gql`
  query pairQuery($id: String!, $block: Block_height) {
    pair(id: $id, block: $block) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

export const pairIdsQuery = gql`
  query pairIdsQuery($skip: Int) {
    pairs(first: 1000, skip: $skip) {
      id
    }
  }
`

export const pairCountQuery = gql`
  query pairCountQuery {
    uniswapFactories {
      pairCount
    }
  }
`

export const pairDaySnapshotsQuery = gql`
  query pairDaySnapshotsQuery($first: Int = 1000, $skip: Int, $block: Block_height, $where: PairDaySnapshot_filter) {
    pairDaySnapshots(first: $first, skip: $skip, orderBy: date, orderDirection: desc, where: $where, block: $block) {
      date
      pair {
        id
      }
      liquidityUSD
      volumeToken0
      volumeToken1
      volumeUSD
      transactionCount
    }
  }
`

export const liquidityPositionsQuery = gql`
  query liquidityPositionSubsetQuery($first: Int! = 1000, $skip: Int, $where: LiquidityPosition_filter) {
    liquidityPositions(first: $first, skip: $skip, where: $where) {
      id
      balance
      user {
        id
      }
      pair {
        id
      }
    }
  }
`

export const pairsQuery = gql`
  query pair(
    $skip: Int = 0
    $first: Int = 1000
    $where: Pair_filter
    $block: Block_height
    $orderBy: Pair_orderBy = "trackedLiquidityNative"
    $orderDirection: OrderDirection = "desc"
  ) {
    pairs(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      block: $block
      where: $where
    ) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

export const pairsTimeTravelQuery = gql`
  query pairsTimeTravelQuery($first: Int! = 1000, $pairAddresses: [Bytes]!, $block: Block_height!) {
    pairs(
      first: $first
      block: $block
      orderBy: trackedLiquidityNative
      orderDirection: desc
      where: { id_in: $pairAddresses }
    ) {
      id
      liquidityUSD
      trackedLiquidityNative
      volumeUSD
      untrackedVolumeUSD
      txCount
    }
  }
`

// Tokens...
export const tokenFieldsQuery = gql`
  fragment tokenFields on Token {
    id
    symbol
    name
    decimals
    volume
    volumeUSD
    untrackedVolumeUSD
    txCount
    liquidity
    liquidityUSD
    price {
      derivedNative
    }
  }
`

export const tokenQuery = gql`
  query tokenQuery($id: String!, $block: Block_height) {
    token(id: $id, block: $block) {
      ...tokenFields
    }
  }
  ${tokenFieldsQuery}
`

export const tokenIdsQuery = gql`
  query tokenIdsQuery($skip: Int) {
    tokens(first: 1000, skip: $skip) {
      id
    }
  }
`

export const tokenDaySnapshotsQuery = gql`
  query tokenDaySnapshotsQuery($first: Int! = 1000, $skip: Int, $block: Block_height, $where: TokenDaySnapshot_filter) {
    tokenDaySnapshots(first: $first, skip: $skip, orderBy: date, orderDirection: desc, where: $where, block: $block) {
      id
      date
      token {
        id
      }
      volumeUSD
      liquidityUSD
      priceUSD
      transactionCount
    }
  }
`

export const tokenPairsQuery = gql`
  query tokenPairsQuery($id: String!, $skip: Int, $block: Block_height) {
    pairs0: pairs(
      first: 1000
      skip: $skip
      orderBy: liquidityUSD
      orderDirection: desc
      where: { token0: $id }
      block: $block
    ) {
      ...pairFields
    }
    pairs1: pairs(
      first: 1000
      skip: $skip
      orderBy: liquidityUSD
      orderDirection: desc
      where: { token1: $id }
      block: $block
    ) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

export const tokensQuery = gql`
  query tokensQuery($first: Int! = 1000, $skip: Int, $block: Block_height, $where: Token_filter) {
    tokens(first: $first, skip: $skip, orderBy: volumeUSD, orderDirection: desc, block: $block, where: $where) {
      ...tokenFields
    }
  }
  ${tokenFieldsQuery}
`

export const tokenSubsetQuery = gql`
  query tokenSubsetQuery(
    $first: Int! = 1000
    $skip: Int
    $tokenAddresses: [Bytes]!
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
    $block: Block_height
  ) {
    tokens(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { id_in: $tokenAddresses }
      block: $block
    ) {
      ...tokenFields
    }
  }
  ${tokenFieldsQuery}
`

// Transactions...
export const transactionsQuery = gql`
  query transactionsQuery($first: Int! = 1000, $skip: Int, $block: Block_height, $where: Swap_filter) {
    swaps(orderBy: timestamp, orderDirection: desc, where: $where) {
      id
      timestamp
      transaction {
        id
      }
      tokenIn {
        symbol
      }
      tokenOut {
        symbol
      }
      sender
      amountIn
      amountOut
      amountUSD
      to
    }
    mints(orderBy: timestamp, orderDirection: desc, where: $where) {
      id
      timestamp
      transaction {
        id
      }
      pair {
        id
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      sender
      amount0
      amount1
      amountUSD
      to
    }
    burns(orderBy: timestamp, orderDirection: desc, where: $where) {
      id
      timestamp
      transaction {
        id
      }
      pair {
        id
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      sender
      amount0
      amount1
      amountUSD
      to
    }
  }
`
