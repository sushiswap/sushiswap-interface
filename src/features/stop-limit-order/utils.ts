import { defaultAbiCoder } from '@ethersproject/abi'
import { Currency, CurrencyAmount, Price, Token, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import { CHAINLINK_PRICE_FEED_MAP, ChainlinkPriceFeedEntry } from 'app/config/oracles/chainlink'
import { BigNumber } from 'ethers'

export const STOP_LIMIT_ORDER_PROFIT_SLIPPAGE = 20 // percent unit

export function keepTokenIn(tokenIn: string, tokenOut: string, chainId: number): boolean {
  return tokenIn === WNATIVE_ADDRESS[chainId] ? true : false
}

export interface IStopLimitOrderReceiverParam {
  isValidPair: boolean
  keepTokenIn?: boolean
  amountExternal: BigNumber
}

/// @dev now it provides stopLimitOrder for pairs only, coupled with WETH
export function calculateAmountExternal(
  tokenIn: CurrencyAmount<Token>,
  tokenOut: CurrencyAmount<Token>,
  chainId: number
): IStopLimitOrderReceiverParam {
  const WNATIVE_ADDR = WNATIVE_ADDRESS[chainId]
  if (WNATIVE_ADDR !== tokenIn.currency.address && WNATIVE_ADDR !== tokenOut.currency.address) {
    return {
      isValidPair: false,
      amountExternal: BigNumber.from(0),
    }
  }

  const keepTokenIn = tokenIn.currency.address === WNATIVE_ADDR ? true : false
  const amountExternal = keepTokenIn
    ? BigNumber.from(tokenIn.quotient.toString())
        .mul(100 - STOP_LIMIT_ORDER_PROFIT_SLIPPAGE)
        .div(100)
    : BigNumber.from(tokenOut.quotient.toString())
        .mul(100 + STOP_LIMIT_ORDER_PROFIT_SLIPPAGE)
        .div(100)

  return {
    isValidPair: true,
    keepTokenIn,
    amountExternal,
  }
}

export interface IStopPriceOracleData {
  stopPrice: string
  oracleData: string
}

export const ZERO_ORACLE_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ZERO_ORACLE_DATA = '0x00000000000000000000000000000000000000000000000000000000000000'

interface IChainlinkAggregator {
  address: string
  entry: ChainlinkPriceFeedEntry
}

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
      stopPrice: '',
      oracleData: ZERO_ORACLE_ADDRESS,
    }
  }

  // make stopPrice decimals as 18
  const decimals = 36 + outAggregator.entry.decimals - inAggregator.entry.decimals - 18
  const oracleData = defaultAbiCoder.encode(
    ['address', 'address', 'uint256'], // multiply, divide, decimals
    [outAggregator.address, inAggregator.address, BigNumber.from(10).pow(decimals)]
  )

  const inverseStopPrice = parseFloat(stopPrice.invert().toSignificant(18)) * 1e18
  return {
    stopPrice: inverseStopPrice.toString(),
    oracleData,
  }
}
