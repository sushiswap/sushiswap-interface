import gql from 'graphql-tag'

export const getTridentTokenPricesQuery = gql`
  query getTridentTokenPricesQuery(
    $first: Int = 1000
    $skip: Int = 0
    $block: Block_height
    $where: TokenPrice_filter
  ) {
    tokenPrices(first: $first, skip: $skip, block: $block, where: $where) {
      derivedUSD
    }
  }
`

export const getTridentTokenPriceQuery = gql`
  query getTridentTokenPriceQuery($block: Block_height, $id: String!) {
    tokenPrice(block: $block, id: $id) {
      derivedUSD
    }
  }
`

export const getTridentTokensQuery = gql`
  query getTridentTokensQuery($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: Token_filter) {
    tokens(first: $first, skip: $skip, block: $block, where: $where) {
      id
      price {
        derivedNative
        derivedUSD
      }
      kpi {
        liquidity
        liquidityNative
        liquidityUSD
        volume
        volumeNative
        volumeUSD
        fees
        feesNative
        feesUSD
        transactionCount
      }
      rebase {
        base
        elastic
      }
      symbol
      name
      decimals
    }
  }
`

export const getTridentTokenHourSnapshotsQuery = gql`
  query tokenHourSnapshots($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: TokenDaySnapshot_filter) {
    tokenHourSnapshots(first: $first, skip: $skip, block: $block, where: $where, orderBy: date, orderDirection: desc) {
      id
      date
      liquidityUSD
      volumeUSD
      feesUSD
      priceUSD
      transactionCount
    }
  }
`

export const getTridentTokenDaySnapshotsQuery = gql`
  query tokenDaySnapshots($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: TokenDaySnapshot_filter) {
    tokenDaySnapshots(first: $first, skip: $skip, block: $block, where: $where, orderBy: date, orderDirection: desc) {
      id
      date
      liquidityUSD
      volumeUSD
      feesUSD
      priceUSD
      transactionCount
    }
  }
`

export const getTridentTokenKpiQuery = gql`
  query tridentTokenKpiQuery($id: String!, $block: Block_height, $where: PoolKpi_filter) {
    poolKpi(id: $id, block: $block, where: $where) {
      id
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

export const getTridentTokenKpisQuery = gql`
  query tokenKpisQuery($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: PoolKpi_filter) {
    tokenKpis(first: $first, skip: $skip, block: $block, where: $where) {
      id
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
