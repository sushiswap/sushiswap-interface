import { ChainId } from '@sushiswap/sdk'
const THE_GRAPH = 'https://api.thegraph.com'

export const GRAPH_HOST = {
  [ChainId.MAINNET]: THE_GRAPH,
  [ChainId.XDAI]: THE_GRAPH,
  [ChainId.MATIC]: THE_GRAPH,
  [ChainId.FANTOM]: THE_GRAPH,
  [ChainId.BSC]: THE_GRAPH,
  [ChainId.AVALANCHE]: THE_GRAPH,
  [ChainId.CELO]: THE_GRAPH,
  [ChainId.HARMONY]: 'https://sushi.graph.t.hmny.io',
  [ChainId.OKEX]: 'https://graph.kkt.one/node',
}
