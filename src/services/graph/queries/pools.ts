import gql from 'graphql-tag'

const subQuery = `
  totalValueLockedUSD
  twapEnabled
  swapFee
  assets {
    id
    symbol
    name
  }
`

const allPools = ['constantProductPools', 'concentratedLiquidityPools', 'indexPools', 'hybridPools']

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
