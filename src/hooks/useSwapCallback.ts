import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import {
  ChainId,
  Currency,
  Percent,
  Router as LegacyRouter,
  SwapParameters,
  Trade as LegacyTrade,
  TradeType,
} from '@sushiswap/core-sdk'
import { getBigNumber,MultiRoute } from '@sushiswap/tines'
import {
  ComplexPathParams,
  ExactInputParams,
  ExactInputSingleParams,
  InitialPath,
  Output,
  Path,
  PercentagePath,
  RouteType,
  Trade as TridentTrade,
} from '@sushiswap/trident-sdk'
import approveAmountCalldata from 'functions/approveAmountCalldata'
import { shortenAddress } from 'functions/format'
import { calculateGasMargin } from 'functions/trade'
import { isAddress, isZero } from 'functions/validate'
import { useMemo } from 'react'
import { useBlockNumber } from 'state/application/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'

import { EIP_1559_ACTIVATION_BLOCK } from '../constants'
import { useActiveWeb3React } from '../services/web3/hooks/useActiveWeb3React'
import { useArgentWalletContract } from './useArgentWalletContract'
import { useRouterContract } from './useContract'
import { useTridentRouterContract } from './useContract'
import useENS from './useENS'
import { SignatureData } from './useERC20Permit'
import useTransactionDeadline from './useTransactionDeadline'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  address: string
  calldata: string
  value: string
}

interface SwapCallEstimate {
  call: SwapCall
}

export interface SuccessfulCall extends SwapCallEstimate {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall extends SwapCallEstimate {
  call: SwapCall
  error: Error
}

interface TridentTradeContext {
  fromWallet: boolean
  receiveToWallet: boolean
}

export type EstimatedSwapCall = SuccessfulCall | FailedCall

export function getTridentRouterParams(
  multiRoute: MultiRoute,
  senderAddress: string,
  tridentRouterAddress: string = '',
  slippagePercentage: number = 0.5,
  tridentTradeContext?: TridentTradeContext
): ExactInputParams | ExactInputSingleParams | ComplexPathParams {
  const routeType = getRouteType(multiRoute)
  let routerParams

  const slippage = 1 - slippagePercentage / 100

  switch (routeType) {
    case RouteType.SinglePool:
      routerParams = getExactInputSingleParams(multiRoute, senderAddress, slippage, tridentTradeContext)
      break

    case RouteType.SinglePath:
      routerParams = getExactInputParams(multiRoute, senderAddress, slippage, tridentTradeContext)
      break

    case RouteType.ComplexPath:
    default:
      routerParams = getComplexPathParams(
        multiRoute,
        senderAddress,
        tridentRouterAddress,
        slippage,
        tridentTradeContext
      )
      break
  }

  return routerParams
}

function getExactInputSingleParams(
  multiRoute: MultiRoute,
  senderAddress: string,
  slippage: number,
  tridentTradeContext?: TridentTradeContext
): ExactInputSingleParams {
  return {
    amountIn: getBigNumber(multiRoute.amountIn * multiRoute.legs[0].absolutePortion),
    amountOutMinimum: getBigNumber(multiRoute.amountOut * slippage),
    tokenIn: multiRoute.legs[0].tokenFrom.address,
    pool: multiRoute.legs[0].poolAddress,
    data: defaultAbiCoder.encode(
      ['address', 'address', 'bool'],
      [multiRoute.legs[0].tokenFrom.address, senderAddress, tridentTradeContext?.receiveToWallet || true]
    ),
    routeType: RouteType.SinglePool,
  }
}

function getExactInputParams(
  multiRoute: MultiRoute,
  senderAddress: string,
  slippage: number,
  tridentTradeContext?: TridentTradeContext
): ExactInputParams {
  const routeLegs = multiRoute.legs.length
  let paths: Path[] = []

  for (let legIndex = 0; legIndex < routeLegs; ++legIndex) {
    const recipentAddress = isLastLeg(legIndex, multiRoute) ? senderAddress : multiRoute.legs[legIndex + 1].poolAddress

    if (multiRoute.legs[legIndex].tokenFrom.address === multiRoute.fromToken.address) {
      const path: Path = {
        pool: multiRoute.legs[legIndex].poolAddress,
        data: defaultAbiCoder.encode(
          ['address', 'address', 'bool'],
          [multiRoute.legs[legIndex].tokenFrom.address, recipentAddress, tridentTradeContext?.receiveToWallet || true]
        ),
      }
      paths.push(path)
    } else {
      const path: Path = {
        pool: multiRoute.legs[legIndex].poolAddress,
        data: defaultAbiCoder.encode(
          ['address', 'address', 'bool'],
          [multiRoute.legs[legIndex].tokenFrom.address, recipentAddress, tridentTradeContext.receiveToWallet]
        ),
      }
      paths.push(path)
    }
  }

  let inputParams: ExactInputParams = {
    tokenIn: multiRoute.legs[0].tokenFrom.address,
    amountIn: getBigNumber(multiRoute.amountIn),
    amountOutMinimum: getBigNumber(multiRoute.amountOut * slippage),
    path: paths,
    routeType: RouteType.SinglePath,
  }

  return inputParams
}

function getComplexPathParams(
  multiRoute: MultiRoute,
  senderAddress: string,
  tridentRouterAddress: string,
  slippage: number,
  tridentTradeContext?: TridentTradeContext
): ComplexPathParams {
  let initialPaths: InitialPath[] = []
  let percentagePaths: PercentagePath[] = []
  let outputs: Output[] = []

  const routeLegs = multiRoute.legs.length
  const initialPathCount = multiRoute.legs.filter(
    (leg) => leg.tokenFrom.address === multiRoute.fromToken.address
  ).length

  const output: Output = {
    token: multiRoute.toToken.address,
    to: senderAddress,
    unwrapBento: false,
    minAmount: getBigNumber(multiRoute.amountOut * slippage),
  }
  outputs.push(output)

  for (let legIndex = 0; legIndex < routeLegs; ++legIndex) {
    if (multiRoute.legs[legIndex].tokenFrom.address === multiRoute.fromToken.address) {
      const initialPath: InitialPath = {
        tokenIn: multiRoute.legs[legIndex].tokenFrom.address,
        pool: multiRoute.legs[legIndex].poolAddress,
        amount: getInitialPathAmount(legIndex, multiRoute, initialPaths, initialPathCount),
        native: false,
        data: defaultAbiCoder.encode(
          ['address', 'address', 'bool'],
          [
            multiRoute.legs[legIndex].tokenFrom.address,
            tridentRouterAddress,
            tridentTradeContext?.receiveToWallet || true,
          ]
        ),
      }
      initialPaths.push(initialPath)
    } else {
      const percentagePath: PercentagePath = {
        tokenIn: multiRoute.legs[legIndex].tokenFrom.address,
        pool: multiRoute.legs[legIndex].poolAddress,
        balancePercentage: getBigNumber(multiRoute.legs[legIndex].swapPortion * 10 ** 8),
        data: defaultAbiCoder.encode(
          ['address', 'address', 'bool'],
          [
            multiRoute.legs[legIndex].tokenFrom.address,
            tridentRouterAddress,
            tridentTradeContext?.receiveToWallet || true,
          ]
        ),
      }
      percentagePaths.push(percentagePath)
    }
  }

  const complexParams: ComplexPathParams = {
    initialPath: initialPaths,
    percentagePath: percentagePaths,
    output: outputs,
    routeType: RouteType.ComplexPath,
  }

  return complexParams
}

function isLastLeg(legIndex: number, multiRoute: MultiRoute): boolean {
  return legIndex === multiRoute.legs.length - 1
}

function getRouteType(multiRoute: MultiRoute): RouteType {
  if (multiRoute.legs.length === 1) {
    return RouteType.SinglePool
  }

  const routeInputTokens = multiRoute.legs.map((leg) => leg.tokenFrom.address)

  if (new Set(routeInputTokens).size === routeInputTokens.length) {
    return RouteType.SinglePath
  }

  if (new Set(routeInputTokens).size !== routeInputTokens.length) {
    return RouteType.ComplexPath
  }

  return RouteType.Unknown
}

function getInitialPathAmount(
  legIndex: number,
  multiRoute: MultiRoute,
  initialPaths: InitialPath[],
  initialPathCount: number
): BigNumber {
  if (initialPathCount > 1 && legIndex === initialPathCount - 1) {
    const sumIntialPathAmounts = initialPaths.map((p) => p.amount).reduce((a, b) => a.add(b))
    return getBigNumber(multiRoute.amountIn).sub(sumIntialPathAmounts)
  } else {
    return getBigNumber(multiRoute.amountIn * multiRoute.legs[legIndex].absolutePortion)
  }
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName the ENS name or address of the recipient of the swap output
 * @param signatureData the signature data of the permit of the input token amount, if available
 * @param tridentTradeContext context for a trident trade that contains boolean flags on whether to spend from wallet and/or receive to wallet
 */
export function useSwapCallArguments(
  trade: LegacyTrade<Currency, Currency, TradeType> | TridentTrade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | null | undefined,
  tridentTradeContext?: TridentTradeContext
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()

  const legacyRouterContract = useRouterContract()

  const tridentRouterContract = useTridentRouterContract()

  const argentWalletContract = useArgentWalletContract()

  return useMemo<SwapCall[]>(() => {
    let result: SwapCall[] = []
    if (!trade || !recipient || !library || !account || !chainId) return result

    if (trade instanceof LegacyTrade) {
      if (!legacyRouterContract || !deadline) return result

      const swapMethods: SwapParameters[] = []
      swapMethods.push(
        LegacyRouter.swapCallParameters(trade, {
          feeOnTransfer: false,
          allowedSlippage,
          recipient,
          deadline: deadline.toNumber(),
        })
      )

      if (trade.tradeType === TradeType.EXACT_INPUT) {
        swapMethods.push(
          LegacyRouter.swapCallParameters(trade, {
            feeOnTransfer: true,
            allowedSlippage,
            recipient,
            deadline: deadline.toNumber(),
          })
        )
      }

      result = swapMethods.map(({ methodName, args, value }) => {
        if (argentWalletContract && trade.inputAmount.currency.isToken) {
          return {
            address: argentWalletContract.address,
            calldata: argentWalletContract.interface.encodeFunctionData('wc_multiCall', [
              [
                approveAmountCalldata(trade.maximumAmountIn(allowedSlippage), legacyRouterContract.address),
                {
                  to: legacyRouterContract.address,
                  value: value,
                  data: legacyRouterContract.interface.encodeFunctionData(methodName, args),
                },
              ],
            ]),
            value: '0x0',
          }
        } else {
          return {
            address: legacyRouterContract.address,
            calldata: legacyRouterContract.interface.encodeFunctionData(methodName, args),
            value,
          }
        }
      })

      return result
    } else if (trade instanceof TridentTrade) {
      if (!tridentRouterContract || !trade.route) return result

      const { routeType, ...rest } = getTridentRouterParams(
        trade.route,
        account,
        tridentRouterContract?.address,
        Number(allowedSlippage.asFraction.toSignificant(1)),
        tridentTradeContext
      )

      const method = {
        [RouteType.SinglePool]: tridentTradeContext?.fromWallet
          ? 'exactInputSingle'
          : 'exactInputSingleWithNativeToken',
        [RouteType.SinglePath]: tridentTradeContext?.fromWallet ? 'exactInput' : 'exactInputWithNativeToken',
        [RouteType.ComplexPath]: 'complexPath',
      }

      result = [
        {
          address: tridentRouterContract.address,
          calldata: tridentRouterContract.interface.encodeFunctionData(method[routeType], [rest]),
          value: trade.inputAmount.currency.isNative ? trade.inputAmount.quotient.toString() : '0x0',
        },
      ] as SwapCall[]

      return result
    }

    return result
  }, [
    account,
    allowedSlippage,
    argentWalletContract,
    chainId,
    deadline,
    legacyRouterContract,
    library,
    recipient,
    trade,
    tridentRouterContract,
    tridentTradeContext,
  ])
}

/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 */
export function swapErrorToUserReadableMessage(error: any): string {
  let reason: string | undefined

  while (Boolean(error)) {
    reason = error.reason ?? error.message ?? reason
    error = error.error ?? error.data?.originalError
  }

  if (reason?.indexOf('execution reverted: ') === 0) reason = reason.substr('execution reverted: '.length)

  switch (reason) {
    case 'UniswapV2Router: EXPIRED':
      return t`The transaction could not be sent because the deadline has passed. Please check that your transaction deadline is not too low.`
    case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
    case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
      return t`This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.`
    case 'TransferHelper: TRANSFER_FROM_FAILED':
      return t`The input token cannot be transferred. There may be an issue with the input token.`
    case 'UniswapV2: TRANSFER_FAILED':
      return t`The output token cannot be transferred. There may be an issue with the output token.`
    case 'UniswapV2: K':
      return t`The Uniswap invariant x*y=k was not satisfied by the swap. This usually means one of the tokens you are swapping incorporates custom behavior on transfer.`
    case 'Too little received':
    case 'Too much requested':
    case 'STF':
      return t`This transaction will not succeed due to price movement. Try increasing your slippage tolerance.`
    case 'TF':
      return t`The output token cannot be transferred. There may be an issue with the output token.`
    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        console.error(error, reason)
        return t`An error occurred when trying to execute this swap. You may need to increase your slippage tolerance. If that does not work, there may be an incompatibility with the token you are trading. Note fee on transfer and rebase tokens are incompatible with Uniswap V3.`
      }
      return t`Unknown error${reason ? `: "${reason}"` : ''}. Try increasing your slippage tolerance.`
  }
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: LegacyTrade<Currency, Currency, TradeType> | TridentTrade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | undefined | null,
  tridentTradeContext?: TridentTradeContext
): {
  state: SwapCallbackState
  callback: null | (() => Promise<string>)
  error: string | null
} {
  const { account, chainId, library } = useActiveWeb3React()

  const blockNumber = useBlockNumber()

  const eip1559 =
    EIP_1559_ACTIVATION_BLOCK[chainId] == undefined ? false : blockNumber >= EIP_1559_ACTIVATION_BLOCK[chainId]

  const swapCalls = useSwapCallArguments(
    trade,
    allowedSlippage,
    recipientAddressOrName,
    signatureData,
    tridentTradeContext
  )

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)

  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return {
        state: SwapCallbackState.INVALID,
        callback: null,
        error: 'Missing dependencies',
      }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return {
          state: SwapCallbackState.INVALID,
          callback: null,
          error: 'Invalid recipient',
        }
      } else {
        return {
          state: SwapCallbackState.LOADING,
          callback: null,
          error: null,
        }
      }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        console.log('onSwap callback')
        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const { address, calldata, value } = call

            const tx =
              !value || isZero(value)
                ? { from: account, to: address, data: calldata }
                : {
                    from: account,
                    to: address,
                    data: calldata,
                    value,
                  }

            console.log({ tx })

            return library
              .estimateGas(tx)
              .then((gasEstimate) => {
                console.log('returning gas estimate')
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call)

                return library
                  .call(tx)
                  .then((result) => {
                    console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return {
                      call,
                      error: new Error('Unexpected issue with estimating the gas. Please try again.'),
                    }
                  })
                  .catch((callError) => {
                    console.debug('Call threw error', call, callError)
                    return {
                      call,
                      error: new Error(swapErrorToUserReadableMessage(callError)),
                    }
                  })
              })
          })
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        // check if any calls errored with a recognizable error
        if (!bestCallOption) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          const firstNoErrorCall = estimatedCalls.find<SwapCallEstimate>(
            (call): call is SwapCallEstimate => !('error' in call)
          )
          if (!firstNoErrorCall) throw new Error('Unexpected error. Could not estimate gas for the swap.')
          bestCallOption = firstNoErrorCall
        }

        const {
          call: { address, calldata, value },
        } = bestCallOption

        console.log('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {})
        return library
          .getSigner()
          .sendTransaction({
            from: account,
            to: address,
            data: calldata,
            // let the wallet try if we can't estimate the gas
            ...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
            gasPrice: !eip1559 && chainId === ChainId.HARMONY ? BigNumber.from('2000000000') : undefined,
            ...(value && !isZero(value) ? { value } : {}),
          })

          .then((response) => {
            const inputSymbol = trade.inputAmount.currency.symbol
            const outputSymbol = trade.outputAmount.currency.symbol
            const inputAmount = trade.inputAmount.toSignificant(4)
            const outputAmount = trade.outputAmount.toSignificant(4)

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? shortenAddress(recipientAddressOrName)
                      : recipientAddressOrName
                  }`

            addTransaction(response, {
              summary: withRecipient,
            })

            return response.hash
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, address, calldata, value)

              throw new Error(`Swap failed: ${swapErrorToUserReadableMessage(error)}`)
            }
          })
      },
      error: null,
    }
  }, [trade, library, account, chainId, recipient, recipientAddressOrName, swapCalls, eip1559, addTransaction])
}
