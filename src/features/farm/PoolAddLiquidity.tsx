import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Currency, CurrencyAmount, currencyEquals, NATIVE, Percent, WNATIVE } from '@sushiswap/sdk'
import React, { useCallback, useState } from 'react'
import ReactGA from 'react-ga'
import Button, { ButtonError } from '../../components/Button'
import Dots from '../../components/Dots'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import Web3Connect from '../../components/Web3Connect'
import { ZERO_PERCENT } from '../../constants'
import { calculateGasMargin, calculateSlippageAmount, maxAmountSpend } from '../../functions'
import { ApprovalState, useActiveWeb3React, useApproveCallback, useRouterContract } from '../../hooks'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../modals/TransactionConfirmationModal'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useExpertModeManager, useUserSlippageToleranceWithDefault } from '../../state/user/hooks'
import { ConfirmAddModalBottom } from '../liquidity/ConfirmAddModalBottom'
import CurrencyInputPanel from './CurrencyInputPanel'

const DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

const PoolDeposit = ({ currencyA, currencyB }) => {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()

  const [useETH, setUseETH] = chainId != ChainId.CELO ? useState(true) : useState(false)

  chainId && useETH && currencyA && currencyEquals(currencyA, WNATIVE[chainId]) && (currencyA = NATIVE[chainId])
  chainId && useETH && currencyB && currencyEquals(currencyB, WNATIVE[chainId]) && (currencyB = NATIVE[chainId])

  const oneCurrencyIsETH = currencyA?.isNative || currencyB?.isNative

  const oneCurrencyIsWETH = Boolean(
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
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings

  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE) // custom from users

  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {}
  )

  const routerContract = useRouterContract()

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], routerContract?.address)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], routerContract?.address)

  const currencyAFiatValue = useUSDCValue(parsedAmounts[Field.CURRENCY_A] ?? currencyBalances[Field.CURRENCY_A])
  const currencyBFiatValue = useUSDCValue(parsedAmounts[Field.CURRENCY_B] ?? currencyBalances[Field.CURRENCY_B])

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account || !routerContract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts

    console.log({ parsedAmountA, parsedAmountB, currencyA, currencyB, deadline })

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

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/'),
          })
        })
      )
      .catch((error) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const modalHeader = () => {
    return noLiquidity ? (
      <div className="pb-4">
        <div className="flex items-center justify-start gap-3">
          <div className="text-2xl font-bold text-high-emphesis">
            {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
          </div>
          <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={48} />
        </div>
      </div>
    ) : (
      <div className="pb-4">
        <div className="flex items-center justify-start gap-3">
          <div className="text-xl font-bold md:text-3xl text-high-emphesis">{liquidityMinted?.toSignificant(6)}</div>
          <div className="grid grid-flow-col gap-2">
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={48} />
          </div>
        </div>
        <div className="text-lg font-medium md:text-2xl text-high-emphesis">
          {currencies[Field.CURRENCY_A]?.symbol}/{currencies[Field.CURRENCY_B]?.symbol}
          &nbsp;{i18n._(t`Pool Tokens`)}
        </div>
        <div className="pt-3 text-xs italic text-secondary">
          {i18n._(
            t`Output is estimated. If the price changes by more than ${allowedSlippage.toSignificant(
              4
            )}% your transaction will revert.`
          )}
        </div>
      </div>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = i18n._(
    t`Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
      currencies[Field.CURRENCY_A]?.symbol
    } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`
  )

  return (
    <div>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() => (
          <ConfirmationModalContent
            title={noLiquidity ? i18n._(t`You are creating a pool`) : i18n._(t`You will receive`)}
            onDismiss={handleDismissConfirmation}
            topContent={modalHeader}
            bottomContent={modalBottom}
          />
        )}
        pendingText={pendingText}
      />
      <div className="flex flex-col space-y-4">
        <CurrencyInputPanel
          value={formattedAmounts[Field.CURRENCY_A]}
          currency={currencyA}
          id="add-liquidity-input-tokena"
          showMaxButton
          onUserInput={onFieldAInput}
          onMax={() => {
            onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
          }}
          currencyBalance={currencyBalances[Field.CURRENCY_A]}
          fiatValue={currencyAFiatValue}
        />
        <div>
          <CurrencyInputPanel
            value={formattedAmounts[Field.CURRENCY_B]}
            currency={currencyB}
            id="add-liquidity-input-tokenb"
            showMaxButton
            onUserInput={onFieldBInput}
            onMax={() => {
              onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
            }}
            currencyBalance={currencyBalances[Field.CURRENCY_B]}
            fiatValue={currencyBFiatValue}
          />
          {(oneCurrencyIsETH || oneCurrencyIsWETH) && chainId != ChainId.CELO && (
            <a
              className="cursor-pointer text-baseline text-blue opacity-80 hover:opacity-100 whitespace-nowrap"
              onClick={() => setUseETH(!useETH)}
            >
              {i18n._(t`Use`)} {useETH && 'W'}
              {NATIVE[chainId].symbol}
            </a>
          )}
        </div>
        <div>
          {!account ? (
            <Web3Connect size="lg" color="blue" className="w-full" />
          ) : isValid &&
            (approvalA === ApprovalState.NOT_APPROVED ||
              approvalA === ApprovalState.PENDING ||
              approvalB === ApprovalState.NOT_APPROVED ||
              approvalB === ApprovalState.PENDING) ? (
            <div className="flex space-x-4">
              {approvalA !== ApprovalState.APPROVED && (
                <Button
                  color="gradient"
                  size="lg"
                  onClick={approveACallback}
                  disabled={approvalA === ApprovalState.PENDING}
                  style={{
                    width: approvalB !== ApprovalState.APPROVED ? '48%' : '100%',
                  }}
                >
                  {approvalA === ApprovalState.PENDING ? (
                    <Dots>{i18n._(t`Approving ${currencies[Field.CURRENCY_A]?.symbol}`)}</Dots>
                  ) : (
                    i18n._(t`Approve ${currencies[Field.CURRENCY_A]?.symbol}`)
                  )}
                </Button>
              )}
              {approvalB !== ApprovalState.APPROVED && (
                <Button
                  color="gradient"
                  size="lg"
                  onClick={approveBCallback}
                  disabled={approvalB === ApprovalState.PENDING}
                  style={{
                    width: approvalA !== ApprovalState.APPROVED ? '48%' : '100%',
                  }}
                >
                  {approvalB === ApprovalState.PENDING ? (
                    <Dots>{i18n._(t`Approving ${currencies[Field.CURRENCY_B]?.symbol}`)}</Dots>
                  ) : (
                    i18n._(t`Approve ${currencies[Field.CURRENCY_B]?.symbol}`)
                  )}
                </Button>
              )}
            </div>
          ) : (
            <ButtonError
              onClick={() => {
                isExpertMode ? onAdd() : setShowConfirm(true)
              }}
              disabled={!isValid || attemptingTxn}
              error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
            >
              {error ?? i18n._(t`Confirm Adding Liquidity`)}
            </ButtonError>
          )}
        </div>
      </div>
    </div>
  )
}

export default PoolDeposit
