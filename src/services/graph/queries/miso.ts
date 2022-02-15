import gql from 'graphql-tag'

/* Needs support for transaction hash */
export const misoCommitmentsQuery = gql`
  query misoCommitmentsQuery($auctionId: String!) {
    commitments(where: { auction: $auctionId }) {
      id
      user {
        id
      }
      amount
      block
    }
  }
`
