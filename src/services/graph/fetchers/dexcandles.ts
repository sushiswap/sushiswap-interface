import { ChainId } from '@sushiswap/core-sdk'
import { pager } from 'app/services/graph'
import { GRAPH_HOST } from 'app/services/graph/constants'
import { barsQuery } from 'app/services/graph/queries/dexcandles'

export const DEXCANDLES = {
  [ChainId.ETHEREUM]: 'agxmbhir/sushiswap-dexcandles',
  [ChainId.XDAI]: 'sushiswap/xdai-exchange',
  [ChainId.MATIC]: 'sushiswap/matic-exchange',
  [ChainId.FANTOM]: 'sushiswap/fantom-exchange',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  [ChainId.HARMONY]: 'sushiswap/harmony-exchange',
  [ChainId.AVALANCHE]: 'agxmbhir/sushiswap-dexcandles',
  [ChainId.CELO]: 'jiro-ono/sushitestsubgraph',
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-exchange',
  [ChainId.MOONRIVER]: 'sushiswap/moonriver-exchange',
  [ChainId.OKEX]: 'okex-exchange/oec',
  [ChainId.HECO]: 'heco-exchange/heco',
  [ChainId.FUSE]: 'sushiswap/fuse-exchange',
}

// @ts-ignore TYPE NEEDS FIXING
export const dexcandles = async (chainId = ChainId.ETHEREUM, query, variables = {}) =>
  // @ts-ignore TYPE NEEDS FIXING
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${DEXCANDLES[chainId]}`, query, variables)

export const getDexCandles = async (chainId = ChainId.ETHEREUM, variables = {}) => {
  const { candles } = await dexcandles(chainId, barsQuery, variables)
  return candles
}
