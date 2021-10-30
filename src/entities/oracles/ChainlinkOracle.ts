import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { ChainId, Token } from '@sushiswap/core-sdk'
import { CHAINLINK_PRICE_FEED_MAP } from 'config/oracles/chainlink'
import { e10 } from 'functions/math'

import { Oracle } from './Oracle'

export class ChainlinkOracle extends Oracle {
  constructor(pair, chainId: ChainId, tokens?: Token[]) {
    super(pair, chainId, tokens)
    this.name = 'Chainlink'
    this.valid = this.validate()
  }
  private validate() {
    const mapping = CHAINLINK_PRICE_FEED_MAP[this.chainId]
    if (!mapping) {
      return false
    }
    const params = defaultAbiCoder.decode(['address', 'address', 'uint256'], this.data)
    let decimals = 54
    let from = ''
    let to = ''
    if (params[0] !== AddressZero) {
      if (!mapping![params[0]]) {
        this.error = 'One of the Chainlink oracles used is not configured in this UI.'
        return false
      } else {
        decimals -= 18 - mapping![params[0]].decimals
        from = mapping![params[0]].from
        to = mapping![params[0]].to
      }
    }
    if (params[1] !== AddressZero) {
      if (!mapping![params[1]]) {
        this.error = 'One of the Chainlink oracles used is not configured in this UI.'
        return false
      } else {
        decimals -= mapping![params[1]].decimals
        if (!to) {
          from = mapping![params[1]].to
          to = mapping![params[1]].from
        } else if (to === mapping![params[1]].to) {
          to = mapping![params[1]].from
        } else {
          this.error =
            "The Chainlink oracles used don't match up with eachother. If 2 oracles are used, they should have a common token, such as WBTC/ETH and LINK/ETH, where ETH is the common link."
          return false
        }
      }
    }

    if (
      from === this.pair.asset.address &&
      to === this.pair.collateral.address &&
      this.tokens[this.pair.collateral.address] &&
      this.tokens[this.pair.asset.address]
    ) {
      const needed =
        this.tokens[this.pair.collateral.address].decimals + 18 - this.tokens[this.pair.asset.address].decimals
      const divider = e10(decimals - needed)
      if (!divider.eq(params[2])) {
        this.error =
          'The divider parameter is misconfigured for this oracle, which leads to rates that are order(s) of magnitude wrong.'
        return false
      } else {
        return true
      }
    } else {
      this.error = "The Chainlink oracles configured don't match the pair tokens."
      return false
    }
  }
}
