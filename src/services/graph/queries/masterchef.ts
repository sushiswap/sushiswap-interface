import gql from 'graphql-tag'

export const poolsQuery = gql`
    query poolsQuery(
        $first: Int! = 1000
        $skip: Int! = 0
        $orderBy: String! = "timestamp"
        $orderDirection: String! = "desc"
    ) {
        pools(
            first: $first
            skip: $skip
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            id
            pair
            allocPoint
            lastRewardBlock
            accSushiPerShare
            balance
            userCount
            owner {
                id
                sushiPerBlock
                totalAllocPoint
            }
        }
    }
`
