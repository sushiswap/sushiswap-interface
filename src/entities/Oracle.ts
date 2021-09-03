import { CHAINLINK_ORACLE_ADDRESS, ChainId, Token } from '@sushiswap/sdk'

import { AddressZero } from '@ethersproject/constants'
import { CHAINLINK_PRICE_FEED_MAP } from '../config/oracles/chainlink'
import { defaultAbiCoder } from '@ethersproject/abi'
import { e10 } from '../functions/math'

export interface Oracle {
  address: string
  name: string
  data: string
  warning: string
  error: string
  valid: boolean
}

export abstract class AbstractOracle implements Oracle {
  address = ''
  name = 'None'
  data = ''
  warning = ''
  error = ''
  chainId = ChainId.MAINNET
  pair: any
  tokens: Token[]
  valid = false

  constructor(pair: any, chainId, tokens?: Token[]) {
    this.address = pair.oracle
    this.data = pair.oracleData
    this.pair = pair
    this.chainId = chainId
    this.tokens = tokens
  }
}

export class SushiSwapTWAP0Oracle extends AbstractOracle {
  constructor(pair, chainId: ChainId, tokens?: Token[]) {
    super(pair, chainId, tokens)
    this.name = 'SushiSwap'
  }
}

export class SushiSwapTWAP1Oracle extends AbstractOracle {
  constructor(pair, chainId: ChainId, tokens?: Token[]) {
    super(pair, chainId, tokens)
    this.name = 'SushiSwap'
  }
}

export class ChainlinkOracle extends AbstractOracle {
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
      from === this.pair.assetAddress &&
      to === this.pair.collateralAddress &&
      this.tokens[this.pair.collateralAddress] &&
      this.tokens[this.pair.assetAddress]
    ) {
      const needed =
        this.tokens[this.pair.collateralAddress].decimals + 18 - this.tokens[this.pair.assetAddress].decimals
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

function lowerEqual(value1: string, value2: string) {
  return value1.toLowerCase() === value2.toLowerCase()
}

export function getOracle(pair, chainId: ChainId = 1, tokens: any): Oracle {
  if (lowerEqual(pair.oracle, CHAINLINK_ORACLE_ADDRESS[chainId])) {
    return new ChainlinkOracle(pair, chainId, tokens)
  }
}
