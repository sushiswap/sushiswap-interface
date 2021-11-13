import { ChainId, Token } from '@sushiswap/core-sdk'

export abstract class Oracle {
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
