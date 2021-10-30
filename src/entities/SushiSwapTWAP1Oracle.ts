import { ChainId, Token } from '@sushiswap/core-sdk'
import { Oracle } from './Oracle'

export class SushiSwapTWAP1Oracle extends Oracle {
  constructor(pair, chainId: ChainId, tokens?: Token[]) {
    super(pair, chainId, tokens)
    this.name = 'SushiSwap'
  }
}
