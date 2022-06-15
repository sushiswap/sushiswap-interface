import { gql } from '@apollo/client'

export const BENTOBOX = gql`
  query GetBentoBoxes {
    bentoBoxes {
      totalTokens
      totalKashiPairs
      totalUsers
      block
      timestamp
    }
  }
`
