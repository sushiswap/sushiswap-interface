import gql from 'graphql-tag'

export const miniChefPoolsQuery = gql`
  query miniChefPoolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      pair
      rewarder {
        id
        rewardToken
        rewardPerSecond
      }
      allocPoint
      lastRewardTime
      accSushiPerShare
      slpBalance
      userCount
      miniChef {
        id
        sushiPerSecond
        totalAllocPoint
      }
    }
  }
`

export const miniChefPairAddressesQuery = gql`
  query miniChefPairAddresses(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      pair {
        id
      }
    }
  }
`
