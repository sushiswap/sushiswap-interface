import {
  ChainId,
  Currency,
  CurrencyAmount,
  Ether,
  SwapParameters,
  Trade,
  TradeOptions,
  TradeOptionsDeadline,
  TradeType,
} from '@sushiswap/sdk'

import { getAddress } from '@ethersproject/address'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'

export interface ArcherTrade {
  amountIn: string
  amountOut: string
  path: string[]
  to: string
  deadline: string
}

export interface ArcherTradeOptions extends TradeOptions {
  /**
   * ETH tip for miners
   */
  ethTip?: CurrencyAmount<Currency>
}

export interface ArcherSwapParameters extends Omit<SwapParameters, 'args'> {
  /**
   * The arguments to pass to the method, all hex encoded.
   */
  args: (string | string[] | ArcherTrade)[]
}

function toHex(currencyAmount: CurrencyAmount<Currency>) {
  return `0x${currencyAmount.quotient.toString(16)}`
}

function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address)
    warning(address === checksummedAddress, `${address} is not checksummed.`)
    return checksummedAddress
  } catch (error) {
    invariant(false, `${address} is not a valid address.`)
  }
}

/**
 * Represents the Archer Router, and has static methods for helping execute trades.
 */
export abstract class ArcherRouter {
  /**
   * Cannot be constructed.
   */
  /* eslint-disable @typescript-eslint/no-empty-function */
  private constructor() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapCallParameters(
    routerAddress: string,
    trade: Trade<Currency, Currency, TradeType>,
    options: ArcherTradeOptions
  ): ArcherSwapParameters {
    const etherIn = trade.inputAmount.currency === Ether.onChain(ChainId.MAINNET)
    const etherOut = trade.outputAmount.currency === Ether.onChain(ChainId.MAINNET)
    // the router does not support both ether in and out
    invariant(!(etherIn && etherOut), 'ETHER_IN_OUT')
    invariant(!('ttl' in options) || options.ttl > 0, 'TTL')
    invariant('ethTip' in options && options.ethTip?.currency === Ether.onChain(ChainId.MAINNET))

    const to: string = validateAndParseAddress(options.recipient)
    const amountInCurrency = trade.maximumAmountIn(options.allowedSlippage)
    const amountIn: string = toHex(amountInCurrency)
    const amountOutCurrency = trade.minimumAmountOut(options.allowedSlippage)
    const amountOut: string = toHex(amountOutCurrency)
    const path: string[] = trade.route.path.map((token) => token.address)
    const deadline = `0x${(Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16)}`

    const ethTip = toHex(options.ethTip)

    const archerTrade: ArcherTrade = {
      amountIn,
      amountOut,
      path,
      to,
      deadline,
    }

    let methodName: string
    let args: (string | string[] | ArcherTrade)[]
    let value: string

    switch (trade.tradeType) {
      case TradeType.EXACT_INPUT:
        if (etherIn) {
          methodName = 'swapExactETHForTokensWithTipAmount'
          args = [routerAddress, archerTrade, ethTip]
          value = toHex(amountInCurrency.add(options.ethTip))
        } else if (etherOut) {
          methodName = 'swapExactTokensForETHAndTipAmount'
          args = [routerAddress, archerTrade]
          value = ethTip
        } else {
          methodName = 'swapExactTokensForTokensWithTipAmount'
          args = [routerAddress, archerTrade]
          value = ethTip
        }
        break
      case TradeType.EXACT_OUTPUT:
        if (etherIn) {
          methodName = 'swapETHForExactTokensWithTipAmount'
          args = [routerAddress, archerTrade, ethTip]
          value = toHex(amountInCurrency.add(options.ethTip))
        } else if (etherOut) {
          methodName = 'swapTokensForExactETHAndTipAmount'
          args = [routerAddress, archerTrade]
          value = ethTip
        } else {
          methodName = 'swapTokensForExactTokensWithTipAmount'
          args = [routerAddress, archerTrade]
          value = ethTip
        }
        break
    }

    return {
      methodName,
      args,
      value,
    }
  }
}
