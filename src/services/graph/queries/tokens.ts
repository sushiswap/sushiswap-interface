import gql from 'graphql-tag'

export const getTridentTokenPricesQuery = gql`
  query getTridentTokenPricesQuery(
    $first: Int = 1000
    $skip: Int = 0
    $block: Block_height
    $where: TokenPrice_filter
  ) {
    tokenPrices(first: $first, skip: $skip, block: $block, where: $where) {
      lastUsdPrice
    }
  }
`

export const getTridentTokenPriceQuery = gql`
  query getTridentTokenPriceQuery($block: Block_height, $id: String!) {
    tokenPrice(block: $block, id: $id) {
      derivedNative
      lastUsdPrice
    }
  }
`

export const getTridentTokensQuery = gql`
  query getTridentTokensQuery($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: Token_filter) {
    tokens(first: $first, skip: $skip, block: $block, where: $where) {
      id
      price {
        derivedNative
        lastUsdPrice
      }
      kpi {
        liquidity
        # liquidityNative
        liquidityUSD
        # volume
        # volumeNative
        volumeUSD
        # fees
        # feesNative
        # feesUSD
        #transactionCount
      }
      rebase {
        base
        elastic
      }
      symbol
      name
      decimals
    }
  }
`
