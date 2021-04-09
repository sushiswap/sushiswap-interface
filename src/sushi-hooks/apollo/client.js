import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

export const blocklytics = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const masterchef = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chef'
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const client = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/jiro-ono/sushiswap-v1-exchange'
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const exchange = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/matthewlilley/exchange'
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const healthClient = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/index-node/graphql'
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const blockClient = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
  }),
  cache: new InMemoryCache()
})
