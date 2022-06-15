import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { ReactNode } from 'react'

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/bentobox',
  cache: new InMemoryCache(),
})

export const AnalyticsKashiApolloContextProvider = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
