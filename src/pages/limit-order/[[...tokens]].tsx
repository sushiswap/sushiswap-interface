import Head from 'next/head'
import { t } from '@lingui/macro'
import TokenWarningModal from '../../components/TokenWarningModal'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Layout from '../../layouts/DefaultLayout'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, JSBI, Token, Trade } from '@sushiswap/sdk'
import { useAllTokens, useCurrency } from '../../hooks/Tokens'
import {
    useDefaultsFromURLSearch,
    useDerivedSwapInfo,
    useReserveRatio,
    useSwapActionHandlers,
    useSwapState,
} from '../../state/swap/hooks'
import { Field } from '../../state/swap/actions'
import SwapHeader from '../../components/ExchangeHeader'
import { ARCHER_RELAY_URI, ARCHER_ROUTER_ADDRESS } from '../../constants'
import {
    useExpertModeManager,
    useUserArcherETHTip,
    useUserArcherGasPrice,
    useUserArcherUseRelay,
    useUserSingleHopOnly,
    useUserSlippageTolerance,
    useUserTransactionTTL,
} from '../../state/user/hooks'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import DoubleGlowShadow from '../../components/DoubleGlowShadow'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import {
    useNetworkModalToggle,
    useToggleSettingsMenu,
    useWalletModalToggle,
} from '../../state/application/hooks'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import useENSAddress from '../../hooks/useENSAddress'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks'
import {
    computeTradePriceBreakdown,
    formatPercent,
    getRouterAddress,
    maxAmountSpend,
    warningSeverity,
} from '../../functions'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import confirmPriceImpactWithoutFee from '../../features/swap/confirmPriceImpactWithoutFee'
import ReactGA from 'react-ga'
import { useIsTransactionUnsupported } from '../../hooks/Trades'
import Lottie from 'lottie-react'
import swapArrowsAnimationData from '../../animation/swap-arrows.json'
import LimitPriceInputPanel from '../../features/limit-orders/LimitPriceInputPanel'
import ExpertModePanel from '../../components/ExpertModePanel'
import PriceRatio from '../../features/limit-orders/PriceRatio'
import OrderExpirationDropdown from '../../features/limit-orders/OrderExpirationDropdown'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ArrowDownIcon } from '@heroicons/react/outline'
import { useLimitOrderState } from '../../state/limit-order/hooks'
import Button from '../../components/Button'
import useLimitOrderApproveCallback from '../../hooks/useLimitOrderApproveCallback'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import LimitOrderButton from '../../features/limit-orders/LimitOrderButton'
import { TokenApproveButton } from '../../components/KashiButton'

export default function LimitOrder() {
    const { i18n } = useLingui()
    const { account, chainId } = useActiveWeb3React()
    const toggleNetworkModal = useNetworkModalToggle()

    // TODO: Use?
    // const router = useRouter()
    // const tokens = router.query.tokens
    // const [currencyIdA, currencyIdB] = tokens as string[]
    // const currencyA = useCurrency(currencyIdA)
    // const currencyB = useCurrency(currencyIdB)

    const loadedUrlParams = useDefaultsFromURLSearch()

    // token warning stuff
    const [loadedInputCurrency, loadedOutputCurrency] = [
        useCurrency(loadedUrlParams?.inputCurrencyId),
        useCurrency(loadedUrlParams?.outputCurrencyId),
    ]
    const [dismissTokenWarning, setDismissTokenWarning] =
        useState<boolean>(false)
    const urlLoadedTokens: Token[] = useMemo(
        () =>
            [loadedInputCurrency, loadedOutputCurrency]?.filter(
                (c): c is Token => c instanceof Token
            ) ?? [],
        [loadedInputCurrency, loadedOutputCurrency]
    )
    const handleConfirmTokenWarning = useCallback(() => {
        setDismissTokenWarning(true)
    }, [])

    // dismiss warning if all imported tokens are in active lists
    const defaultTokens = useAllTokens()
    const importTokensNotInDefault =
        urlLoadedTokens &&
        urlLoadedTokens.filter((token: Token) => {
            return !Boolean(token.address in defaultTokens)
        })

    // toggle wallet when disconnected
    const toggleWalletModal = useWalletModalToggle()

    // for expert mode
    const toggleSettings = useToggleSettingsMenu()
    const [isExpertMode, toggleExpertMode] = useExpertModeManager()

    // get custom setting values for user
    const [allowedSlippage] = useUserSlippageTolerance()
    const [ttl] = useUserTransactionTTL()
    const [useArcher] = useUserArcherUseRelay()
    const [archerETHTip] = useUserArcherETHTip()
    const [archerGasPrice] = useUserArcherGasPrice()

    // archer
    const archerRelay = chainId ? ARCHER_RELAY_URI?.[chainId] : undefined
    const doArcher = archerRelay !== undefined && useArcher

    // swap state
    const { independentField, typedValue, recipient } = useSwapState()
    const {
        v2Trade,
        currencyBalances,
        parsedAmount,
        currencies,
        inputError: swapInputError,
    } = useDerivedSwapInfo(doArcher)
    const {
        wrapType,
        execute: onWrap,
        inputError: wrapInputError,
    } = useWrapCallback(
        currencies[Field.INPUT],
        currencies[Field.OUTPUT],
        typedValue
    )
    const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
    const { address: recipientAddress } = useENSAddress(recipient)

    const trade = showWrap ? undefined : v2Trade

    const parsedAmounts = showWrap
        ? {
              [Field.INPUT]: parsedAmount,
              [Field.OUTPUT]: parsedAmount,
          }
        : {
              [Field.INPUT]:
                  independentField === Field.INPUT
                      ? parsedAmount
                      : trade?.inputAmount,
              [Field.OUTPUT]:
                  independentField === Field.OUTPUT
                      ? parsedAmount
                      : trade?.outputAmount,
          }

    const {
        onSwitchTokens,
        onCurrencySelection,
        onUserInput,
        onChangeRecipient,
    } = useSwapActionHandlers()
    const isValid = !swapInputError
    const dependentField: Field =
        independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

    const handleTypeInput = useCallback(
        (value: string) => {
            onUserInput(Field.INPUT, value)
        },
        [onUserInput]
    )
    const handleTypeOutput = useCallback(
        (value: string) => {
            onUserInput(Field.OUTPUT, value)
        },
        [onUserInput]
    )

    // modal and loading
    const [
        {
            showConfirm,
            tradeToConfirm,
            swapErrorMessage,
            attemptingTxn,
            txHash,
        },
        setSwapState,
    ] = useState<{
        showConfirm: boolean
        tradeToConfirm: Trade | undefined
        attemptingTxn: boolean
        swapErrorMessage: string | undefined
        txHash: string | undefined
    }>({
        showConfirm: false,
        tradeToConfirm: undefined,
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: undefined,
    })

    const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]: showWrap
            ? parsedAmounts[independentField]?.toExact() ?? ''
            : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }

    const route = trade?.route
    const userHasSpecifiedInputOutput = Boolean(
        currencies[Field.INPUT] &&
            currencies[Field.OUTPUT] &&
            parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
    )
    const noRoute = !route

    // check whether the user has approved the router on the input token
    const [approval, approveCallback] = useApproveCallbackFromTrade(
        doArcher
            ? ARCHER_ROUTER_ADDRESS[chainId ?? 1]
            : getRouterAddress(chainId),
        trade,
        allowedSlippage
    )

    // check if user has gone through approval process, used to show two step buttons, reset on token change
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

    // mark when a user has submitted an approval, reset onTokenSelection for input field
    useEffect(() => {
        if (approval === ApprovalState.PENDING) {
            setApprovalSubmitted(true)
        }
    }, [approval, approvalSubmitted])

    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
        currencyBalances[Field.INPUT],
        doArcher ? archerETHTip : undefined,
        chainId
    )
    const atMaxAmountInput = Boolean(
        maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput)
    )

    // the callback to execute the swap
    const { callback: swapCallback, error: swapCallbackError } =
        useSwapCallback(
            trade,
            allowedSlippage,
            recipient,
            doArcher ? ttl : undefined
        )

    const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

    const [singleHopOnly] = useUserSingleHopOnly()

    const handleSwap = useCallback(() => {
        if (
            priceImpactWithoutFee &&
            !confirmPriceImpactWithoutFee(priceImpactWithoutFee)
        ) {
            return
        }
        if (!swapCallback) {
            return
        }
        setSwapState({
            attemptingTxn: true,
            tradeToConfirm,
            showConfirm,
            swapErrorMessage: undefined,
            txHash: undefined,
        })
        swapCallback()
            .then((hash) => {
                setSwapState({
                    attemptingTxn: false,
                    tradeToConfirm,
                    showConfirm,
                    swapErrorMessage: undefined,
                    txHash: hash,
                })

                ReactGA.event({
                    category: 'Swap',
                    action:
                        recipient === null
                            ? 'Swap w/o Send'
                            : (recipientAddress ?? recipient) === account
                            ? 'Swap w/o Send + recipient'
                            : 'Swap w/ Send',
                    label: [
                        trade?.inputAmount?.currency?.getSymbol(chainId),
                        trade?.outputAmount?.currency?.getSymbol(chainId),
                    ].join('/'),
                })

                ReactGA.event({
                    category: 'Routing',
                    action: singleHopOnly
                        ? 'Swap with multihop disabled'
                        : 'Swap with multihop enabled',
                })
            })
            .catch((error) => {
                setSwapState({
                    attemptingTxn: false,
                    tradeToConfirm,
                    showConfirm,
                    swapErrorMessage: error.message,
                    txHash: undefined,
                })
            })
    }, [
        priceImpactWithoutFee,
        swapCallback,
        tradeToConfirm,
        showConfirm,
        recipient,
        recipientAddress,
        account,
        trade,
        chainId,
        singleHopOnly,
    ])

    // errors
    const [showInverted, setShowInverted] = useState<boolean>(false)

    // warnings on slippage
    const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

    // show approve flow when: no error on inputs, not approved or pending, or approved in current session
    // never show if price impact is above threshold in non expert mode
    const showApproveFlow =
        !swapInputError &&
        (approval === ApprovalState.NOT_APPROVED ||
            approval === ApprovalState.PENDING ||
            (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
        !(priceImpactSeverity > 3 && !isExpertMode)

    const handleConfirmDismiss = useCallback(() => {
        setSwapState({
            showConfirm: false,
            tradeToConfirm,
            attemptingTxn,
            swapErrorMessage,
            txHash,
        })
        // if there was a tx hash, we want to clear the input
        if (txHash) {
            onUserInput(Field.INPUT, '')
        }
    }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

    const handleAcceptChanges = useCallback(() => {
        setSwapState({
            tradeToConfirm: trade,
            swapErrorMessage,
            txHash,
            attemptingTxn,
            showConfirm,
        })
    }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

    const handleInputSelect = useCallback(
        (inputCurrency) => {
            setApprovalSubmitted(false) // reset 2 step UI for approvals
            onCurrencySelection(Field.INPUT, inputCurrency)
        },
        [onCurrencySelection]
    )

    const handleMaxInput = useCallback(() => {
        maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
    }, [maxAmountInput, onUserInput])

    const handleOutputSelect = useCallback(
        (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
        [onCurrencySelection]
    )

    useEffect(() => {
        if (
            doArcher &&
            parsedAmounts[Field.INPUT] &&
            maxAmountInput &&
            parsedAmounts[Field.INPUT]?.greaterThan(maxAmountInput)
        ) {
            handleMaxInput()
        }
    }, [handleMaxInput, parsedAmounts, maxAmountInput, doArcher])

    const swapIsUnsupported = useIsTransactionUnsupported(
        currencies?.INPUT,
        currencies?.OUTPUT
    )

    const [animateSwapArrows, setAnimateSwapArrows] = useState<boolean>(false)

    // LIMIT ORDERS
    const currentPrice = useReserveRatio()
    const { limitPrice } = useLimitOrderState()

    const [currencyInputPanelError, setCurrencyInputPanelError] =
        useState<string>()

    const checkLimitPrice = useCallback(() => {
        if (limitPrice === currentPrice) return
        if (limitPrice && currentPrice && +limitPrice < +currentPrice)
            setCurrencyInputPanelError(
                i18n._(t`This transaction is below market rate`)
            )
        else setCurrencyInputPanelError('')
    }, [limitPrice, currentPrice])

    const currencyInputPanelHelperText = useMemo(() => {
        if (limitPrice === currentPrice) return
        const sign =
            +limitPrice > +currentPrice ? i18n._(t`above`) : i18n._(t`below`)
        if (limitPrice && currentPrice)
            return i18n._(
                t`${formatPercent(
                    ((+limitPrice - +currentPrice) / +currentPrice) * 100
                )} ${sign} market rate`
            )
    }, [limitPrice, currentPrice])

    const [limitApproval, limitApproveCallback] = useLimitOrderApproveCallback()
    console.log(limitApproval)
    return (
        <Layout>
            <Head>
                <title>{i18n._(t`Limit order`)} | Sushi</title>
                <meta
                    name="description"
                    content="SushiSwap allows for swapping of ERC20 compatible tokens across multiple networks"
                />
            </Head>
            <TokenWarningModal
                isOpen={
                    importTokensNotInDefault.length > 0 && !dismissTokenWarning
                }
                tokens={importTokensNotInDefault}
                onConfirm={handleConfirmTokenWarning}
            />
            <ExpertModePanel
                active={isExpertMode}
                onClose={() => {
                    onChangeRecipient(null)
                    toggleExpertMode()
                }}
            >
                <DoubleGlowShadow>
                    <div
                        id="limit-order-page"
                        className="flex flex-col w-full max-w-2xl p-6 rounded bg-dark-900 gap-4"
                    >
                        <SwapHeader
                            input={currencies[Field.INPUT]}
                            output={currencies[Field.OUTPUT]}
                        />
                        <div className="flex flex-col gap-4">
                            <CurrencyInputPanel
                                label={
                                    independentField === Field.OUTPUT &&
                                    !showWrap &&
                                    trade
                                        ? i18n._(t`Swap From (est.):`)
                                        : i18n._(t`Swap From:`)
                                }
                                value={formattedAmounts[Field.INPUT]}
                                showMaxButton={!atMaxAmountInput}
                                currency={currencies[Field.INPUT]}
                                onUserInput={handleTypeInput}
                                onMax={handleMaxInput}
                                onCurrencySelect={handleInputSelect}
                                otherCurrency={currencies[Field.OUTPUT]}
                                id="swap-currency-input"
                            />
                            <div className="flex flex-row gap-5">
                                <div />
                                <div className="flex items-center relative">
                                    <div className="z-0 absolute w-[2px] bg-dark-800 h-[calc(100%+32px)] top-[-16px] left-[calc(50%-1px)]" />
                                    <button
                                        className="rounded-full bg-dark-900 p-3px z-10"
                                        onClick={() => {
                                            setApprovalSubmitted(false) // reset 2 step UI for approvals
                                            onSwitchTokens()
                                        }}
                                    >
                                        <div
                                            className="p-2 rounded-full bg-dark-800 hover:bg-dark-700"
                                            onMouseEnter={() =>
                                                setAnimateSwapArrows(true)
                                            }
                                            onMouseLeave={() =>
                                                setAnimateSwapArrows(false)
                                            }
                                        >
                                            <Lottie
                                                animationData={
                                                    swapArrowsAnimationData
                                                }
                                                autoplay={animateSwapArrows}
                                                loop={false}
                                                className="w-[32px] h-[32px]"
                                            />
                                        </div>
                                    </button>
                                </div>
                                <LimitPriceInputPanel
                                    placeholder={currentPrice}
                                    value={limitPrice}
                                    onBlur={checkLimitPrice}
                                />
                            </div>
                            <CurrencyInputPanel
                                value={formattedAmounts[Field.OUTPUT]}
                                onUserInput={handleTypeOutput}
                                label={
                                    independentField === Field.INPUT &&
                                    !showWrap &&
                                    trade
                                        ? i18n._(t`Swap To (est.):`)
                                        : i18n._(t`Swap To:`)
                                }
                                showMaxButton={false}
                                currency={currencies[Field.OUTPUT]}
                                onCurrencySelect={handleOutputSelect}
                                otherCurrency={currencies[Field.INPUT]}
                                id="swap-currency-output"
                                error={currencyInputPanelError}
                                helperText={currencyInputPanelHelperText}
                            />

                            {recipient !== null && !showWrap ? (
                                <div className="relative">
                                    <div className="bg-dark-800 rounded-full absolute left-[26px] -top-7 p-2 border-2 border-dark-900">
                                        <ArrowDownIcon
                                            className="text-high-emphesis"
                                            strokeWidth={2}
                                            width={20}
                                            height={20}
                                        />
                                    </div>
                                    <AddressInputPanel
                                        id="recipient"
                                        value={recipient}
                                        onChange={onChangeRecipient}
                                    />
                                </div>
                            ) : null}
                        </div>

                        <div className="flex justify-between gap-6">
                            {currencies[Field.INPUT] &&
                            currencies[Field.OUTPUT] ? (
                                <PriceRatio />
                            ) : (
                                <div />
                            )}
                            {isExpertMode && recipient === null && (
                                <div
                                    className="flex text-blue underline cursor-pointer"
                                    onClick={() => onChangeRecipient('')}
                                >
                                    {i18n._(t`Change Recipient`)}
                                </div>
                            )}
                            <OrderExpirationDropdown />
                        </div>

                        {/*// TODO */}
                        <div className="flex">
                            <LimitOrderButton
                                color="gradient"
                                size="large"
                                content={(createLimitOrder: any) => (
                                    <TokenApproveButton
                                        size="large"
                                        value={trade?.inputAmount}
                                        token={currencies[Field.INPUT]}
                                        needed={true}
                                    >
                                        <Button
                                            size="large"
                                            onClick={createLimitOrder}
                                        >
                                            {i18n._(t`Review Limit Order`)}
                                        </Button>
                                    </TokenApproveButton>
                                )}
                            />
                        </div>
                    </div>
                </DoubleGlowShadow>
            </ExpertModePanel>
        </Layout>
    )
}
