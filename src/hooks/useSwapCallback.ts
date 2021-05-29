import {
    ARCHER_RELAY_URI,
    BIPS_BASE,
    INITIAL_ALLOWED_SLIPPAGE,
} from '../constants'
import {
    ChainId,
    CurrencyAmount,
    JSBI,
    Percent,
    Router,
    SwapParameters,
    Trade,
    TradeType,
} from '@sushiswap/sdk'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import {
    getArcherRouterContract,
    getRouterAddress,
    getRouterContract,
} from '../functions/contract'
import { isAddress, isZero } from '../functions/validate'

import { ArcherRouter } from '../functions/archerRouter'
import { BigNumber } from '@ethersproject/bignumber'
import Common from '@ethereumjs/common'
import { Contract } from '@ethersproject/contracts'
import { TransactionFactory } from '@ethereumjs/tx'
import { calculateGasMargin } from '../functions/trade'
import { ethers } from 'ethers'
import { shortenAddress } from '../functions/format'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from './useActiveWeb3React'
import useENS from './useENS'
import { useLingui } from '@lingui/react'
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
    contract: Contract
    parameters: SwapParameters
}

export interface SuccessfulCall {
    call: SwapCall
    gasEstimate: BigNumber
}

interface FailedCall {
    call: SwapCall
    error: Error
}

export type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
export function useSwapCallArguments(
    trade: Trade | undefined, // trade to execute, required
    allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
    recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
    useArcher: boolean
): SwapCall[] {
    const { account, chainId, library } = useActiveWeb3React()

    const { address: recipientAddress } = useENS(recipientAddressOrName)
    const recipient =
        recipientAddressOrName === null ? account : recipientAddress
    const deadline = useTransactionDeadline()
    const [archerETHTip] = useUserArcherETHTip()
    const router = getRouterAddress(chainId)

    return useMemo(() => {
        if (
            !trade ||
            !recipient ||
            !library ||
            !account ||
            !chainId ||
            !deadline
        )
            return []

        const contract: Contract | null = useArcher
            ? getArcherRouterContract(chainId, library, account)
            : getRouterContract(chainId, library, account)
        if (!contract) {
            return []
        }

        const swapMethods = []

        if (!useArcher) {
            swapMethods.push(
                Router.swapCallParameters(trade, {
                    feeOnTransfer: false,
                    allowedSlippage: new Percent(
                        JSBI.BigInt(allowedSlippage),
                        BIPS_BASE
                    ),
                    recipient,
                    deadline: deadline.toNumber(),
                })
            )

            if (trade.tradeType === TradeType.EXACT_INPUT) {
                swapMethods.push(
                    Router.swapCallParameters(trade, {
                        feeOnTransfer: true,
                        allowedSlippage: new Percent(
                            JSBI.BigInt(allowedSlippage),
                            BIPS_BASE
                        ),
                        recipient,
                        deadline: deadline.toNumber(),
                    })
                )
            }
        } else {
            swapMethods.push(
                ArcherRouter.swapCallParameters(router, trade, {
                    allowedSlippage: new Percent(
                        JSBI.BigInt(allowedSlippage),
                        BIPS_BASE
                    ),
                    recipient,
                    ttl: deadline.toNumber(),
                    ethTip: CurrencyAmount.ether(archerETHTip),
                })
            )
        }

        return swapMethods.map((parameters) => ({ parameters, contract }))
    }, [
        account,
        allowedSlippage,
        chainId,
        deadline,
        library,
        recipient,
        trade,
        useArcher,
        archerETHTip,
        router,
    ])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
    trade: Trade | undefined, // trade to execute, required
    allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
    recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
    archerRelayDeadline?: number // deadline to use for archer relay -- set to undefined for no relay
): {
    state: SwapCallbackState
    callback: null | (() => Promise<string>)
    error: string | null
} {
    const { i18n } = useLingui()

    const { account, chainId, library } = useActiveWeb3React()

    const useArcher = archerRelayDeadline !== undefined
    const swapCalls = useSwapCallArguments(
        trade,
        allowedSlippage,
        recipientAddressOrName,
        useArcher
    )

    const addTransaction = useTransactionAdder()

    const { address: recipientAddress } = useENS(recipientAddressOrName)
    const recipient =
        recipientAddressOrName === null ? account : recipientAddress
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
                const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
                    swapCalls.map((call) => {
                        const {
                            parameters: { methodName, args, value },
                            contract,
                        } = call
                        const options = !value || isZero(value) ? {} : { value }

                        return contract.estimateGas[methodName](
                            ...args,
                            options
                        )
                            .then((gasEstimate) => {
                                return {
                                    call,
                                    gasEstimate,
                                }
                            })
                            .catch((gasError) => {
                                console.debug(
                                    'Gas estimate failed, trying eth_call to extract error',
                                    call
                                )

                                return contract.callStatic[methodName](
                                    ...args,
                                    options
                                )
                                    .then((result) => {
                                        console.debug(
                                            'Unexpected successful call after failed estimate gas',
                                            call,
                                            gasError,
                                            result
                                        )
                                        return {
                                            call,
                                            error: new Error(
                                                'Unexpected issue with estimating the gas. Please try again.'
                                            ),
                                        }
                                    })
                                    .catch((callError) => {
                                        console.debug(
                                            'Call threw error',
                                            call,
                                            callError
                                        )
                                        let errorMessage: string
                                        switch (callError.reason) {
                                            case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
                                            case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
                                                errorMessage = i18n._(
                                                    t`This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.`
                                                )
                                                break
                                            default:
                                                errorMessage = i18n._(
                                                    t`The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`
                                                )
                                        }
                                        return {
                                            call,
                                            error: new Error(errorMessage),
                                        }
                                    })
                            })
                    })
                )

                // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
                const successfulEstimation = estimatedCalls.find(
                    (el, ix, list): el is SuccessfulCall =>
                        'gasEstimate' in el &&
                        (ix === list.length - 1 ||
                            'gasEstimate' in list[ix + 1])
                )

                if (!successfulEstimation) {
                    const errorCalls = estimatedCalls.filter(
                        (call): call is FailedCall => 'error' in call
                    )
                    if (errorCalls.length > 0)
                        throw errorCalls[errorCalls.length - 1].error
                    throw new Error(
                        'Unexpected error. Please contact support: none of the calls threw an error'
                    )
                }

                const {
                    call: {
                        contract,
                        parameters: { methodName, args, value },
                    },
                    gasEstimate,
                } = successfulEstimation

                if (!useArcher) {
                    return contract[methodName](...args, {
                        gasLimit: calculateGasMargin(gasEstimate),
                        ...(value && !isZero(value)
                            ? { value, from: account }
                            : { from: account }),
                    })
                        .then((response: any) => {
                            const inputSymbol =
                                trade.inputAmount.currency.getSymbol(chainId)
                            const outputSymbol =
                                trade.outputAmount.currency.getSymbol(chainId)
                            const inputAmount =
                                trade.inputAmount.toSignificant(3)
                            const outputAmount =
                                trade.outputAmount.toSignificant(3)

                            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
                            const withRecipient =
                                recipient === account
                                    ? base
                                    : `${base} to ${
                                          recipientAddressOrName &&
                                          isAddress(recipientAddressOrName)
                                              ? shortenAddress(
                                                    recipientAddressOrName
                                                )
                                              : recipientAddressOrName
                                      }`

                            addTransaction(response, {
                                summary: withRecipient,
                            })

                            return response.hash
                        })
                        .catch((error: any) => {
                            // if the user rejected the tx, pass this along
                            if (error?.code === 4001) {
                                throw new Error('Transaction rejected.')
                            } else {
                                // otherwise, the error was unexpected and we need to convey that
                                console.error(
                                    `Swap failed`,
                                    error,
                                    methodName,
                                    args,
                                    value
                                )
                                throw new Error(`Swap failed: ${error.message}`)
                            }
                        })
                } else {
                    const postToRelay = (
                        rawTransaction: string,
                        deadline: number
                    ) => {
                        // as a wise man on the critically acclaimed hit TV series "MTV's Cribs" once said:
                        // "this is where the magic happens"

                        const relayURI = chainId
                            ? ARCHER_RELAY_URI[chainId]
                            : undefined
                        if (!relayURI)
                            throw new Error(
                                'Could not determine relay URI for this network'
                            )

                        const body = JSON.stringify({
                            method: 'archer_submitTx',
                            tx: rawTransaction,
                            deadline: deadline.toString(),
                        })

                        return fetch(relayURI, {
                            method: 'POST',
                            body,
                            headers: {
                                Authorization:
                                    process.env.NEXT_PUBLIC_ARCHER_API_KEY ??
                                    '',
                                'Content-Type': 'application/json',
                            },
                        }).then((res) => {
                            if (res.status !== 200) throw Error(res.statusText)
                        })
                    }

                    const partialTx = {
                        to: contract.address,
                        from: account,
                        gasLimit: calculateGasMargin(gasEstimate),
                        data: contract.interface.encodeFunctionData(
                            methodName,
                            args
                        ),
                        ...(archerRelayDeadline ? { gasPrice: 0 } : {}),
                        ...(value && !isZero(value) ? { value } : {}),
                    }
                    return contract.signer
                        .populateTransaction(partialTx)
                        .then((fullTx) => {
                            // metamask doesn't support Signer.signTransaction, so we have to do all this manually
                            //return contract.signer.signTransaction(fullTx)

                            const chainNames: {
                                [chainId in ChainId]?: string
                            } = {
                                [ChainId.MAINNET]: 'mainnet',
                            }
                            const chain = chainNames[chainId]
                            if (!chain)
                                throw new Error(
                                    `Unknown chain ID ${chainId} when building transaction`
                                )

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
                                    fullTx.gasPrice !== undefined
                                        ? ethers.utils.hexlify(
                                              fullTx.gasPrice,
                                              { hexPad: 'left' }
                                          )
                                        : undefined,
                                gasLimit:
                                    fullTx.gasLimit !== undefined
                                        ? ethers.utils.hexlify(
                                              fullTx.gasLimit,
                                              { hexPad: 'left' }
                                          )
                                        : undefined,
                                to: fullTx.to,
                                value:
                                    fullTx.value !== undefined
                                        ? ethers.utils.hexlify(fullTx.value, {
                                              hexPad: 'left',
                                          })
                                        : undefined,
                                data: fullTx.data?.toString(),
                                chainId:
                                    fullTx.chainId !== undefined
                                        ? ethers.utils.hexlify(fullTx.chainId)
                                        : undefined,
                                type:
                                    fullTx.type !== undefined
                                        ? ethers.utils.hexlify(fullTx.type)
                                        : undefined,
                            }
                            const tx = TransactionFactory.fromTxData(txParams, {
                                common,
                            })
                            const unsignedTx = tx.getMessageToSign()

                            if (!(contract.signer instanceof JsonRpcSigner)) {
                                throw new Error(
                                    `Cannot sign transactions with this wallet type`
                                )
                            }
                            const signer = contract.signer as JsonRpcSigner

                            // ethers will change eth_sign to personal_sign if it detects metamask
                            // https://github.com/ethers-io/ethers.js/blob/2a7dbf05718e29e550f7a208d35a095547b9ccc2/packages/providers/src.ts/web3-provider.ts#L33

                            let isMetamask: boolean | undefined
                            let web3Provider: Web3Provider | undefined
                            if (signer.provider instanceof Web3Provider) {
                                web3Provider = signer.provider as Web3Provider
                                isMetamask = web3Provider.provider.isMetaMask
                                web3Provider.provider.isMetaMask = false
                            }

                            return signer.provider
                                .send('eth_sign', [
                                    account,
                                    ethers.utils.hexlify(unsignedTx),
                                ])
                                .then((signature) => {
                                    const signatureParts =
                                        ethers.utils.splitSignature(signature)

                                    // really crossing the streams here
                                    // @ts-ignore
                                    const txWithSignature =
                                        tx._processSignature(
                                            signatureParts.v,
                                            ethers.utils.arrayify(
                                                signatureParts.r
                                            ),
                                            ethers.utils.arrayify(
                                                signatureParts.s
                                            )
                                        )

                                    return {
                                        signedTx: ethers.utils.hexlify(
                                            txWithSignature.serialize()
                                        ),
                                        fullTx,
                                    }
                                })
                                .finally(() => {
                                    if (web3Provider) {
                                        web3Provider.provider.isMetaMask =
                                            isMetamask
                                    }
                                })
                        })
                        .then(({ signedTx, fullTx }) => {
                            const hash = ethers.utils.keccak256(signedTx)

                            const inputSymbol =
                                trade.inputAmount.currency.symbol
                            const outputSymbol =
                                trade.outputAmount.currency.symbol
                            const inputAmount =
                                trade.inputAmount.toSignificant(3)
                            const outputAmount =
                                trade.outputAmount.toSignificant(3)

                            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
                            const withRecipient =
                                (recipient === account
                                    ? base
                                    : `${base} to ${
                                          recipientAddressOrName &&
                                          isAddress(recipientAddressOrName)
                                              ? shortenAddress(
                                                    recipientAddressOrName
                                                )
                                              : recipientAddressOrName
                                      }`) + (archerRelayDeadline ? ' 🏹' : '')

                            const archer =
                                useArcher && archerRelayDeadline
                                    ? {
                                          rawTransaction: signedTx,
                                          deadline: Math.floor(
                                              archerRelayDeadline +
                                                  new Date().getTime() / 1000
                                          ),
                                          nonce: ethers.BigNumber.from(
                                              fullTx.nonce
                                          ).toNumber(),
                                          ethTip: archerETHTip,
                                      }
                                    : undefined

                            addTransaction(
                                { hash },
                                {
                                    summary: withRecipient,
                                    archer,
                                }
                            )

                            return archer
                                ? postToRelay(
                                      archer.rawTransaction,
                                      archer.deadline
                                  ).then(() => hash)
                                : hash
                        })
                        .catch((error: any) => {
                            // if the user rejected the tx, pass this along
                            if (error?.code === 4001) {
                                throw new Error('Transaction rejected.')
                            } else {
                                // otherwise, the error was unexpected and we need to convey that
                                console.error(
                                    `Swap failed`,
                                    error,
                                    methodName,
                                    args,
                                    value
                                )
                                throw new Error(`Swap failed: ${error.message}`)
                            }
                        })
                }
            },
            error: null,
        }
    }, [
        trade,
        library,
        account,
        chainId,
        recipient,
        recipientAddressOrName,
        swapCalls,
        addTransaction,
    ])
}
