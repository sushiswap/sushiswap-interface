import { ARCHER_RELAY_URI, BIPS_BASE, EIP_1559_ACTIVATION_BLOCK } from '../constants'
import {
  ChainId,
  Currency,
  CurrencyAmount,
  Ether,
  JSBI,
  Percent,
  Router,
  TradeType,
  Trade as V2Trade,
} from '@sushiswap/sdk'
import { isAddress, isZero } from '../functions/validate'
import { useFactoryContract, useRouterContract } from './useContract'

import { ArcherRouter } from '../functions/archerRouter'
import { BigNumber } from '@ethersproject/bignumber'
import Common from '@ethereumjs/common'
import { SignatureData } from './useERC20Permit'
import { TransactionFactory } from '@ethereumjs/tx'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import approveAmountCalldata from '../functions/approveAmountCalldata'
import { calculateGasMargin } from '../functions/trade'
import { ethers } from 'ethers'
import { shortenAddress } from '../functions/format'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useArgentWalletContract } from './useArgentWalletContract'
import { useBlockNumber } from '../state/application/hooks'
import useENS from './useENS'
import { useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import useTransactionDeadline from './useTransactionDeadline'
import { useUserArcherETHTip } from '../state/user/hooks'

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

export type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName the ENS name or address of the recipient of the swap output
 * @param signatureData the signature data of the permit of the input token amount, if available
 */
export function useSwapCallArguments(
  trade: V2Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | null | undefined,
  useArcher: boolean = false
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()

  const routerContract = useRouterContract(useArcher)
  const factoryContract = useFactoryContract()

  const argentWalletContract = useArgentWalletContract()

  const [archerETHTip] = useUserArcherETHTip()

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId || !deadline) return []

    if (trade instanceof V2Trade) {
      if (!routerContract) return []
      const swapMethods = []
      if (!useArcher) {
        swapMethods.push(
          Router.swapCallParameters(trade, {
            feeOnTransfer: false,
            allowedSlippage,
            recipient,
            deadline: deadline.toNumber(),
          })
        )

        if (trade.tradeType === TradeType.EXACT_INPUT) {
          swapMethods.push(
            Router.swapCallParameters(trade, {
              feeOnTransfer: true,
              allowedSlippage,
              recipient,
              deadline: deadline.toNumber(),
            })
          )
        }
      } else {
        swapMethods.push(
          ArcherRouter.swapCallParameters(factoryContract.address, trade, {
            allowedSlippage,
            recipient,
            ttl: deadline.toNumber(),
            ethTip: CurrencyAmount.fromRawAmount(Ether.onChain(ChainId.MAINNET), archerETHTip),
          })
        )
      }
      return swapMethods.map(({ methodName, args, value }) => {
        if (argentWalletContract && trade.inputAmount.currency.isToken) {
          return {
            address: argentWalletContract.address,
            calldata: argentWalletContract.interface.encodeFunctionData('wc_multiCall', [
              [
                approveAmountCalldata(trade.maximumAmountIn(allowedSlippage), routerContract.address),
                {
                  to: routerContract.address,
                  value: value,
                  data: routerContract.interface.encodeFunctionData(methodName, args),
                },
              ],
            ]),
            value: '0x0',
          }
        } else {
          // console.log({ methodName, args })
          return {
            address: routerContract.address,
            calldata: routerContract.interface.encodeFunctionData(methodName, args),
            value,
          }
        }
      })
    }
  }, [
    account,
    allowedSlippage,
    archerETHTip,
    argentWalletContract,
    chainId,
    deadline,
    library,
    factoryContract,
    recipient,
    routerContract,
    trade,
    useArcher,
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
  trade: V2Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | undefined | null,
  archerRelayDeadline?: number // deadline to use for archer relay -- set to undefined for no relay
): {
  state: SwapCallbackState
  callback: null | (() => Promise<string>)
  error: string | null
} {
  const { account, chainId, library } = useActiveWeb3React()

  const blockNumber = useBlockNumber()

  const eip1559 =
    EIP_1559_ACTIVATION_BLOCK[chainId] == undefined ? false : blockNumber >= EIP_1559_ACTIVATION_BLOCK[chainId]

  const useArcher = archerRelayDeadline !== undefined

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName, signatureData, useArcher)

  // console.log({ swapCalls, trade })

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)

  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const [archerETHTip] = useUserArcherETHTip()

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

            // console.log('Estimate gas for valid swap')

            // library.getGasPrice().then((gasPrice) => console.log({ gasPrice }))

            return library
              .estimateGas(tx)
              .then((gasEstimate) => {
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

        // console.log({ bestCallOption })

        if (!useArcher) {
          console.log('SWAP WITHOUT ARCHER')
          console.log(
            'gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}
          )
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
        } else {
          const postToRelay = (rawTransaction: string, deadline: number) => {
            // as a wise man on the critically acclaimed hit TV series "MTV's Cribs" once said:
            // "this is where the magic happens"
            const relayURI = chainId ? ARCHER_RELAY_URI[chainId] : undefined
            if (!relayURI) throw new Error('Could not determine relay URI for this network')
            const body = JSON.stringify({
              method: 'archer_submitTx',
              tx: rawTransaction,
              deadline: deadline.toString(),
            })
            return fetch(relayURI, {
              method: 'POST',
              body,
              headers: {
                Authorization: process.env.NEXT_PUBLIC_ARCHER_API_KEY ?? '',
                'Content-Type': 'application/json',
              },
            }).then((res) => {
              if (res.status !== 200) throw Error(res.statusText)
            })
          }

          const isMetamask = library.provider.isMetaMask

          if (isMetamask) {
            // ethers will change eth_sign to personal_sign if it detects metamask
            // https://github.com/ethers-io/ethers.js/blob/2a7dbf05718e29e550f7a208d35a095547b9ccc2/packages/providers/src.ts/web3-provider.ts#L33

            library.provider.isMetaMask = false
          }

          const fullTxPromise = library.getBlockNumber().then((blockNumber) => {
            return library.getSigner().populateTransaction({
              from: account,
              to: address,
              data: calldata,
              // let the wallet try if we can't estimate the gas
              ...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
              ...(value && !isZero(value) ? { value } : {}),
              ...(archerRelayDeadline && !eip1559 ? { gasPrice: 0 } : {}),
            })
          })

          let signedTxPromise: Promise<{ signedTx: string; fullTx: TransactionRequest }>
          if (isMetamask) {
            signedTxPromise = fullTxPromise.then((fullTx) => {
              // metamask doesn't support Signer.signTransaction, so we have to do all this manually
              const chainNames: {
                [chainId in ChainId]?: string
              } = {
                [ChainId.MAINNET]: 'mainnet',
              }
              const chain = chainNames[chainId]
              if (!chain) throw new Error(`Unknown chain ID ${chainId} when building transaction`)
              const common = new Common({
                chain,
                hardfork: 'berlin',
              })
              const txParams = {
                nonce:
                  fullTx.nonce !== undefined
                    ? ethers.utils.hexlify(fullTx.nonce, {
                        hexPad: 'left',
                      })
                    : undefined,
                gasPrice:
                  fullTx.gasPrice !== undefined ? ethers.utils.hexlify(fullTx.gasPrice, { hexPad: 'left' }) : undefined,
                gasLimit:
                  fullTx.gasLimit !== undefined ? ethers.utils.hexlify(fullTx.gasLimit, { hexPad: 'left' }) : undefined,
                to: fullTx.to,
                value:
                  fullTx.value !== undefined
                    ? ethers.utils.hexlify(fullTx.value, {
                        hexPad: 'left',
                      })
                    : undefined,
                data: fullTx.data?.toString(),
                chainId: fullTx.chainId !== undefined ? ethers.utils.hexlify(fullTx.chainId) : undefined,
                type: fullTx.type !== undefined ? ethers.utils.hexlify(fullTx.type) : undefined,
              }
              const tx: any = TransactionFactory.fromTxData(txParams, {
                common,
              })
              const unsignedTx = tx.getMessageToSign()
              // console.log('unsignedTx', unsignedTx)

              return library.provider
                .request({ method: 'eth_sign', params: [account, ethers.utils.hexlify(unsignedTx)] })
                .then((signature) => {
                  const signatureParts = ethers.utils.splitSignature(signature)
                  // really crossing the streams here
                  // eslint-disable-next-line
                  // @ts-ignore
                  const txWithSignature = tx._processSignature(
                    signatureParts.v,
                    ethers.utils.arrayify(signatureParts.r),
                    ethers.utils.arrayify(signatureParts.s)
                  )
                  return {
                    signedTx: ethers.utils.hexlify(txWithSignature.serialize()),
                    fullTx,
                  }
                })
            })
          } else {
            signedTxPromise = fullTxPromise.then((fullTx) => {
              return library
                .getSigner()
                .signTransaction(fullTx)
                .then((signedTx) => {
                  return { signedTx, fullTx }
                })
            })
          }

          return signedTxPromise
            .then(({ signedTx, fullTx }) => {
              const hash = ethers.utils.keccak256(signedTx)
              const inputSymbol = trade.inputAmount.currency.symbol
              const outputSymbol = trade.outputAmount.currency.symbol
              const inputAmount = trade.inputAmount.toSignificant(3)
              const outputAmount = trade.outputAmount.toSignificant(3)
              const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
              const withRecipient =
                (recipient === account
                  ? base
                  : `${base} to ${
                      recipientAddressOrName && isAddress(recipientAddressOrName)
                        ? shortenAddress(recipientAddressOrName)
                        : recipientAddressOrName
                    }`) + (archerRelayDeadline ? ' 🏹' : '')
              const archer =
                useArcher && archerRelayDeadline
                  ? {
                      rawTransaction: signedTx,
                      deadline: Math.floor(archerRelayDeadline + new Date().getTime() / 1000),
                      nonce: ethers.BigNumber.from(fullTx.nonce).toNumber(),
                      ethTip: archerETHTip,
                    }
                  : undefined
              // console.log('archer', archer)
              addTransaction(
                { hash },
                {
                  summary: withRecipient,
                  archer,
                }
              )
              return archer ? postToRelay(archer.rawTransaction, archer.deadline).then(() => hash) : hash
            })
            .catch((error: any) => {
              // if the user rejected the tx, pass this along
              if (error?.code === 4001) {
                throw new Error('Transaction rejected.')
              } else {
                // otherwise, the error was unexpected and we need to convey that
                console.error(`Swap failed`, error)
                throw new Error(`Swap failed: ${error.message}`)
              }
            })
            .finally(() => {
              if (isMetamask) library.provider.isMetaMask = true
            })
        }
      },
      error: null,
    }
  }, [trade, library, account, chainId, recipient, recipientAddressOrName, swapCalls, useArcher, addTransaction])
}
