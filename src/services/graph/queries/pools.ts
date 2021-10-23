import gql from 'graphql-tag'

const tridentPoolsSubQuery = `
  id
  volumeUSD
  totalValueLockedUSD
  twapEnabled
  swapFee
  transactionCount
  assets {
    id
    metaData {
      name
      symbol
      decimals
    }
  }
`

// Schema not finalized for: 'concentratedLiquidityPools', 'indexPools', 'hybridPools'
const allPools = ['constantProductPools']

export const getTridentPoolsQuery = gql`
  query getTridentsPoolsQuery(
    $first: Int = 1000
    $skip: Int = 0
    $block: Block_height
    $where: ConstantProductPool_filter
  )
  {
    ${allPools.map(
      (pool) =>
        `${pool}(first: $first, skip: $skip, block: $block, where: $where, orderBy:totalValueLockedUSD, orderDirection:desc) {
          ${tridentPoolsSubQuery}
         }
        `
    )}
  }
`
