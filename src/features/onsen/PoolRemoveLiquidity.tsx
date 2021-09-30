import { TransactionResponse } from '@ethersproject/abstract-provider'
import ReactGA from 'react-ga'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, currencyEquals, NATIVE, Percent, WNATIVE, ZERO } from '@sushiswap/sdk'
import React, { useCallback, useMemo, useState } from 'react'
import { calculateSlippageAmount, calculateGasMargin, classNames } from '../../functions'
import { ApprovalState, useActiveWeb3React, useApproveCallback, usePairContract, useRouterContract } from '../../hooks'
import { useV2LiquidityTokenPermit } from '../../hooks/useERC20Permit'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { Field } from '../../state/burn/actions'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from '../../state/burn/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useUserSlippageToleranceWithDefault } from '../../state/user/hooks'
import useDebouncedChangeHandler from '../../hooks/useDebouncedChangeHandler'
import Button, { ButtonError } from '../../components/Button'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Plus } from 'react-feather'
import Web3Connect from '../../components/Web3Connect'
import Dots from '../../components/Dots'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../modals/TransactionConfirmationModal'
import { FiatValue } from '../../components/CurrencyInputPanel/FiatValue'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import Alert from '../../components/Alert'
import Typography from '../../components/Typography'
import { Input as PercentInput } from '../../components/PercentInput'

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

const PoolWithdraw = ({ currencyA, currencyB }) => {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()

  const [useETH, setUseETH] = useState(false)
  useETH && currencyA && currencyEquals(currencyA, WNATIVE[chainId]) && (currencyA = NATIVE[chainId])
  useETH && currencyB && currencyEquals(currencyB, WNATIVE[chainId]) && (currencyB = NATIVE[chainId])

  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error, userLiquidity } = useDerivedBurnInfo(
    currencyA ?? undefined,
    currencyB ?? undefined
  )
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

  const currencyAFiatValue = useUSDCValue(parsedAmounts[Field.CURRENCY_A])
  const currencyBFiatValue = useUSDCValue(parsedAmounts[Field.CURRENCY_B])

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
    if (!chainId || !library || !account || !deadline || !routerContract) throw new Error('missing dependencies')
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
          console.error(error)
        })
    }
  }

  function modalHeader() {
    return (
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
  }

  function modalBottom() {
    return (
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
            <div className="text-sm text-secondary">
              {currencyA?.symbol}/{currencyB?.symbol} {i18n._(t`Burned`)}
            </div>
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
  }

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

  return (
    <div>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash ? txHash : ''}
        content={() => (
          <ConfirmationModalContent
            title={i18n._(t`You will receive`)}
            onDismiss={handleDismissConfirmation}
            topContent={modalHeader}
            bottomContent={modalBottom}
          />
        )}
        pendingText={pendingText}
      />
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <div id="liquidity-percent" className="p-5 rounded bg-dark-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <div className="whitespace-nowrap">{i18n._(t`Amount to Remove`)}</div>
                <div className="flex items-center w-full space-x-1">
                  <PercentInput
                    className="token-amount-input"
                    value={innerLiquidityPercentage}
                    onUserInput={(val) => {
                      setInnerLiquidityPercentage(val)
                    }}
                    align="right"
                  />
                  <Typography className="text-xl font-bold">%</Typography>
                </div>
              </div>
              <div className="flex justify-end space-x-4 sm:w-full">
                {['25', '50', '75', '100'].map((multipler, i) => (
                  <Button
                    variant="outlined"
                    size="xs"
                    color="pink"
                    key={i}
                    onClick={() => {
                      setInnerLiquidityPercentage(multipler)
                    }}
                    className={classNames(
                      'text-md border border-opacity-50 border-pink focus:ring-pink',
                      multipler === '100' ? '' : 'hidden sm:block'
                    )}
                  >
                    {multipler === '100' ? 'MAX' : multipler + '%'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div>{i18n._(t`You'll Receive:`)}</div>
            {(oneCurrencyIsETH || oneCurrencyIsWETH) && (
              <a
                className="cursor-pointer text-baseline text-blue opacity-80 hover:opacity-100 whitespace-nowrap"
                onClick={() => setUseETH(!useETH)}
              >
                {i18n._(t`Receive`)} {useETH && 'W'}
                {NATIVE[chainId].symbol}
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded bg-dark-900">
              <div>
                <div className="text-secondary">
                  {formattedAmounts[Field.CURRENCY_A] || '-'} {currencyA?.symbol}
                  <FiatValue fiatValue={currencyAFiatValue} />
                </div>
              </div>
              <CurrencyLogo currency={currencyA} size="46px" />
            </div>
            <div className="flex items-center justify-between p-4 rounded bg-dark-900">
              <div className="text-secondary">
                {formattedAmounts[Field.CURRENCY_B] || '-'} {currencyB?.symbol}
                <FiatValue fiatValue={currencyBFiatValue} />
              </div>
              <CurrencyLogo currency={currencyB} size="46px" />
            </div>
          </div>
        </div>
        {userLiquidity?.equalTo(ZERO) && (
          <Alert
            message={i18n._(t`Note: If your SLP is staked, you cannot remove your liquidity. You must unstake first.`)}
            className="mb-4"
            type="information"
          />
        )}
        {!account ? (
          <Web3Connect size="lg" color="blue" className="w-full" />
        ) : isValid && approval !== ApprovalState.APPROVED && signatureData === null ? (
          <Button
            color="gradient"
            size="lg"
            onClick={onAttemptToApprove}
            disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
          >
            {approval === ApprovalState.PENDING ? <Dots>{i18n._(t`Approving`)}</Dots> : i18n._(t`Approve`)}
          </Button>
        ) : (
          <ButtonError
            onClick={() => {
              setShowConfirm(true)
            }}
            disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
            error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
          >
            {error || i18n._(t`Confirm Withdrawal`)}
          </ButtonError>
        )}
      </div>
    </div>
  )
}

export default PoolWithdraw
