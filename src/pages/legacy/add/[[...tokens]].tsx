import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { CogIcon } from '@heroicons/react/outline'
import { CheckIcon, ExclamationIcon, PlusIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import CloseIcon from 'app/components/CloseIcon'
import DoubleCurrencyLogo from 'app/components/DoubleLogo'
import { HeadlessUiModal } from 'app/components/Modal'
import QuestionHelper from 'app/components/QuestionHelper'
import Switch from 'app/components/Switch'
import TransactionSettings from 'app/components/TransactionSettings'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { ZERO_PERCENT } from 'app/constants'
import { ConfirmAddModalBottom } from 'app/features/legacy/liquidity/ConfirmAddModalBottom'
import LiquidityPrice from 'app/features/legacy/liquidity/LiquidityPrice'
import UnsupportedCurrencyFooter from 'app/features/legacy/swap/UnsupportedCurrencyFooter'
import HeaderNew from 'app/features/trade/HeaderNew'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { classNames } from 'app/functions'
import { currencyId } from 'app/functions/currency'
import { calculateGasMargin, calculateSlippageAmount } from 'app/functions/trade'
import { useCurrency } from 'app/hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { useRouterContract } from 'app/hooks/useContract'
import { useIsSwapUnsupported } from 'app/hooks/useIsSwapUnsupported'
import useTransactionDeadline from 'app/hooks/useTransactionDeadline'
import { PairState } from 'app/hooks/useV2Pairs'
import { SwapLayout, SwapLayoutCard } from 'app/layouts/SwapLayout'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'app/modals/TransactionConfirmationModal'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { useToggleSettingsMenu } from 'app/state/application/hooks'
import { useAppSelector } from 'app/state/hooks'
import { Field } from 'app/state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'app/state/mint/hooks'
import { selectSlippage } from 'app/state/slippage/slippageSlice'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useExpertModeManager } from 'app/state/user/hooks'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useState } from 'react'
import { ArrowLeft } from 'react-feather'
// TODO / Note (amiller68) - #SdkChange / #SdkPublish
import { Currency, currencyEquals, WNATIVE } from 'sdk'

type Props = {
  placeholderSlippage?: Percent
  trident?: boolean
  className?: string
}
const Add = ({ placeholderSlippage, trident = false, className }: Props) => {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = (tokens as string[]) || [undefined, undefined]
  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const toggle = useToggleSettingsMenu()

  const oneCurrencyIsWNative = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WNATIVE[chainId])) ||
        (currencyB && currencyEquals(currencyB, WNATIVE[chainId])))
  )

  const [isExpertMode] = useExpertModeManager()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)
  const [showSettings, setShowSettings] = React.useState(false)
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings

  const allowedSlippage = useAppSelector(selectSlippage)

  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const routerContract = useRouterContract()

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], routerContract?.address)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], routerContract?.address)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account || !routerContract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts

    // console.log({ parsedAmountA, parsedAmountB, currencyA, currencyB, deadline })

    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA.isNative || currencyB.isNative) {
      const tokenBIsETH = currencyB.isNative
      estimate = routerContract.estimateGas.addLiquidityETH
      method = routerContract.addLiquidityETH
      args = [
        (tokenBIsETH ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).quotient.toString())
    } else {
      estimate = routerContract.estimateGas.addLiquidity
      method = routerContract.addLiquidity
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: i18n._(
              t`Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
                currencies[Field.CURRENCY_A]?.symbol
              } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`
            ),
          })

          setTxHash(response.hash)

          gtag('event', 'Add', {
            event_category: 'Liquidity',
            event_label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/'),
          })
        })
      )
      .catch((error) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== USER_REJECTED_TX) {
          console.error(error)
        }
      })
  }

  const ModalHeader = noLiquidity ? (
    <div className="pb-4">
      <div className="flex items-center justify-start gap-3">
        <div className="text-2xl font-bold text-high-emphesis">
          {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
        </div>
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={48} />
      </div>
    </div>
  ) : (
    <div className="pb-4">
      <div className="flex items-center justify-start gap-3">
        <div className="text-xl font-bold md:text-3xl text-high-emphesis">{liquidityMinted?.toSignificant(6)}</div>
        <div className="grid grid-flow-col gap-2">
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={48} />
        </div>
      </div>
      <div className="text-lg font-medium md:text-2xl text-high-emphesis">
        {currencies[Field.CURRENCY_A]?.symbol}/{currencies[Field.CURRENCY_B]?.symbol}
        &nbsp;{i18n._(t`Pool Tokens`)}
      </div>
      <div className="pt-3 text-xs italic text-secondary">
        {i18n._(t`Output is estimated. If the price changes by more than ${allowedSlippage.toSignificant(
          4
        )}% your transaction
            will revert.`)}
      </div>
    </div>
  )

  const ModalBottom = (
    <ConfirmAddModalBottom
      price={price}
      currencies={currencies}
      parsedAmounts={parsedAmounts}
      noLiquidity={noLiquidity}
      onAdd={onAdd}
      poolTokenPercentage={poolTokenPercentage}
    />
  )

  const pendingText = i18n._(
    t`Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
      currencies[Field.CURRENCY_A]?.symbol
    } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`
  )

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        router.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else {
        router.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, router, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          router.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        router.push(`/add/${currencyIdA ? currencyIdA : 'ETH'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, router, currencyIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsSwapUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  return (
    <>
      <NextSeo title={`Add Liquidity`} />
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={
          <ConfirmationModalContent
            title={noLiquidity ? i18n._(t`You are creating a pool`) : i18n._(t`You will receive`)}
            onDismiss={handleDismissConfirmation}
            topContent={ModalHeader}
            bottomContent={ModalBottom}
          />
        }
        pendingText={pendingText}
      />
      {showSettings ? (
        <SwapLayoutCard>
          <>
            <div className="flex flex-row">
              <ArrowLeft
                width={25}
                onClick={() => setShowSettings(false)}
                color={'#746AFB'}
                className="ml-2 cursor-pointer"
              />
              <div className="ml-36 text-white text-lg font-bold"> Settings </div>
            </div>
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
            </div>
          </>
          <div className={classNames(className, 'flex items-center justify-center w-10 h-10 rounded-full')}></div>
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
        </SwapLayoutCard>
      ) : (
        <SwapLayoutCard>
          <div className="flex flex-row p-1 ">
            <HeaderNew />
            <CogIcon
              width={25}
              onClick={() => setShowSettings(true)}
              color={'#746AFB'}
              className="relative ml-[275px] cursor-pointer"
            />
          </div>
          <div className="grid items-center grid-cols-3">{/* add Liquidity */}</div>
          <div className="flex flex-col gap-3">
            <SwapAssetPanel
              header={SwapAssetPanel.Header}
              spendFromWallet={true}
              value={formattedAmounts[Field.CURRENCY_A]}
              onChange={onFieldAInput}
              onSelect={handleCurrencyASelect}
              currency={currencies[Field.CURRENCY_A]}
            />
          </div>
          <div className="z-0 flex justify-center -mt-6 -mb-6">
            <div className="p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700 hover:border-dark-600">
              <PlusIcon width={14} className="text-high-emphesis hover:text-white" />
            </div>
          </div>
          <SwapAssetPanel
            header={SwapAssetPanel.Header}
            spendFromWallet={true}
            value={formattedAmounts[Field.CURRENCY_B]}
            onChange={onFieldBInput}
            onSelect={handleCurrencyBSelect}
            currency={currencies[Field.CURRENCY_B]}
          />
          {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
            <LiquidityPrice
              currencies={currencies}
              //@ts-ignore
              price={price}
              noLiquidity={noLiquidity}
              poolTokenPercentage={poolTokenPercentage}
              className="bg-dark-900"
            />
          )}

          {addIsUnsupported ? (
            <Button color="red" disabled fullWidth className="rounded-2xl md:rounded">
              {i18n._(t`Unsupported Asset`)}
            </Button>
          ) : !account ? (
            <div className="flex flex-col items-center">
              <Web3Connect color="purple" variant="filled" fullWidth />
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center">
              {approvalA !== ApprovalState.APPROVED && approvalA !== ApprovalState.UNKNOWN && (
                <Button
                  loading={approvalA === ApprovalState.PENDING}
                  fullWidth
                  onClick={approveACallback}
                  disabled={approvalA === ApprovalState.PENDING}
                  className="rounded-2xl md:rounded"
                >
                  {i18n._(t`Approve ${currencies[Field.CURRENCY_A]?.symbol}`)}
                </Button>
              )}
              {approvalB !== ApprovalState.APPROVED && approvalB !== ApprovalState.UNKNOWN && (
                <Button
                  loading={approvalB === ApprovalState.PENDING}
                  fullWidth
                  onClick={approveBCallback}
                  disabled={approvalB === ApprovalState.PENDING}
                  className="rounded-2xl md:rounded"
                >
                  {i18n._(t`Approve ${currencies[Field.CURRENCY_B]?.symbol}`)}
                </Button>
              )}

              <Button
                fullWidth
                onClick={() => {
                  isExpertMode ? onAdd() : setShowConfirm(true)
                }}
                disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                className="rounded-2xl md:rounded"
              >
                {error ?? i18n._(t`Add Liquidity`)}
              </Button>
            </div>
          )}

          {addIsUnsupported && (
            <UnsupportedCurrencyFooter currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]} />
          )}
        </SwapLayoutCard>
      )}

      {noLiquidity && (
        <Typography variant="xs" className="px-10 mt-5 text-center text-yellow">
          {i18n._(
            t`When creating a pair you are the first liquidity provider. The ratio of tokens you add will set the price of this pool. Once you are happy with the rate, click supply to review`
          )}
        </Typography>
      )}
      <Typography variant="xs" className="px-10 mt-5 text-center text-low-emphesis">
        <Typography variant="xs" weight={700} component="span">
          Tip
        </Typography>
        :
        {i18n._(
          t`By adding liquidity you'll earn 0.25% of all trades on this pair
          proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be
          claimed by withdrawing your liquidity.`
        )}
      </Typography>
    </>
  )
}
export default Add
Add.Layout = SwapLayout('add-page')
