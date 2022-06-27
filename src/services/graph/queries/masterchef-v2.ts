import gql from 'graphql-tag'

export const poolsV2Query = gql`
  query poolsV2Query(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      pair
      allocPoint
      slpBalance
      masterChef {
        id
        totalAllocPoint
      }
      rewarder {
        id
        rewardToken
        rewardPerSecond
      }
    }
  }
`

export const masterChefV2PairAddressesQuery = gql`
  query masterChefV2PairAddresses(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      allocPoint
      accSushiPerShare
      pair {
        id
      }
    }
  }
`
