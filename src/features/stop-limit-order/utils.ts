import { CurrencyAmount, Token, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import { BigNumber } from 'ethers'

export const STOP_LIMIT_ORDER_PROFIT_SLIPPAGE = 2 // percent unit

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
