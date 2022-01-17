import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Currency, NATIVE, Percent, WNATIVE, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import { ButtonConfirmed, ButtonError } from 'app/components/Button'
import Button from 'app/components/Button'
import { AutoColumn } from 'app/components/Column'
import Container from 'app/components/Container'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Dots from 'app/components/Dots'
import DoubleGlowShadow from 'app/components/DoubleGlowShadow'
import NavLink from 'app/components/NavLink'
import PercentInputPanel from 'app/components/PercentInputPanel'
import { MinimalPositionCard } from 'app/components/PositionCard'
import { AutoRow, RowBetween } from 'app/components/Row'
import Web3Connect from 'app/components/Web3Connect'
import Header from 'app/features/trade/Header'
import { currencyId } from 'app/functions/currency'
import { calculateGasMargin, calculateSlippageAmount } from 'app/functions/trade'
import { useCurrency } from 'app/hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { usePairContract, useRouterContract } from 'app/hooks/useContract'
import useDebouncedChangeHandler from 'app/hooks/useDebouncedChangeHandler'
import { useV2LiquidityTokenPermit } from 'app/hooks/useERC20Permit'
import useTransactionDeadline from 'app/hooks/useTransactionDeadline'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'app/modals/TransactionConfirmationModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { Field } from 'app/state/burn/actions'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from 'app/state/burn/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useUserSlippageToleranceWithDefault } from 'app/state/user/hooks'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useState } from 'react'
import { Plus } from 'react-feather'
import ReactGA from 'react-ga'

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

const REMOVE_TIPS = {}

export default function Remove() {
  const { i18n } = useLingui()
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = tokens || [undefined, undefined]
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const deadline = useTransactionDeadline()
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE)

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

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
        if (error?.code !== 4001) {
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

  const onLiquidityInput = useCallback(
    (typedValue: string): void => onUserInput(Field.LIQUIDITY, typedValue),
    [onUserInput]
  )
  const onCurrencyAInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_A, typedValue),
    [onUserInput]
  )
  const onCurrencyBInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_B, typedValue),
    [onUserInput]
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

          ReactGA.event({
            category: 'Liquidity',
            action: 'Remove',
            label: [currencyA?.symbol, currencyB?.symbol].join('/'),
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

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        router.push(`/remove/${currencyId(currency)}/${currencyIdA}`)
      } else {
        router.push(`/remove/${currencyId(currency)}/${currencyIdB}`)
      }
    },
    [currencyIdA, currencyIdB, router]
  )

  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        router.push(`/remove/${currencyIdB}/${currencyId(currency)}`)
      } else {
        router.push(`/remove/${currencyIdA}/${currencyId(currency)}`)
      }
    },
    [currencyIdA, currencyIdB, router]
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

  return (
    <Container id="remove-liquidity-page" className="py-4 space-y-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Remove Liquidity | Sushi</title>
        <meta key="description" name="description" content="Remove liquidity from the SushiSwap AMM" />
        <meta key="twitter:description" name="twitter:description" content="Remove liquidity from the SushiSwap AMM" />
        <meta key="og:description" property="og:description" content="Remove liquidity from the SushiSwap AMM" />
      </Head>
      <div className="px-4 mb-5">
        <NavLink href="/pool">
          <a className="flex items-center space-x-2 text-base font-medium text-center cursor-pointer text-secondary hover:text-high-emphesis">
            <span>{i18n._(t`View Liquidity Positions`)}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </NavLink>
      </div>

      <DoubleGlowShadow>
        <div className="p-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
          {/* <AddRemoveTabs
          creating={false}
          adding={false}
          defaultSlippage={DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE}
        /> */}
          <Header input={currencyA} output={currencyB} allowedSlippage={allowedSlippage} />
          <div>
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
            <AutoColumn gap="md">
              {/* <LiquidityHeader input={currencyA} output={currencyB} /> */}

              <div>
                <PercentInputPanel
                  value={innerLiquidityPercentage}
                  onUserInput={setInnerLiquidityPercentage}
                  id="liquidity-percent"
                />

                <AutoColumn justify="space-between" className="py-2.5">
                  <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
                    <button className="z-10 -mt-6 -mb-6 rounded-full cursor-default bg-dark-900 p-3px">
                      <div className="p-3 rounded-full bg-dark-800">
                        <ArrowDownIcon width="32px" height="32px" />
                      </div>
                    </button>
                  </AutoRow>
                </AutoColumn>

                <div id="remove-liquidity-output" className="p-5 rounded bg-dark-800">
                  <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
                    <div className="w-full text-white sm:w-2/5" style={{ margin: 'auto 0px' }}>
                      <AutoColumn>
                        <div>You Will Receive:</div>
                        {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                          <RowBetween className="text-sm">
                            {oneCurrencyIsETH ? (
                              <Link
                                href={`/remove/${currencyA?.isNative ? WNATIVE_ADDRESS[chainId] : currencyIdA}/${
                                  currencyB?.isNative ? WNATIVE_ADDRESS[chainId] : currencyIdB
                                }`}
                              >
                                <a className="text-baseline text-blue opacity-80 hover:opacity-100 focus:opacity-100 whitespace-nowrap">
                                  Receive W{NATIVE[chainId].symbol}
                                </a>
                              </Link>
                            ) : oneCurrencyIsWETH ? (
                              <Link
                                href={`/remove/${currencyA?.equals(WNATIVE[chainId]) ? 'ETH' : currencyIdA}/${
                                  currencyB?.equals(WNATIVE[chainId]) ? 'ETH' : currencyIdB
                                }`}
                              >
                                <a className="text-baseline text-blue opacity-80 hover:opacity-100 whitespace-nowrap">
                                  Receive {NATIVE[chainId].symbol}
                                </a>
                              </Link>
                            ) : null}
                          </RowBetween>
                        ) : null}
                      </AutoColumn>
                    </div>

                    <div className="flex flex-col space-y-3 md:flex-row md:space-x-6 md:space-y-0">
                      <div className="flex flex-row items-center w-full p-3 pr-8 space-x-3 rounded bg-dark-900">
                        <CurrencyLogo currency={currencyA} size="46px" />
                        <AutoColumn>
                          <div className="text-white truncate">{formattedAmounts[Field.CURRENCY_A] || '-'}</div>
                          <div className="text-sm">{currencyA?.symbol}</div>
                        </AutoColumn>
                      </div>
                      <div className="flex flex-row items-center w-full p-3 pr-8 space-x-3 rounded bg-dark-900">
                        <CurrencyLogo currency={currencyB} size="46px" />
                        <AutoColumn>
                          <div className="text-white truncate">{formattedAmounts[Field.CURRENCY_B] || '-'}</div>
                          <div className="text-sm">{currencyB?.symbol}</div>
                        </AutoColumn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                {!account ? (
                  <Web3Connect size="lg" color="blue" className="w-full" />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <ButtonConfirmed
                      onClick={onAttemptToApprove}
                      confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
                      disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                    >
                      {approval === ApprovalState.PENDING ? (
                        <Dots>{i18n._(t`Approving`)}</Dots>
                      ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                        i18n._(t`Approved`)
                      ) : (
                        i18n._(t`Approve`)
                      )}
                    </ButtonConfirmed>
                    <ButtonError
                      onClick={() => {
                        setShowConfirm(true)
                      }}
                      disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                      error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                    >
                      {error || i18n._(t`Confirm Withdrawal`)}
                    </ButtonError>
                  </div>
                )}
              </div>
            </AutoColumn>
          </div>

          {pair ? <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} /> : null}
        </div>
      </DoubleGlowShadow>
    </Container>
  )
}
