import { gql } from '@apollo/client'

export const getTokensQuery = gql`
  query GetToken($id: String) {
    tokens(first: 1, where: { id: $id }) {
      id
      name
      symbol
      decimals
      totalSupplyElastic
      totalSupplyBase
      block
      timestamp
    }
    kashiPairs(first: 1000, where: { asset: $id }) {
      id
      name
      symbol
      asset {
        id
        name
        symbol
        decimals
        totalSupplyElastic
        totalSupplyBase
        block
        timestamp
      }
      collateral {
        id
        name
        symbol
        decimals
        totalSupplyElastic
        totalSupplyBase
        block
        timestamp
      }
      totalAssetElastic
      totalAssetBase
      totalCollateralShare
      totalBorrowElastic
      totalBorrowBase
      supplyAPR
      borrowAPR
    }
  }
`

export const getKashiPairsDayDataQuery = gql`
  query GetDataKashiPairsDayData($pairIds: [String], $skip: Int) {
    kashiPairDayDatas(first: 1000, where: { pair_in: $pairIds }, orderBy: date, orderDirection: desc) {
      id
      date
      pair {
        id
        name
        symbol
        asset {
          id
          name
          symbol
          decimals
        }
        collateral {
          id
          name
          symbol
          decimals
        }
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
