import { ChainId,CHAINLINK_ORACLE_ADDRESS } from '@sushiswap/core-sdk'
import { ChainlinkOracle } from 'entities/oracles'
import { IOracle } from 'interfaces'

export function getOracle(pair, chainId: ChainId, tokens): IOracle {
  if (pair.oracle.toLowerCase() === CHAINLINK_ORACLE_ADDRESS[chainId].toLowerCase()) {
    return new ChainlinkOracle(pair, chainId, tokens)
  }
}
