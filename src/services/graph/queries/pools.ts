import gql from 'graphql-tag'

const subQuery = `
  totalValueLockedUSD
  twapEnabled
  swapFee
  assets {
    id
    metaData {
      name
      symbol
    }
  }
`

// Schema not finalized for: 'concentratedLiquidityPools', 'indexPools', 'hybridPools'
const allPools = ['constantProductPools']

export const getTridentPoolsQuery = gql`
  {
    ${allPools.map(
      (pool) =>
        `${pool}(orderBy:totalValueLockedUSD, orderDirection:desc) {
          ${subQuery}
         }
        `
    )}
  }
`
