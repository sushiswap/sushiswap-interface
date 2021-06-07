import gql from 'graphql-tag'

export const tokenFieldsQuery = gql`
    fragment tokenFields on Token {
        id
        # bentoBox
        name
        symbol
        decimals
        totalSupplyElastic
        totalSupplyBase
        block
        timestamp
    }
`

export const lendingPairFields = gql`
    fragment lendingPairFields on KashiPair {
        id
        # bentoBox
        type
        masterContract
        owner
        feeTo
        name
        symbol
        oracle
        asset {
            ...tokenFields
        }
        collateral {
            ...tokenFields
        }
        exchangeRate
        totalAssetElastic
        totalAssetBase
        totalCollateralShare
        totalBorrowElastic
        totalBorrowBase
        interestPerSecond
        utilization
        feesEarnedFraction
        totalFeesEarnedFraction
        lastAccrued
        supplyAPR
        borrowAPR
        # transactions
        # users
        block
        timestamp
    }
    ${tokenFieldsQuery}
`

export const lendingPairSubsetQuery = gql`
    query lendingPairSubsetQuery(
        $first: Int! = 1000
        $pairAddresses: [Bytes]!
        $orderBy: String! = "utilization"
        $orderDirection: String! = "desc"
    ) {
        kashiPairs(
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: { id_in: $pairAddresses }
        ) {
            ...lendingPairFields
        }
    }
    ${lendingPairFields}
`
