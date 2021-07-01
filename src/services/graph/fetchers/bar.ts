import { ChainId } from '@sushiswap/sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'

const BAR = {
  [ChainId.MAINNET]: 'matthewlilley/bar',
}

export const bar = async (query, chainId = ChainId.MAINNET) =>
  request(`https://api.thegraph.com/subgraphs/name/${BAR[chainId]}`, query)
