import gql from 'graphql-tag'

export const candlesQuery = gql`
  query candles(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "time"
    $orderDirection: String! = "desc"
    $where: Candle_filter
  ) {
    candles(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      token0
      token1
      low
      high
      close
      open
    }
  }
`
