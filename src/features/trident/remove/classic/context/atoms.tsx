import { atom, selector, useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'
import { ConstantProductPool, Currency, CurrencyAmount, JSBI, Percent, Price, Token } from '@sushiswap/sdk'
import {
  attemptingTxnAtom,
  noLiquiditySelector,
  poolBalanceAtom,
  showReviewAtom,
  totalSupplyAtom,
  txHashAtom,
} from '../../../context/atoms'
import { useActiveWeb3React, useBentoBoxContract, useTridentRouterContract } from '../../../../../hooks'
import { useUserSlippageToleranceWithDefault } from '../../../../../state/user/hooks'
import { useTransactionAdder } from '../../../../../state/transactions/hooks'
import { calculateGasMargin, calculateSlippageAmount } from '../../../../../functions'
import { t } from '@lingui/macro'
import ReactGA from 'react-ga'
import { ethers } from 'ethers'
import { useLingui } from '@lingui/react'
import { ConstantProductPoolState } from '../../../../../hooks/useTridentClassicPools'
import { XSUSHI } from '../../../../../config/tokens'

export const poolAtom = atom<[ConstantProductPoolState, ConstantProductPool | null]>({
  key: 'poolAtom',
  default: [null, null],
})

export const percentageAmountAtom = atom<string>({
  key: 'percentageAmountAtom',
  default: '',
})

export const selectedZapCurrencyAtom = atom<Currency>({
  key: 'selectedZapCurrencyAtom',
  default: null,
})

export const outputToWalletAtom = atom<boolean>({
  key: 'outputToWalletAtom',
  default: true,
})

export const slippageAtom = atom<Percent>({
  key: 'slippageAtom',
  default: null,
})

export const parsedZapAmountSelector = selector<CurrencyAmount<Currency>>({
  key: 'parsedZapAmountSelector',
  get: ({ get }) => {
    const poolBalance = get(poolBalanceAtom)
    const allowedSlippage = get(slippageAtom)

    const parsedZapAmount = poolBalance?.multiply(new Percent(get(percentageAmountAtom), '100'))
    if (allowedSlippage && parsedZapAmount) {
      const minAmount = calculateSlippageAmount(parsedZapAmount, allowedSlippage)[0]
      return CurrencyAmount.fromRawAmount(parsedZapAmount.currency, minAmount.toString())
    }

    return undefined
  },
})

export const currentLiquidityValueSelector = selector({
  key: 'currentLiquidityValueSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const poolBalance = get(poolBalanceAtom)
    const totalSupply = get(totalSupplyAtom)

    return [
      pool && totalSupply && poolBalance && JSBI.greaterThanOrEqual(totalSupply.quotient, poolBalance.quotient)
        ? CurrencyAmount.fromRawAmount(
            pool.token0,
            pool.getLiquidityValue(pool.token0, totalSupply.wrapped, poolBalance.wrapped, false).quotient
          )
        : undefined,
      pool && totalSupply && poolBalance && JSBI.greaterThanOrEqual(totalSupply.quotient, poolBalance.quotient)
        ? CurrencyAmount.fromRawAmount(
            pool.token1,
            pool.getLiquidityValue(pool.token1, totalSupply.wrapped, poolBalance.wrapped, false).quotient
          )
        : undefined,
    ]
  },
})

export const priceSelector = selector<Price<Currency, Currency>>({
  key: 'priceSelector',
  get: ({ get }) => {
    const noLiquidity = get(noLiquiditySelector)
    const [currencyAAmount, currencyBAmount] = get(parsedAmountsSelector)

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

export const parsedAmountsSelector = selector({
  key: 'parsedAmountsSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const percentageAmount = get(percentageAmountAtom)
    const currentLiquidityValue = get(currentLiquidityValueSelector)
    const percentage = new Percent(percentageAmount, '100')
    const allowedSlippage = get(slippageAtom)

    const amounts = [
      pool && percentageAmount && percentage.greaterThan('0') && currentLiquidityValue[0]
        ? CurrencyAmount.fromRawAmount(pool.token0, percentage.multiply(currentLiquidityValue[0].quotient).quotient)
        : undefined,
      pool && percentageAmount && percentage.greaterThan('0') && currentLiquidityValue[1]
        ? CurrencyAmount.fromRawAmount(pool.token1, percentage.multiply(currentLiquidityValue[1].quotient).quotient)
        : undefined,
    ]

    if (allowedSlippage && amounts[0] && amounts[1]) {
      const amountsMin = [
        calculateSlippageAmount(amounts[0], allowedSlippage)[0],
        calculateSlippageAmount(amounts[1], allowedSlippage)[0],
      ]

      return [
        CurrencyAmount.fromRawAmount(pool.token0, amountsMin[0].toString()),
        CurrencyAmount.fromRawAmount(pool.token1, amountsMin[1].toString()),
      ]
    }

    return [undefined, undefined]
  },
})

export const useClassicRemoveExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const router = useTridentRouterContract()
  const addTransaction = useTransactionAdder()
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const bentoboxContract = useBentoBoxContract()

  const standardModeExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const [, pool] = await snapshot.getPromise(poolAtom)
        const percentageAmount = await snapshot.getPromise(percentageAmountAtom)
        const [parsedAmountA, parsedAmountB] = await snapshot.getPromise(parsedAmountsSelector)
        const [tokenA, tokenB] = [pool?.token0?.wrapped, pool?.token1?.wrapped]
        const liquidityAmount = poolBalance?.multiply(new Percent(percentageAmount, '100'))
        const outputToWallet = await snapshot.getPromise(outputToWalletAtom)

        if (
          !chainId ||
          !library ||
          !account ||
          !router ||
          !parsedAmountA ||
          !parsedAmountB ||
          !tokenA ||
          !tokenB ||
          !liquidityAmount ||
          !bentoboxContract
        )
          throw new Error('missing dependencies')

        const liquidityOutput = [
          {
            token: parsedAmountA.currency.wrapped.address,
            amount: await bentoboxContract.toShare(
              parsedAmountA.currency.wrapped.address,
              parsedAmountA.quotient.toString(),
              false
            ),
          },
          {
            token: parsedAmountB.currency.wrapped.address,
            amount: await bentoboxContract.toShare(
              parsedAmountB.currency.wrapped.address,
              parsedAmountB.quotient.toString(),
              false
            ),
          },
        ]

        const encoded = ethers.utils.defaultAbiCoder.encode(['address', 'bool'], [account, outputToWallet])
        const estimate = router.estimateGas.burnLiquidity
        const method = router.burnLiquidity
        const args = [pool.liquidityToken.address, liquidityAmount.quotient.toString(), encoded, liquidityOutput]

        try {
          setAttemptingTxn(true)
          const estimatedGasLimit = await estimate(...args, {})
          const tx = await method(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })

          setShowReview(false)
          await tx.wait()

          addTransaction(tx, {
            summary: i18n._(
              t`Remove ${parsedAmountA.toSignificant(3)} ${
                parsedAmountA.currency.symbol
              } and ${parsedAmountB.toSignificant(3)} ${parsedAmountB.currency.symbol} from ${pool.token0.symbol}/${
                pool.token1.symbol
              }`
            ),
          })

          setAttemptingTxn(false)
          setTxHash(tx.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Burn',
            label: [pool.token0.symbol, pool.token1.symbol].join('/'),
          })
        } catch (error) {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        }
      },
    [
      poolBalance,
      chainId,
      library,
      account,
      router,
      bentoboxContract,
      setAttemptingTxn,
      setShowReview,
      addTransaction,
      i18n,
      setTxHash,
    ]
  )

  const zapModeExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const [, pool] = await snapshot.getPromise(poolAtom)
        const percentageAmount = await snapshot.getPromise(percentageAmountAtom)
        const parsedZapAmount = await snapshot.getPromise(parsedZapAmountSelector)
        const [parsedAmountA, parsedAmountB] = await snapshot.getPromise(parsedAmountsSelector)
        const [tokenA, tokenB] = [pool?.token0?.wrapped, pool?.token1?.wrapped]
        const liquidityAmount = poolBalance?.multiply(new Percent(percentageAmount, '100'))
        const outputToWallet = await snapshot.getPromise(outputToWalletAtom)

        if (
          !chainId ||
          !library ||
          !account ||
          !router ||
          !parsedZapAmount ||
          !parsedAmountA ||
          !parsedAmountB ||
          !tokenA ||
          !tokenB ||
          !liquidityAmount ||
          !bentoboxContract
        )
          throw new Error('missing dependencies')

        const liquidityOutput = {
          token: parsedZapAmount.currency.wrapped.address,
          amount: await bentoboxContract.toShare(
            parsedZapAmount.currency.wrapped.address,
            parsedZapAmount.quotient.toString(),
            false
          ),
        }

        const encoded = ethers.utils.defaultAbiCoder.encode(['address', 'bool'], [account, outputToWallet])
        const estimate = router.estimateGas.burnLiquiditySingle
        const method = router.burnLiquiditySingle
        const args = [pool.liquidityToken.address, liquidityAmount.quotient.toString(), encoded, liquidityOutput]

        try {
          setAttemptingTxn(true)
          const estimatedGasLimit = await estimate(...args, {})
          const tx = await method(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })

          setShowReview(false)
          await tx.wait()

          addTransaction(tx, {
            summary: i18n._(
              t`Remove ${parsedAmountA.toSignificant(3)} ${
                parsedAmountA.currency.symbol
              } and ${parsedAmountB.toSignificant(3)} ${parsedAmountB.currency.symbol} from ${pool.token0.symbol}/${
                pool.token1.symbol
              }`
            ),
          })

          setAttemptingTxn(false)
          setTxHash(tx.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Burn',
            label: [pool.token0.symbol, pool.token1.symbol].join('/'),
          })
        } catch (error) {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        }
      },
    [
      account,
      addTransaction,
      bentoboxContract,
      chainId,
      i18n,
      library,
      poolBalance,
      router,
      setAttemptingTxn,
      setShowReview,
      setTxHash,
    ]
  )

  return {
    standardModeExecute,
    zapModeExecute,
  }
}
