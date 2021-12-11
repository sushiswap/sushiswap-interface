import gql from 'graphql-tag'

export const getTridentTokenPricesQuery = gql`
  query getTridentTokenPricesQuery(
    $first: Int = 1000
    $skip: Int = 0
    $block: Block_height
    $where: TokenPrice_filter
  ) {
    tokenPrices(first: $first, skip: $skip, block: $block, where: $where) {
      derivedUSD
    }
  }
`

export const getTridentTokenPriceQuery = gql`
  query getTridentTokenPriceQuery($block: Block_height, $id: String!) {
    tokenPrice(block: $block, id: $id) {
      derivedUSD
    }
  }
`
