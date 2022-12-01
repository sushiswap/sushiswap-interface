// Note (amiller68): #SdkChange / #SdkPublish
import { Currency, JSBI, Token, Trade as V2Trade, TradeType } from '@figswap/core-sdk'
import { CogIcon, ExclamationIcon } from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Banner from 'app/components/Banner'
import Button from 'app/components/Button'
import CloseIcon from 'app/components/CloseIcon'
import { HeadlessUiModal } from 'app/components/Modal'
import NavLink from 'app/components/NavLink'
import QuestionHelper from 'app/components/QuestionHelper'
import RecipientField from 'app/components/RecipientField'
import Switch from 'app/components/Switch'
import TransactionSettings from 'app/components/TransactionSettings'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import ConfirmSwapModal from 'app/features/legacy/swap/ConfirmSwapModal'
import SwapCallbackError from 'app/features/legacy/swap/SwapCallbackError'
import SwapDetails from 'app/features/legacy/swap/SwapDetails'
import SwapGasFeeInputs from 'app/features/legacy/swap/SwapGasFeeInputs'
import UnsupportedCurrencyFooter from 'app/features/legacy/swap/UnsupportedCurrencyFooter'
// import HeaderNew from 'app/features/trade/HeaderNew'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
// import { classNames } from 'app/functions'
import confirmPriceImpactWithoutFee from 'app/functions/prices'
import { warningSeverity } from 'app/functions/prices'
import { computeFiatValuePriceImpact } from 'app/functions/trade'
import { useAllTokens, useCurrency } from 'app/hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from 'app/hooks/useApproveCallback'
import useENSAddress from 'app/hooks/useENSAddress'
import useIsArgentWallet from 'app/hooks/useIsArgentWallet'
import { useIsSwapUnsupported } from 'app/hooks/useIsSwapUnsupported'
import useSushiGuardFeature from 'app/hooks/useSushiGuardFeature'
import { useSwapCallback } from 'app/hooks/useSwapCallback'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import useWalletSupportsSushiGuard from 'app/hooks/useWalletSupportsSushiGuard'
import useWrapCallback, { WrapType } from 'app/hooks/useWrapCallback'
import { SwapLayout, SwapLayoutCard } from 'app/layouts/SwapLayout'
import TokenWarningModal from 'app/modals/TokenWarningModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useToggleSettingsMenu } from 'app/state/application/hooks'
import { Field, setRecipient } from 'app/state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'app/state/swap/hooks'
import { useExpertModeManager, useUserSingleHopOnly, useUserSushiGuard } from 'app/state/user/hooks'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'react-feather'

import { SwapProps } from '../../swap'

const Swap = ({
  banners,
  placeholderSlippage,
  className,
  trident = false,
  inputCurrency,
  outputCurrency,
}: SwapProps) => {
  const { i18n } = useLingui()

  const loadedUrlParams = useDefaultsFromURLSearch()
  const { account, chainId } = useActiveWeb3React()

  const defaultTokens = useAllTokens()

  const [isExpertMode] = useExpertModeManager()
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, parsedAmount, currencies, inputError: swapInputError, allowedSlippage, to } = useDerivedSwapInfo()
  console.log(
    'Derived swap info',
    'Trade: ',
    v2Trade,
    'Parsed Amount: ',
    parsedAmount,
    'Currencies: ',
    currencies,
    'Swap Input Error: ',
    swapInputError,
    'Allowed Slippage: ',
    allowedSlippage,
    'To: ',
    to
  )
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const toggle = useToggleSettingsMenu()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly1, setSingleHopOnly1] = useUserSingleHopOnly()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [userUseSushiGuard, setUserUseSushiGuard] = useUserSushiGuard()
  const walletSupportsSushiGuard = useWalletSupportsSushiGuard()

  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])
  // from HeaderNew.tsx
  const getQuery = (input?: Currency, output?: Currency) => {
    if (!input && !output) return

    if (input && !output) {
      // @ts-ignore
      return { inputCurrency: input.address || 'ETH' }
    } else if (input && output) {
      // @ts-ignore
      return { inputCurrency: input.address, outputCurrency: output.address }
    }
  }
  // dismiss warning if all imported tokens are in active lists
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens)
    })

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)

  // Determine if this is a wrap or a trade
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = useMemo(
    () =>
      // Note (amiller68) - If this is a wrap, the amounts are the same
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : // Note (amiller68) - Otherwise, we need to get the amounts from the trade
          {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  )
  console.log('parsedAmounts', parsedAmounts)

  // TODO (amiller68): #Research priceImpaces and How UDSC is used
  // Note (amiller68): I don't think useUSDCValue will work until we implement liquidity pools
  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT])
  const [showSettings, setShowSettings] = React.useState(false)
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT])
  console.log('fiatValueInput', fiatValueInput)
  console.log('fiatValueOutput', fiatValueOutput)
  // Note (amiller68): Determines the price impact of making this trade in fiat value
  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)
  console.log('priceImpact', priceImpact)
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

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
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | undefined
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
      ? /* @ts-ignore TYPE NEEDS FIXING */
        parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const userHasSpecifiedInputOutput = Boolean(
    /* @ts-ignore TYPE NEEDS FIXING */
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )

  const routeNotFound = !trade?.route

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  const signatureData = undefined

  const handleApprove = useCallback(async () => {
    await approveCallback()
    // if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
    //   try {
    //     await gatherPermitSignature()
    //   } catch (error) {
    //     // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
    //     if (error?.code !== USER_REJECTED_TRANSACTION) {
    //       await approveCallback()
    //     }
    //   }
    // } else {
    //   await approveCallback()
    // }
  }, [approveCallback])
  // }, [approveCallback, gatherPermitSignature, signatureState])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  // Checks if user has enabled the feature and if the wallet supports it
  const sushiGuardEnabled = useSushiGuardFeature()

  // the callback to execute the swap
  // TODO (amiller68): Investigate useSwapCallback
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    to,
    signatureData,
    /* @ts-ignore TYPE NEEDS FIXING */
    null,
    sushiGuardEnabled
  )

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
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

        gtag(
          'event',
          recipient === null
            ? 'Swap w/o Send'
            : (recipientAddress ?? recipient) === account
            ? 'Swap w/o Send + recipient'
            : 'Swap w/ Send',
          {
            event_category: 'Swap',
            event_label: [
              trade?.inputAmount?.currency?.symbol,
              trade?.outputAmount?.currency?.symbol,
              singleHopOnly ? 'SH' : 'MH',
            ].join('/'),
          }
        )

        gtag('event', singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled', {
          event_category: 'Routing',
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
    swapCallback,
    priceImpact,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade?.inputAmount?.currency?.symbol,
    trade?.outputAmount?.currency?.symbol,
    singleHopOnly,
  ])

  // warnings on slippage
  // const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact
    console.log('Price impact Severity', executionPriceImpact, 'vs', priceImpact)
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    )
  }, [priceImpact, trade])
  console.log('Price impact Severity', priceImpactSeverity)

  const isArgentWallet = useIsArgentWallet()

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
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
    (inputCurrency: Currency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [onCurrencySelection]
  )

  const swapIsUnsupported = useIsSwapUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const priceImpactCss = useMemo(() => {
    switch (priceImpactSeverity) {
      case 0:
      case 1:
      case 2:
      default:
        return 'text-low-emphesis'
      case 3:
        return 'text-yellow'
      case 4:
        return 'text-red'
    }
  }, [priceImpactSeverity])

  return (
    <>
      <NextSeo title="Swap" />
      <ConfirmSwapModal
        isOpen={showConfirm}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        // @ts-ignore TYPE NEEDS FIXING
        recipient={recipient}
        allowedSlippage={allowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
        onDismiss={handleConfirmDismiss}
      />
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
      />

      {/* this is the settings menu */}
      {showSettings ? (
        <SwapLayoutCard>
          <div className="px-2">
            <div className="flex items-center justify-between gap-2 ml-2 mt-1 mb-1">
              <div className="flex mt-4 mb-4">
                <ArrowLeft
                  width={25}
                  onClick={() => setShowSettings(false)}
                  color={'#746AFB'}
                  className="ml-2 cursor-pointer"
                />
                <div className="ml-36 text-white text-lg font-bold"> Settings </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-4 p-3 mt-4">
              <TransactionSettings placeholderSlippage={placeholderSlippage} trident={trident} />
            </div>

            <div className="flex flex-col gap-3 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Typography variant="lg" className="text-high-emphesis" weight={700}>
                    {i18n._(t`Expert mode`)}
                  </Typography>
                  <QuestionHelper
                    text={i18n._(
                      t`Bypasses confirmation modals and allows high slippage trades. Use at your own risk.`
                    )}
                  />
                </div>
                <Switch
                  size="sm"
                  id="toggle-expert-mode-button"
                  checked={expertMode}
                  onChange={
                    expertMode
                      ? () => {
                          toggleExpertMode()
                          setShowConfirmation(false)
                        }
                      : () => {
                          toggle()
                          setShowConfirmation(true)
                        }
                  }
                  checkedIcon={<CheckIcon className="text-dark-700" />}
                  uncheckedIcon={<CloseIcon />}
                  color="purple"
                />
              </div>
              <HeadlessUiModal.Controlled
                isOpen={showConfirmation}
                onDismiss={() => setShowConfirmation(false)}
                maxWidth="md"
              >
                <div className="flex flex-col gap-4">
                  <HeadlessUiModal.Header header={i18n._(t`Confirm`)} onClose={() => setShowConfirmation(false)} />
                  <HeadlessUiModal.BorderedContent className="flex flex-col gap-3">
                    <Typography variant="sm" weight={700} className="text-white">
                      {i18n._(t`Expert mode turns off the confirm transaction prompt and allows high slippage trades
                                that often result in bad rates and lost funds.`)}
                    </Typography>
                  </HeadlessUiModal.BorderedContent>
                  <div className="flex flex-col gap-4 items-center">
                    <div className="flex items-center border p-4 w-11/12 text-xs border-[#E8DB31] text-[#E8DB31] bg-[#E8DB31] bg-opacity-25">
                      <ExclamationIcon className="text-yellow mr-2" width={24} />
                      Only use this mode if you know what you are doing.
                    </div>
                    <Button
                      id="confirm-expert-mode"
                      color="yellow"
                      variant="filled"
                      onClick={() => {
                        toggleExpertMode()
                        setShowConfirmation(false)
                      }}
                    >
                      {i18n._(t`Enable Expert Mode`)}
                    </Button>
                  </div>
                </div>
              </HeadlessUiModal.Controlled>
            </div>
          </div>
        </SwapLayoutCard>
      ) : (
        <SwapLayoutCard>
          <div className="px-2">
            <div className="flex items-center justify-between gap-2 ml-2 mt-1 mb-1">
              <div className="flex mt-4 mb-4">
                <NavLink
                  activeClassName="text-high-emphesis text-lg"
                  href={{
                    pathname: '/swap',
                    query: getQuery(inputCurrency, outputCurrency),
                  }}
                >
                  <Typography weight={700} className="text-secondary cursor-default	">
                    {i18n._(t`Swap`)}
                  </Typography>
                </NavLink>
              </div>
              <CogIcon width={25} onClick={() => setShowSettings(true)} color={'#746AFB'} className="cursor-pointer" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <SwapAssetPanel
              spendFromWallet={true}
              header={SwapAssetPanel.Header}
              currency={currencies[Field.INPUT]}
              value={formattedAmounts[Field.INPUT]}
              onChange={handleTypeInput}
              onSelect={handleInputSelect}
            />
            <div className="z-0 flex justify-center -mt-[30px] -mb-[30px]">
              <div
                role="button"
                /// THIS IS WHERE THE ARROW FOR SWAP DIRECTION IS
                onClick={() => {
                  setApprovalSubmitted(false) // reset 2 step UI for approvals
                  onSwitchTokens()
                }}
              >
                <svg width="40" height="40" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.0918" y="1.74219" width="50.5" height="50.5" rx="5.25" fill="#292929" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M29.7754 41.1587C29.7754 41.849 30.335 42.4087 31.0254 42.4087C31.7157 42.4087 32.2754 41.849 32.2754 41.1587L32.2754 20.6602C32.2754 18.8793 34.4277 17.9866 35.6882 19.2446L38.5091 22.0598C38.9977 22.5475 39.7892 22.5467 40.2768 22.0581C40.7645 21.5694 40.7637 20.778 40.2751 20.2903L31.9084 11.9403C31.4198 11.4526 30.6283 11.4534 30.1406 11.9421C29.989 12.094 29.8846 12.2752 29.8274 12.4674C29.7936 12.5808 29.7754 12.701 29.7754 12.8254L29.7754 41.1587Z"
                    fill="#746AFB"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24.9082 12.8252C24.9082 12.1348 24.3486 11.5752 23.6582 11.5752C22.9678 11.5752 22.4082 12.1348 22.4082 12.8252L22.4082 33.3237C22.4082 35.1045 20.2559 35.9973 18.9954 34.7393L16.1745 31.9241C15.6859 31.4364 14.8944 31.4372 14.4068 31.9258C13.9191 32.4145 13.9199 33.2059 14.4085 33.6936L22.7752 42.0436C23.2638 42.5313 24.0553 42.5305 24.543 42.0418C24.6946 41.8899 24.799 41.7087 24.8562 41.5164C24.89 41.403 24.9082 41.2829 24.9082 41.1585L24.9082 12.8252Z"
                    fill="#746AFB"
                  />
                  <rect
                    x="2.0918"
                    y="1.74219"
                    width="50.5"
                    height="50.5"
                    rx="5.25"
                    stroke="#1A1A1A"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>
            <SwapAssetPanel
              spendFromWallet={true}
              header={SwapAssetPanel.Header}
              currency={currencies[Field.OUTPUT]}
              value={formattedAmounts[Field.OUTPUT]}
              onChange={handleTypeOutput}
              onSelect={handleOutputSelect}
              priceImpact={priceImpact}
              priceImpactCss={priceImpactCss}
            />
            {sushiGuardEnabled && <SwapGasFeeInputs />}
            {isExpertMode && <RecipientField recipient={recipient} action={setRecipient} />}
            {Boolean(trade) && (
              <SwapDetails
                inputCurrency={currencies[Field.INPUT]}
                outputCurrency={currencies[Field.OUTPUT]}
                trade={trade}
                recipient={recipient ?? undefined}
              />
            )}
            {trade && routeNotFound && userHasSpecifiedInputOutput && (
              <Typography variant="xs" className="py-2 text-center">
                {i18n._(t`Insufficient liquidity for this trade.`)}{' '}
                {singleHopOnly && i18n._(t`Try enabling multi-hop trades`)}
              </Typography>
            )}

            {swapIsUnsupported ? (
              <Button color="red" disabled fullWidth className="">
                {i18n._(t`Unsupported Asset`)}
              </Button>
            ) : !account ? (
              <div className="flex flex-col items-center">
                <Web3Connect color="blue" variant="filled" fullWidth />
                <a href="https://ethereum.org/wallets/" className="flex text-[#746AFB] text-sm font-bold">
                  Learn more about wallets
                </a>
              </div>
            ) : showWrap ? (
              <Button
                fullWidth
                color="blue"
                disabled={Boolean(wrapInputError)}
                onClick={onWrap}
                className="rounded-2xl md:rounded"
              >
                {wrapInputError ??
                  (wrapType === WrapType.WRAP
                    ? i18n._(t`Wrap`)
                    : wrapType === WrapType.UNWRAP
                    ? i18n._(t`Unwrap`)
                    : null)}
              </Button>
            ) : showApproveFlow ? (
              <div>
                {approvalState !== ApprovalState.APPROVED && (
                  <Button
                    fullWidth
                    loading={approvalState === ApprovalState.PENDING}
                    onClick={handleApprove}
                    disabled={approvalState !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                    className="rounded-2xl md:rounded"
                  >
                    {i18n._(t`Approve ${currencies[Field.INPUT]?.symbol}`)}
                  </Button>
                )}
                {approvalState === ApprovalState.APPROVED && (
                  <Button
                    color={isValid && priceImpactSeverity > 2 ? 'red' : 'blue'}
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap()
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        })
                      }
                    }}
                    fullWidth
                    id="swap-button"
                    disabled={
                      !isValid || approvalState !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                    }
                    className="rounded-2xl md:rounded"
                  >
                    {priceImpactSeverity > 3 && !isExpertMode
                      ? i18n._(t`Price Impact High`)
                      : priceImpactSeverity > 2
                      ? i18n._(t`Swap Anyway`)
                      : i18n._(t`Swap`)}
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center p-3">
                <Button
                  color={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'red' : 'gradient'}
                  fullWidth
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      })
                    }
                  }}
                  id="swap-button"
                  disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                >
                  {swapInputError
                    ? swapInputError
                    : priceImpactSeverity > 3 && !isExpertMode
                    ? i18n._(t`Price Impact Too High`)
                    : priceImpactSeverity > 2
                    ? i18n._(t`Swap Anyway`)
                    : i18n._(t`Swap`)}
                </Button>
              </div>
            )}
            {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            {swapIsUnsupported ? (
              <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
            ) : null}
          </div>
        </SwapLayoutCard>
      )}

      <Banner banners={banners} />
    </>
  )
}

Swap.Layout = SwapLayout('swap-page')
export default Swap
