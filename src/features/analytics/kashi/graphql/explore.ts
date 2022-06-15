import { gql } from '@apollo/client'

export const getTokensQuery = gql`
  query GetTokens {
    tokens(first: 1000, orderBy: totalSupplyElastic, where: { totalSupplyElastic_gt: "0" }, orderDirection: desc) {
      id
      name
      symbol
      decimals
      totalSupplyElastic
      totalSupplyBase
      block
      timestamp
    }
  }
`

export const getKashiPairsQuery = gql`
  query GetPairs {
    kashiPairs(first: 1000) {
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
      exchangeRate
      utilization
      interestPerSecond
      totalAssetElastic
      totalAssetBase
      supplyAPR
      totalBorrowElastic
      totalBorrowBase
      borrowAPR
    }
  }
`
