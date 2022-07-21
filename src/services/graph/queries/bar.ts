import gql from 'graphql-tag'

export const barQuery = gql`
  query barQuery($id: String! = "0x8798249c2e607446efb7ad49ec89dd1865ff4272", $block: Block_height) {
    bar(id: $id, block: $block) {
      id
      totalSupply
      ratio
      xSushiMinted
      xSushiBurned
      sushiStaked
      sushiStakedUSD
      sushiHarvested
      sushiHarvestedUSD
      xSushiAge
      xSushiAgeDestroyed
      # histories(first: 1000) {
      #   id
      #   date
      #   timeframe
      #   sushiStaked
      #   sushiStakedUSD
      #   sushiHarvested
      #   sushiHarvestedUSD
      #   xSushiAge
      #   xSushiAgeDestroyed
      #   xSushiMinted
      #   xSushiBurned
      #   xSushiSupply
      #   ratio
      # }
    }
  }
`

export const barHistoriesQuery = gql`
  query barHistoriesQuery {
    histories(first: 1000) {
      id
      date
      timeframe
      sushiStaked
      sushiStakedUSD
      sushiHarvested
      sushiHarvestedUSD
      xSushiAge
      xSushiAgeDestroyed
      xSushiMinted
      xSushiBurned
      xSushiSupply
      ratio
    }
  }
`

export const barUserQuery = gql`
  query barUserQuery($id: String!) {
    user(id: $id) {
      id
      bar {
        totalSupply
        sushiStaked
      }
      xSushi
      sushiStaked
      sushiStakedUSD
      sushiHarvested
      sushiHarvestedUSD
      xSushiIn
      xSushiOut
      xSushiOffset
      xSushiMinted
      xSushiBurned
      sushiIn
      sushiOut
      usdIn
      usdOut
      createdAt
      createdAtBlock
    }
  }
`

export const feesQuery = gql`
  query feesQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $where: Fee_filter
    $orderBy: Fee_orderBy! = "createdAtTimestamp"
    $orderDirection: OrderDirection! = "desc"
  ) {
    fees(first: $first, skip: $skip, where: $where, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      amount
      createdAtTimestamp
    }
  }
`

export const barXsushiQuery = gql`
  query barXsushiQuery($block: Block_height) {
    xsushi(id: "xSushi", block: $block) {
      id
      sushiHarvested
      sushiStaked
      sushiSupply
      sushiXsushiRatio
      totalFeeAmount
      transactionCount
      userCount
      xSushiBurned
      xSushiMinted
      xSushiSupply
      xSushiSushiRatio
    }
  }
`

export const barXsushiUserQuery = gql`
  query barXsushiUserQuery($id: String!, $block: Block_height) {
    user(id: $id, block: $block) {
      id
      balance
      createdAtBlock
      createdAtTimestamp
      modifiedAtBlock
      modifiedAtTimestamp
      deposits(first: 1000, orderBy: timestamp, orderBy: desc, orderDirection: desc) {
        amount
        xSushiSushiRatio
        sushiXsushiRatio
        block
        id
        timestamp
        type
      }
      withdrawals(first: 1000, orderBy: timestamp, orderBy: desc, orderDirection: desc) {
        amount
        xSushiSushiRatio
        sushiXsushiRatio
        block
        id
        timestamp
        type
      }
    }
  }
`
