import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { i18n } from '@lingui/core'
import { ChainId } from '@sushiswap/core-sdk'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

const ethClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/bentobox',
  cache: new InMemoryCache(),
})

const arbitrumClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-bentobox',
  cache: new InMemoryCache(),
})

const fantomClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/fantom-bentobox',
  cache: new InMemoryCache(),
})

const bscClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-bentobox',
  cache: new InMemoryCache(),
})

const CLIENTS = {
  [ChainId.ETHEREUM]: ethClient,
  [ChainId.ARBITRUM]: arbitrumClient,
  [ChainId.FANTOM]: fantomClient,
  [ChainId.BSC]: bscClient,
}

export const AnalyticsKashiApolloContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const chainId = Number(router.query.chainId) as ChainId
  const client = CLIENTS[chainId]

  if (!client) {
    return <div>{i18n._('Kashi subgraph does not exist')}</div>
  }
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
