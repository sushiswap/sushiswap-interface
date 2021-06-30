import gql from 'graphql-tag'

export const poolsV2Query = gql`
  query poolsV2Query(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      pair
      allocPoint
      slpBalance
      rewarder
      masterChef {
        totalAllocPoint
      }
    }
  }
`

export const masterChefV2PairAddressesQuery = gql`
  query masterChefV2PairAddresses(
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
