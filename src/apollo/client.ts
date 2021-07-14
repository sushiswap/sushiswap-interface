import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

export const blocklytics = new ApolloClient({
    link: createHttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
    }),
    cache: new InMemoryCache()
})

export const masterchef = new ApolloClient({
    link: createHttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chef'
    }),
    cache: new InMemoryCache()
})

export const masterchefv2 = new ApolloClient({
    link: createHttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chefv2'
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        }
    }
})

export const minichefv2_matic = new ApolloClient({
    link: createHttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-minichef'
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        }
    }
})

export const client = new ApolloClient({
    link: createHttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/jiro-ono/sushiswap-v1-exchange'
    }),
    cache: new InMemoryCache()
})

export const exchange = new ApolloClient({
    link: createHttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/matthewlilley/exchange'
    }),
    cache: new InMemoryCache()
})

export const exchange_matic = new ApolloClient({
    link: createHttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange'
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        }
    }
})

export const healthClient = new ApolloClient({
    link: createHttpLink({
        uri: 'https://api.thegraph.com/index-node/graphql'
    }),
    cache: new InMemoryCache()
})

export const blockClient = new ApolloClient({
    link: createHttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
    }),
    cache: new InMemoryCache()
})

export const blockClient_matic = new ApolloClient({
    link: createHttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/matthewlilley/polygon-blocks'
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        }
    }
})
