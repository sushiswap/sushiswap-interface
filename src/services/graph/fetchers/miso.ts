import { ChainId } from '@sushiswap/core-sdk'
import { pager } from 'app/services/graph'
import { misoCommitmentsQuery } from 'app/services/graph/queries/miso'

import { GRAPH_HOST } from '../constants'

export const MISO = {
  [ChainId.KOVAN]: 'sushiswap/kovan-miso',
  [ChainId.HARMONY]: 'sushiswap/miso',
}

// @ts-ignore TYPE NEEDS FIXING
export const miso = async (chainId = ChainId.ETHEREUM, query, variables = {}) =>
  // @ts-ignore TYPE NEEDS FIXING
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${MISO[chainId]}`, query, variables)

// @ts-ignore TYPE NEEDS FIXING
export const getMisoCommitments = async (chainId, variables) => {
  return miso(chainId, misoCommitmentsQuery, variables)
}
