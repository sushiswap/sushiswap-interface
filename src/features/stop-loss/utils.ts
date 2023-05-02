import { defaultAbiCoder } from '@ethersproject/abi'
import { Currency, CurrencyAmount, Price, Token } from '@sushiswap/core-sdk'
import { CHAINLINK_PRICE_FEED_MAP, ChainlinkPriceFeedEntry } from 'app/config/oracles/chainlink'
import { BigNumber } from 'ethers'

export const STOP_LIMIT_ORDER_PROFIT_SLIPPAGE = 10 // percent unit

export interface IStopPriceOracleData {
  stopPrice?: string
  oracleData: string
}

export const ZERO_ORACLE_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ZERO_ORACLE_DATA = '0x00000000000000000000000000000000000000000000000000000000000000'

interface IChainlinkAggregator {
  address: string
  entry: ChainlinkPriceFeedEntry
}

/**
 * @dev It returns Chainlink Aggregator address for input currency.
 *
 * @param currencyAddr
 * @param chainId
 * @returns Chainlink aggregator address, for [currencyAddr] / USD price feed
 */
export function getOracleFeedEntry(currencyAddr: string, chainId: number): IChainlinkAggregator | undefined {
  const NETWORK_FEED_MAPPING = CHAINLINK_PRICE_FEED_MAP[chainId] // {currency} / USD mapping

  for (const aggregatorAddr of Object.keys(NETWORK_FEED_MAPPING)) {
    if (NETWORK_FEED_MAPPING[aggregatorAddr].from === currencyAddr) {
      return {
        address: aggregatorAddr,
        entry: NETWORK_FEED_MAPPING[aggregatorAddr],
      }
    }
  }

  return undefined
}

/**
 * @dev stopPrice should be inverse value, due to smart contract issue.
 *
 * @param tokenIn
 * @param tokenOut
 * @param stopPrice
 * @returns
 */
export function prepareStopPriceOracleData(
  tokenIn: CurrencyAmount<Token>,
  tokenOut: CurrencyAmount<Token>,
  stopPrice: Price<Currency, Currency>,
  chainId: number
): IStopPriceOracleData {
  const inAggregator = getOracleFeedEntry(tokenIn.currency.address, chainId)
  const outAggregator = getOracleFeedEntry(tokenOut.currency.address, chainId)

  // if priceFeed does not exists
  if (!inAggregator || !outAggregator) {
    return {
      oracleData: ZERO_ORACLE_DATA,
    }
  }

  // make stopPrice decimals as 18
  const decimals = 36 + outAggregator.entry.decimals - inAggregator.entry.decimals - 18
  const oracleData = defaultAbiCoder.encode(
    ['address', 'address', 'uint256'], // multiply, divide, decimals
    [outAggregator.address, inAggregator.address, BigNumber.from(10).pow(decimals)]
  )

  const inverseStopPrice = Math.floor(parseFloat(stopPrice.invert().toSignificant(18)) * 1e18)
  return {
    stopPrice: inverseStopPrice.toString(),
    oracleData,
  }
}
