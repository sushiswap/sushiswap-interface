import gql from 'graphql-tag'

export const barsQuery = gql`
  query barsQuery($first: Int = 1000, $skip: Int, $block: Block_height, $where: Candle_filter) {
    candles(first: $first, skip: $skip, orderBy: time, orderDirection: asc, where: $where, block: $block) {
      time
      open
      close
      low
      high
      token1TotalAmount
    }
  }
`
