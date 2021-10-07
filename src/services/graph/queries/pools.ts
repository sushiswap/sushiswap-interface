import gql from 'graphql-tag'

const subQuery = `
  totalValueLocked
  assets {
    id
    symbol
  }
`

const allPools = ['constantProductPools', 'concentratedLiquidityPools', 'indexPools', 'hybridPools']

export const getTridentPoolsQuery = gql`
  {
    ${allPools.map(
      (pool) =>
        `${pool} { 
          ${subQuery}
         }
        `
    )}
  }
`
