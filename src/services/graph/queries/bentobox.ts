import gql from 'graphql-tag'

export const cloneFieldsQuery = gql`
  fragment cloneFields on Clone {
    id
    address: id
    data
    block
    timestamp
  }
`

export const clonesQuery = gql`
  query clones(
    $skip: Int = 0
    $first: Int = 1000
    $where: Clone_filter
    $block: Block_height
    $orderBy: Clone_orderBy
    $orderDirection: OrderDirection
  ) {
    clones(
      skip: $skip
      first: $first
      where: $where
      block: $block
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...cloneFields
    }
  }
  ${cloneFieldsQuery}
`

export const bentoTokenFieldsQuery = gql`
  fragment bentoTokenFields on Token {
    id
    # bentoBox
    name
    symbol
    decimals
    totalSupplyElastic
    totalSupplyBase
    block
    timestamp
  }
`

export const bentoTokensQuery = gql`
  query bentoTokens($first: Int = 1000, $block: Block_height, $where: Token_filter) {
    tokens(first: $first, skip: $skip, block: $block, where: $where) {
      ...bentoTokenFields
    }
  }
  ${bentoTokenFieldsQuery}
`

export const bentoUserTokensQuery = gql`
  query bentoUserTokens($user: String!, $skip: Int = 0, $first: Int = 1000, $block: Block_height) {
    userTokens(skip: $skip, first: $first, block: $block, where: { share_gt: 0, user: $user }) {
      token {
        ...bentoTokenFields
      }
      share
    }
  }
  ${bentoTokenFieldsQuery}
`

export const kashiPairFieldsQuery = gql`
  fragment kashiPairFields on KashiPair {
    id
    # bentoBox
    type
    masterContract
    owner
    feeTo
    name
    symbol
    oracle
    asset {
      ...bentoTokenFields
    }
    collateral {
      ...bentoTokenFields
    }
    exchangeRate
    totalAssetElastic
    totalAssetBase
    totalCollateralShare
    totalBorrowElastic
    totalBorrowBase
    interestPerSecond
    utilization
    feesEarnedFraction
    totalFeesEarnedFraction
    lastAccrued
    supplyAPR
    borrowAPR
    # transactions
    # users
    block
    timestamp
  }
  ${bentoTokenFieldsQuery}
`

export const kashiPairsQuery = gql`
  query kashiPairs(
    $skip: Int = 0
    $first: Int = 1000
    $where: KashiPair_filter
    $block: Block_height
    $orderBy: KashiPair_orderBy = "utilization"
    $orderDirection: OrderDirection! = "desc"
  ) {
    kashiPairs(
      skip: $skip
      first: $first
      where: $where
      block: $block
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...kashiPairFields
    }
  }
  ${kashiPairFieldsQuery}
`

export const kashiUserPairsQuery = gql`
  query kashiUserPairs($user: String!, $skip: Int = 0, $first: Int = 1000, $block: Block_height) {
    userKashiPairs(skip: $skip, first: $first, block: $block, where: { user: $user }) {
      assetFraction
      collateralShare
      borrowPart
      pair {
        ...kashiPairFields
      }
    }
  }
  ${kashiPairFieldsQuery}
`

export const bentoBoxQuery = gql`
  query bentoBoxQuery(
    $id: String! = "0xf5bce5077908a1b7370b9ae04adc565ebd643966"
    $block: Block_height
    $where: BentoBox_filter
  ) {
    bentoBoxes(first: 1, block: $block, where: $where) {
      id
      totalUsers
      totalTokens
      totalKashiPairs
      tokens(first: 1000) {
        id
        name
        symbol
        decimals
        totalSupplyBase
        totalSupplyElastic
      }
    }
  }
`

export const bentoStrategiesQuery = gql`
  query bentoStrategies($first: Int = 1000, $firstHarvests: Int = 3, $block: Block_height, $where: Strategy_filter) {
    strategies(first: $first, block: $block, where: $where) {
      token {
        id
        decimals
        strategyTargetPercentage
        totalSupplyElastic
      }
      balance
      totalProfit
      harvests(first: $firstHarvests, orderBy: timestamp, orderDirection: desc) {
        id
        profit
        tokenElastic
        timestamp
        block
      }
      timestamp
      block
    }
  }
  ${bentoTokenFieldsQuery}
`
