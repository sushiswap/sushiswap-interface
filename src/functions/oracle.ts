import { defaultAbiCoder } from '@ethersproject/abi'
import { e10 } from './math'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/sdk'
import { CHAINLINK_MAPPING } from '../constants/chainlink/mappings'

export function validateChainlinkOracleData(chainId = ChainId.MAINNET, collateral, asset, data) {
  const mapping = CHAINLINK_MAPPING[chainId]
  if (!mapping) {
    return false
  }
  const params = defaultAbiCoder.decode(['address', 'address', 'uint256'], data)
  let decimals = 54
  let from = ''
  let to = ''
  if (params[0] !== AddressZero) {
    if (!mapping![params[0]]) {
      // 'One of the Chainlink oracles used is not configured in this UI.'
      console.log('One of the Chainlink oracles used is not configured in this UI.')
      return false
    } else {
      decimals -= 18 - mapping![params[0]].decimals
      from = mapping![params[0]].from
      to = mapping![params[0]].to
    }
  }
  if (params[1] !== AddressZero) {
    if (!mapping![params[1]]) {
      // 'One of the Chainlink oracles used is not configured in this UI.'
      return false
    } else {
      decimals -= mapping![params[1]].decimals
      if (!to) {
        from = mapping![params[1]].to
        to = mapping![params[1]].from
      } else if (to === mapping![params[1]].to) {
        to = mapping![params[1]].from
      } else {
        // "The Chainlink oracles used don't match up with eachother. If 2 oracles are used, they should have a common token, such as WBTC/ETH and LINK/ETH, where ETH is the common link."
        console.log(
          "The Chainlink oracles used don't match up with eachother. If 2 oracles are used, they should have a common token, such as WBTC/ETH and LINK/ETH, where ETH is the common link."
        )
        return false
      }
    }
  }

  if (from === asset.address && to === collateral.address) {
    const needed = collateral.decimals + 18 - asset.decimals
    const divider = e10(decimals - needed)
    if (!divider.eq(params[2])) {
      // 'The divider parameter is misconfigured for this oracle, which leads to rates that are order(s) of magnitude wrong.'
      console.log(
        'The divider parameter is misconfigured for this oracle, which leads to rates that are order(s) of magnitude wrong.'
      )
      return false
    } else {
      return true
    }
  } else {
    // "The Chainlink oracles configured don't match the pair tokens."
    console.log("The Chainlink oracles configured don't match the pair tokens.")
    return false
  }
}
