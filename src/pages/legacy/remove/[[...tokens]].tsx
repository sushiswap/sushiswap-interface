import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { ChainId, NATIVE, Percent, WNATIVE, WNATIVE_ADDRESS } from '@figswap/core-sdk'
import { CogIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { percentToRemove } from 'app/components/Header/styles'
import Input from 'app/components/Input'
import ListPanel from 'app/components/ListPanel'
import NavLink from 'app/components/NavLink'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { classNames, unwrappedCurrencyAmount } from 'app/functions'
import { calculateGasMargin, calculateSlippageAmount } from 'app/functions/trade'
import { useCurrency } from 'app/hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { usePairContract, useRouterContract } from 'app/hooks/useContract'
import useDebouncedChangeHandler from 'app/hooks/useDebouncedChangeHandler'
import { useV2LiquidityTokenPermit } from 'app/hooks/useERC20Permit'
import useTransactionDeadline from 'app/hooks/useTransactionDeadline'
import { SwapLayout, SwapLayoutCard } from 'app/layouts/SwapLayout'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'app/modals/TransactionConfirmationModal'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { Field } from 'app/state/burn/actions'
import { useBurnActionHandlers, useDerivedBurnInfo } from 'app/state/burn/hooks'
import { useAppSelector } from 'app/state/hooks'
import { selectSlippageWithDefault } from 'app/state/slippage/slippageSlice'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useMemo, useState } from 'react'
import { Plus } from 'react-feather'
const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export default function Remove() {
  const { i18n } = useLingui()
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = tokens || [undefined, undefined]
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  // burn state
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  //show settings
  const [showSettings, setShowSettings] = React.useState(false)

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const deadline = useTransactionDeadline()
  const allowedSlippage = useAppSelector(selectSlippageWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE))

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // router contract
  const routerContract = useRouterContract()

  // allowance handling
  const { gatherPermitSignature, signatureData } = useV2LiquidityTokenPermit(
    parsedAmounts[Field.LIQUIDITY],
    routerContract?.address
  )

  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], routerContract?.address)

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    if (chainId !== ChainId.HARMONY && gatherPermitSignature) {
      try {
        await gatherPermitSignature()
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        /* @ts-ignore TYPE NEEDS FIXING */
        if (error?.code !== USER_REJECTED_TX) {
          await approveCallback()
        }
      }
    } else {
      await approveCallback()
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      return _onUserInput(field, typedValue)
    },
    [_onUserInput]
  )

  // tx sending
  const addTransaction = useTransactionAdder()

  async function onRemove() {
    if (!chainId || !library || !account || !deadline || !router) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB.isNative
    const oneCurrencyIsETH = currencyA.isNative || currencyBIsETH

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString(),
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString(),
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        /* @ts-ignore TYPE NEEDS FIXING */
        routerContract.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((error) => {
            console.error(`estimateGas failed`, methodName, args, error)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      /* @ts-ignore TYPE NEEDS FIXING */
      await routerContract[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: t`Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencyA?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
          })

          setTxHash(response.hash)

          gtag('event', 'Remove', {
            event_category: 'Routing',
            event_label: [currencyA?.symbol, currencyB?.symbol].join('/'),
          })
        })
        .catch((error: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.log(error)
        })
    }
  }

  const ModalHeader = (
    <div className="grid gap-4 pt-3 pb-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CurrencyLogo currency={currencyA} size={48} />
            <div className="text-2xl font-bold text-high-emphesis">
              {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
            </div>
          </div>
          <div className="ml-3 text-2xl font-medium text-high-emphesis">{currencyA?.symbol}</div>
        </div>
        <div className="ml-3 mr-3 min-w-[24px]">
          <Plus size={24} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CurrencyLogo currency={currencyB} size={48} />
            <div className="text-2xl font-bold text-high-emphesis">
              {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
            </div>
          </div>
          <div className="ml-3 text-2xl font-medium text-high-emphesis">{currencyB?.symbol}</div>
        </div>
      </div>
      <div className="justify-start text-sm text-secondary">
        {t`Output is estimated. If the price changes by more than ${allowedSlippage.toSignificant(
          4
        )}% your transaction will revert.`}
      </div>
    </div>
  )

  const ModalBottom = (
    <div className="p-6 mt-0 -m-6 bg-dark-800">
      {pair && (
        <>
          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <div className="text-sm text-high-emphesis">{i18n._(t`Rates`)}</div>
              <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
                {`1 ${currencyA?.symbol} = ${tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} ${
                  currencyB?.symbol
                }`}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
                {`1 ${currencyB?.symbol} = ${tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} ${
                  currencyA?.symbol
                }`}
              </div>
            </div>
          </div>
          <div className="h-px my-6 bg-gray-700" />
        </>
      )}
      <div className="grid gap-1 pb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary">{i18n._(t`${currencyA?.symbol}/${currencyB?.symbol} Burned`)}</div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphasis">
            {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
          </div>
        </div>
      </div>
      <Button
        color="gradient"
        size="lg"
        disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
        onClick={onRemove}
      >
        {i18n._(t`Confirm`)}
      </Button>
    </div>
  )

  const pendingText = i18n._(
    t`Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${currencyA?.symbol} and ${parsedAmounts[
      Field.CURRENCY_B
    ]?.toSignificant(6)} ${currencyB?.symbol}`
  )

  const liquidityPercentChangeCallback = useCallback(
    (value: string) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value)
    },
    [onUserInput]
  )

  const oneCurrencyIsETH = currencyA?.isNative || currencyB?.isNative
  const oneCurrencyIsWETH = Boolean(
    chainId && WNATIVE[chainId] && (currencyA?.equals(WNATIVE[chainId]) || currencyB?.equals(WNATIVE[chainId]))
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    liquidityPercentChangeCallback
  )

  const inputError = +innerLiquidityPercentage > 100 || +innerLiquidityPercentage < 0

  const currencyAmounts = [
    currencyA?.isNative ? unwrappedCurrencyAmount(parsedAmounts[Field.CURRENCY_A]) : parsedAmounts[Field.CURRENCY_A],
    currencyB?.isNative ? unwrappedCurrencyAmount(parsedAmounts[Field.CURRENCY_B]) : parsedAmounts[Field.CURRENCY_B],
  ]

  return (
    <>
      <NextSeo title="Remove Liquidity" />
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash ? txHash : ''}
        content={
          <ConfirmationModalContent
            title={i18n._(t`You will receive`)}
            onDismiss={handleDismissConfirmation}
            topContent={ModalHeader}
            bottomContent={ModalBottom}
          />
        }
        pendingText={pendingText}
      />
      <SwapLayoutCard>
        <div className="px-2">
          <div className="flex items-center justify-between gap-2 ml-2 mt-1 mb-1 cursor-pointer	">
            <div className="flex gap-2 mt-4 mb-4 cursor-pointer">
              <NavLink
                activeClassName="text-high-emphesis text-lg"
                href={{
                  pathname: '/add',
                }}
              >
                <Typography weight={700} className="text-secondary cursor-pointer	hover:text-white">
                  {i18n._(t`Add`)}
                </Typography>
              </NavLink>
              <NavLink
                activeClassName="text-high-emphesis text-lg"
                href={{
                  pathname: '/remove',
                }}
              >
                <Typography weight={700} className="text-secondary cursor-pointer	hover:text-white">
                  {i18n._(t`Remove`)}
                </Typography>
              </NavLink>
            </div>
            <CogIcon width={25} onClick={() => setShowSettings(true)} color={'#746AFB'} className="cursor-pointer" />
          </div>
        </div>

        <div className="flex flex-col gap-3 p-3">
          <div
            className={classNames(
              inputError ? 'border-red/40 hover:border-red' : 'border-[#292929] border-[2px] rounded-sm',
              'flex flex-col gap-1 bg-[#1A1A1A] px-4 py-2 border'
            )}
          >
            <Typography variant="lg" weight={700}>
              {i18n._(t`Percent to remove`)}
            </Typography>
            <div className="flex items-center gap-1">
              <Typography
                weight={700}
                variant="lg"
                className="relative flex items-baseline flex-grow gap-3 overflow-hidden text-high-emphesis"
              >
                <Input.Percent
                  className="leading-[32px] pl-2 focus:placeholder:text-low-emphesis flex-grow w-full text-left bg-[#292929] rounded-sm text-inherit disabled:cursor-not-allowed"
                  value={innerLiquidityPercentage}
                  onUserInput={setInnerLiquidityPercentage}
                  placeholder="0%"
                  id="liquidity-percent"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Typography variant="lg" weight={700} className="font-sans text-white">
                    {i18n._(t`%`)}
                  </Typography>
                </div>
              </Typography>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <div className={percentToRemove}>25%</div>
              <div className={percentToRemove}>50%</div>
              <div className={percentToRemove}>75%</div>
              <div className={percentToRemove}>MAX</div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <svg width="25" height="26" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.1238 30.2C15.6101 30.6781 16.39 30.6781 16.8763 30.2V30.2L30.8923 16.422C31.3846 15.9381 31.3914 15.1466 30.9074 14.6543V14.6543C30.4234 14.162 29.632 14.1552 29.1397 14.6392L24.0542 19.6384C21.5246 22.125 17.2501 20.333 17.2501 16.7859V1.25C17.2501 0.559644 16.6904 0 16.0001 0V0C15.3097 0 14.7501 0.559644 14.7501 1.25V16.7858C14.7501 20.333 10.4755 22.125 7.94594 19.6384L2.86042 14.6392C2.3681 14.1552 1.57667 14.162 1.09271 14.6543V14.6543C0.608755 15.1466 0.61553 15.9381 1.10785 16.422L15.1238 30.2V30.2Z"
                fill="#424242"
              />
            </svg>
          </div>
          <div className="grid grid-col divide-y divide-y-2 divide-[#292929] overflow-hidden border-[#292929] border-[2px] bg-[#1A1A1A] rounded-sm">
            <div className="flex items-center justify-between px-4 py-2 overflow-hidden bg-[#1A1A1A]">
              <Typography variant="lg" weight={700} className="bg-[#1A1A1A]">
                {i18n._(t`You will receive`)}
              </Typography>
              {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) && (
                <Typography variant="xs" weight={700}>
                  {oneCurrencyIsETH ? (
                    <Link
                      href={`/remove/${currencyA?.isNative ? WNATIVE_ADDRESS[chainId] : currencyIdA}/${
                        currencyB?.isNative ? WNATIVE_ADDRESS[chainId] : currencyIdB
                      }`}
                    >
                      <a className="text-baseline text-blue opacity-80 hover:opacity-100 focus:opacity-100 whitespace-nowrap">
                        Receive W{NATIVE[chainId].symbol} instead
                      </a>
                    </Link>
                  ) : (
                    oneCurrencyIsWETH && (
                      <Link
                        href={`/remove/${currencyA?.equals(WNATIVE[chainId]) ? 'ETH' : currencyIdA}/${
                          currencyB?.equals(WNATIVE[chainId]) ? 'ETH' : currencyIdB
                        }`}
                      >
                        <a className="text-baseline text-blue opacity-80 hover:opacity-100 whitespace-nowrap">
                          Receive {NATIVE[chainId].symbol} instead
                        </a>
                      </Link>
                    )
                  )}
                </Typography>
              )}
            </div>
            {currencyAmounts.map((currencyAmount, index) => (
              <ListPanel.CurrencyAmountItem amount={currencyAmount} key={index} size="h3" hideIfZero={false} />
            ))}
          </div>
          {!account ? (
            <Web3Connect size="lg" color="blue" className="w-full" />
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                fullWidth
                loading={approval === ApprovalState.PENDING}
                onClick={onAttemptToApprove}
                disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
              >
                {approval === ApprovalState.APPROVED || signatureData !== null
                  ? i18n._(t`Approved`)
                  : i18n._(t`Approve`)}
              </Button>
              <Button
                fullWidth
                color={
                  !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B] ? 'red' : 'blue'
                }
                onClick={() => {
                  setShowConfirm(true)
                }}
                disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
              >
                {error || i18n._(t`Confirm Withdrawal`)}
              </Button>
            </div>
          )}
        </div>
      </SwapLayoutCard>
    </>
  )
}

Remove.Layout = SwapLayout('remove-page')
