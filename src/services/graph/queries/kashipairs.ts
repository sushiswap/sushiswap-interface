import gql from 'graphql-tag'

export const kashiPairQuery = gql`
  query GetPair($id: String) {
    kashiPairs(first: 1, where: { id: $id }) {
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
      totalAssetElastic
      totalAssetBase
      supplyAPR
      totalBorrowElastic
      totalBorrowBase
      borrowAPR
      utilization
    }
    kashiPairDayDatas(first: 1000, where: { pair: $id }, orderBy: date, orderDirection: desc) {
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

export const dataKashiPairsQuery = gql`
  query GetPairs {
    bentoBoxes {
      totalTokens
      totalKashiPairs
      totalUsers
    }
    kashiPairs(first: 1000, orderBy: totalAssetElastic, orderDirection: desc) {
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

export const kashiPairsDayDataQuery = gql`
  query GetDataKashiPairsDayData($skip: Int) {
    kashiPairDayDatas(first: 1000, skip: $skip, orderBy: date, orderDirection: desc) {
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

export const kashiTokensQuery = gql`
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

export const kashiTokenQuery = gql`
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

export const kashiTokenDayDataQuery = gql`
  query GetDataKashiPairsDayData($pairIds: [String]) {
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
