import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'
import { PairState } from '../../../../../hooks/useV2Pairs'
import { Currency, Pair, Percent, Price } from '@sushiswap/sdk'
import {
  attemptingTxnAtom,
  currenciesAtom,
  noLiquiditySelector,
  poolBalanceAtom,
  totalSupplyAtom,
  txHashAtom,
} from '../../../context/atoms'
import { useCallback, useMemo } from 'react'
import { ApprovalState, useActiveWeb3React, useApproveCallback, useRouterContract } from '../../../../../hooks'
import useTransactionDeadline from '../../../../../hooks/useTransactionDeadline'
import { useUserSlippageToleranceWithDefault } from '../../../../../state/user/hooks'
import { useTransactionAdder } from '../../../../../state/transactions/hooks'
import { Field } from '../../../../../state/burn/actions'
import { calculateGasMargin, calculateSlippageAmount } from '../../../../../functions'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import ReactGA from 'react-ga'
import { SignatureData, useV2LiquidityTokenPermit } from '../../../../../hooks/useERC20Permit'

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export const poolAtom = atom<[PairState, Pair | null]>({
  key: 'poolAtom',
  default: [null, null],
})

export const percentageAmountAtom = atom<string>({
  key: 'percentageAmountAtom',
  default: '',
})

export const outputTokenAddressAtom = atom<string>({
  key: 'outputTokenAddressAtom',
  default: '',
})

export const permitAtom = atom<SignatureData>({
  key: 'permitAtom',
  default: null,
})

export const currentLiquidityValueSelector = selector({
  key: 'currentLiquidityValueSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const poolBalance = get(poolBalanceAtom)
    const totalSupply = get(totalSupplyAtom)

    if (pool && totalSupply && poolBalance) {
      return [
        pool.getLiquidityValue(pool.token0, totalSupply.wrapped, poolBalance.wrapped, false),
        pool.getLiquidityValue(pool.token1, totalSupply.wrapped, poolBalance.wrapped, false),
      ]
    } else {
      return [undefined, undefined]
    }
  },
})

export const priceSelector = selector<Price<Currency, Currency>>({
  key: 'priceSelector',
  get: ({ get }) => {
    const noLiquidity = get(noLiquiditySelector)
    const [currencyAAmount, currencyBAmount] = get(parsedInputAmountsSelector)

    if (noLiquidity) {
      if (currencyAAmount?.greaterThan(0) && currencyBAmount?.greaterThan(0)) {
        const value = currencyBAmount.divide(currencyAAmount)
        return new Price(currencyAAmount.currency, currencyBAmount.currency, value.denominator, value.numerator)
      }
    } else {
      const [, pool] = get(poolAtom)
      return pool && currencyAAmount?.wrapped ? pool.priceOf(currencyAAmount?.currency.wrapped) : undefined
    }
    return undefined
  },
})

export const parsedInputAmountsSelector = selector({
  key: 'parsedInputAmountsSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const poolBalance = get(poolBalanceAtom)
    const totalSupply = get(totalSupplyAtom)
    const percentageAmount = get(percentageAmountAtom)

    if (pool && totalSupply && poolBalance) {
      return [
        pool.getLiquidityValue(
          pool.token0,
          totalSupply.wrapped,
          poolBalance.wrapped.multiply(new Percent(percentageAmount, '100')),
          false
        ),
        pool.getLiquidityValue(
          pool.token1,
          totalSupply.wrapped,
          poolBalance.wrapped.multiply(new Percent(percentageAmount, '100')),
          false
        ),
      ]
    } else {
      return [undefined, undefined]
    }
  },
})

export const useClassicRemoveExecute = () => {
  const { chainId, library, account } = useActiveWeb3React()
  const router = useRouterContract()
  const percentageAmount = useRecoilValue(percentageAmountAtom)
  const [currencyA, currencyB] = useRecoilValue(currenciesAtom)
  const [parsedAmountA, parsedAmountB] = useRecoilValue(parsedInputAmountsSelector)
  const deadline = useTransactionDeadline()
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE) // custom from users
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const addTransaction = useTransactionAdder()
  const setTxHash = useSetRecoilState(txHashAtom)
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])
  const permit = useRecoilValue(permitAtom)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const [approval] = useApproveCallback(poolBalance, router?.address)
  const liquidityAmount = useMemo(
    () => poolBalance?.multiply(new Percent(percentageAmount, '100')),
    [percentageAmount, poolBalance]
  )

  const standardModeExecute = useCallback(async () => {
    if (
      !chainId ||
      !library ||
      !account ||
      !deadline ||
      !router ||
      !parsedAmountA ||
      !parsedAmountB ||
      !currencyA ||
      !currencyB ||
      !permit
    )
      throw new Error('missing dependencies')

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, allowedSlippage)[0],
    }

    if (!liquidityAmount) {
      throw new Error('missing liquidity amount')
    }

    const currencyBIsETH = currencyB.isNative
    const oneCurrencyIsETH = currencyA.isNative || currencyBIsETH

    if (!tokenA || !tokenB) {
      throw new Error('could not wrap')
    }

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>

    // We have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
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
      } else {
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

    // We have a signature, use permit versions of remove liquidity
    else if (permit !== null) {
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          permit.deadline,
          false,
          permit.v,
          permit.r,
          permit.s,
        ]
      } else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          permit.deadline,
          false,
          permit.v,
          permit.r,
          permit.s,
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        router.estimateGas[methodName](...args)
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
      await router[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: t`Remove ${parsedAmountA?.toSignificant(3)} ${
              currencyA?.symbol
            } and ${parsedAmountB?.toSignificant(3)} ${currencyB?.symbol}`,
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
  }, [
    account,
    addTransaction,
    allowedSlippage,
    approval,
    chainId,
    currencyA,
    currencyB,
    deadline,
    library,
    liquidityAmount,
    parsedAmountA,
    parsedAmountB,
    router,
    setAttemptingTxn,
    setTxHash,
    permit,
    tokenA,
    tokenB,
  ])

  const zapModeExecute = useCallback(() => {}, [])

  return {
    standardModeExecute,
    zapModeExecute,
  }
}
