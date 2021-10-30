import { ChainId, CHAINLINK_ORACLE_ADDRESS, Token } from '@sushiswap/core-sdk'
import { ChainlinkOracle } from './ChainlinkOracle'

export interface Oracle {
  address: string
  name: string
  data: string
  warning: string
  error: string
  valid: boolean
}

export abstract class Oracle implements Oracle {
  address = ''
  name = 'None'
  data = ''
  warning = ''
  error = ''
  chainId = ChainId.ETHEREUM
  pair: any
  tokens: Token[]
  valid = false

  constructor(pair, chainId, tokens?: Token[]) {
    this.address = pair.oracle
    this.data = pair.oracleData
    this.pair = pair
    this.chainId = chainId
    this.tokens = tokens
  }
}

export function getOracle(pair, chainId: ChainId, tokens): Oracle {
  if (pair.oracle.toLowerCase() === CHAINLINK_ORACLE_ADDRESS[chainId].toLowerCase()) {
    return new ChainlinkOracle(pair, chainId, tokens)
  }
}
