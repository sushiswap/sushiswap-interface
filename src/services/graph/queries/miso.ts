import gql from 'graphql-tag'

export const misoCommitmentsQuery = gql`
  query misoCommitmentsQuery($auctionId: String!) {
    commitments(where: { auction: $auctionId }) {
      id
      user {
        id
      }
      amount
      block
      transactionHash
    }
  }
`
