import gql from 'graphql-tag'

import { bentoTokenFieldsQuery } from './bentobox'

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
    asset
    collateral
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

export const kashiPairDayDatasQuery = gql`
  query kashiPairDayDatas($first: Int = 1000, $skip: Int) {
    kashiPairDayDatas(first: 1000, skip: $skip, orderBy: "date", orderDirection: "desc") {
      id
      date
      pair {
        id
        # bentoBox
        type
        masterContract
        owner
        feeTo
        name
        symbol
        oracle
        asset
        collateral
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
      totalAssetElastic
      totalAssetBase
      totalCollateralShare
      totalBorrowElastic
      totalBorrowBase
      avgExchangeRate
      avgUtilization
      avgInterestPerSecond
    }
  }
`
