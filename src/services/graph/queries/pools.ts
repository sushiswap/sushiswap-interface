import gql from 'graphql-tag'

const subQuery = `
  totalValueLockedUSD
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
