import gql from 'graphql-tag'

export const swapsSubscriptionQuery = gql`
  subscription swapsSubscription($where: Swap_filter) {
    swaps(first: 10, orderBy: timestamp, orderDirection: desc, where: $where) {
      amount0In
      amount0Out
      amount1In
      amount1Out
      transaction {
        id
        timestamp
      }
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
    }
  }
`
