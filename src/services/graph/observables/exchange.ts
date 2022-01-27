import gql from 'graphql-tag'

export const swapsSubscriptionQuery = gql`
  subscription swapsSubscription($where: Swap_filter) {
    swaps(first: 1, orderBy: timestamp, orderDirection: desc, where: $where) {
      id
      amountUSD
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

export const barsSubscriptionQuery = gql`
  subscription barsSubscription($where: Candle_filter) {
    candles(first: 1, orderBy: time, orderDirection: desc, where: $where) {
      time
      open
      close
      low
      high
      token1TotalAmount
    }
  }
`
