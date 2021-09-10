import { ConstantProductPool, Currency, CurrencyAmount, JSBI, Percent, Price } from '@sushiswap/sdk'
import { ONE_HUNDRED_PERCENT, ZERO_PERCENT } from '../../../../../constants'
import { useTransactionAdder } from '../../../../../state/transactions/hooks'
import { atom, selector, useRecoilCallback, useSetRecoilState } from 'recoil'
import {
  attemptingTxnAtom,
  noLiquiditySelector,
  poolBalanceAtom,
  showReviewAtom,
  spendFromWalletAtom,
  totalSupplyAtom,
  txHashAtom,
} from '../../../context/atoms'
import { calculateGasMargin, calculateSlippageAmount, tryParseAmount } from '../../../../../functions'
import { useActiveWeb3React, useBentoBoxContract, useTridentRouterContract } from '../../../../../hooks'
import { ConstantProductPoolState } from '../../../../../hooks/useTridentClassicPools'
import ReactGA from 'react-ga'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useUserSlippageToleranceWithDefault } from '../../../../../state/user/hooks'
import { ethers } from 'ethers'

const DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)
export enum TypedField {
  A,
  B,
}

export const poolAtom = atom<[ConstantProductPoolState, ConstantProductPool | null]>({
  key: 'poolAtom',
  default: [null, null],
})

export const selectedZapCurrencyAtom = atom<Currency>({
  key: 'selectedZapCurrencyAtom',
  default: null,
})

export const zapInputAtom = atom<string>({
  key: 'zapInputAtom',
  default: '',
})

export const mainInputAtom = atom<string>({
  key: 'mainInputAtom',
  default: '',
})

// Just an atom that acts as a copy state to hold a previous value
export const secondaryInputAtom = atom<string>({
  key: 'secondaryInputAtom',
  default: '',
})

export const typedFieldAtom = atom<TypedField>({
  key: 'typedFieldAtom',
  default: TypedField.A,
})

export const secondaryInputSelector = selector<string>({
  key: 'secondaryInputSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const mainInputCurrencyAmount = get(mainInputCurrencyAmountSelector)
    const noLiquidity = get(noLiquiditySelector)
    const [tokenA, tokenB] = [pool?.token0?.wrapped, pool?.token1?.wrapped]

    // If we have liquidity, when a user tries to 'get' this value (by setting mainInput), calculate amount in terms of mainInput amount
    if (!noLiquidity) {
      if (tokenA && tokenB && pool && mainInputCurrencyAmount?.wrapped) {
        const dependentTokenAmount = pool.priceOf(tokenA).quote(mainInputCurrencyAmount?.wrapped)
        return (
          pool?.token1?.isNative
            ? CurrencyAmount.fromRawAmount(pool?.token1, dependentTokenAmount.quotient)
            : dependentTokenAmount
        ).toExact()
      }
    }

    // If we don't have liquidity and we 'get' this value, return previous value as no side effects will happen
    return get(secondaryInputAtom)
  },
  set: ({ set, get }, newValue: string) => {
    const [, pool] = get(poolAtom)
    const [tokenA, tokenB] = [pool?.token0?.wrapped, pool?.token1?.wrapped]
    const noLiquidity = get(noLiquiditySelector)
    const typedField = get(typedFieldAtom)
    const newValueCA = tryParseAmount(newValue, pool?.token1)

    // If we have liquidity, when a user tries to 'set' this value, calculate mainInput amount in terms of this amount
    if (!noLiquidity) {
      if (tokenA && tokenB && pool && newValueCA?.wrapped) {
        const dependentTokenAmount = pool.priceOf(tokenB).quote(newValueCA?.wrapped)
        set(mainInputAtom, dependentTokenAmount?.toExact())
      }

      // Edge case where if we enter 0 on secondary input, also set mainInput to 0
      else if (typedField === TypedField.B) {
        set(mainInputAtom, '')
      }
    }

    // In any case, 'set' this value directly to the atom to keep a copy saved as a string
    set(secondaryInputAtom, newValue)
  },
})

export const mainInputCurrencyAmountSelector = selector<CurrencyAmount<Currency>>({
  key: 'mainInputCurrencyAmountSelector',
  get: ({ get }) => {
    const value = get(mainInputAtom)
    const [, pool] = get(poolAtom)
    return tryParseAmount(value, pool?.token0)
  },
})

export const secondaryInputCurrencyAmountSelector = selector<CurrencyAmount<Currency>>({
  key: 'secondaryInputCurrencyAmountSelector',
  get: ({ get }) => {
    const value = get(secondaryInputSelector)
    const [, pool] = get(poolAtom)
    return tryParseAmount(value, pool?.token1)
  },
})

export const formattedAmountsSelector = selector<[string, string]>({
  key: 'formattedAmountsSelector',
  get: ({ get }) => {
    const inputField = get(typedFieldAtom)
    const [parsedAmountA, parsedAmountB] = get(parsedAmountsSelector)
    return [
      (inputField === TypedField.A ? get(mainInputAtom) : parsedAmountA?.toSignificant(6)) ?? '',
      (inputField === TypedField.B ? get(secondaryInputAtom) : parsedAmountB?.toSignificant(6)) ?? '',
    ]
  },
})

// Derive parsedAmounts from formattedAmounts
export const parsedAmountsSelector = selector<[CurrencyAmount<Currency>, CurrencyAmount<Currency>]>({
  key: 'parsedAmountsSelector',
  get: ({ get }) => {
    return [get(mainInputCurrencyAmountSelector), get(secondaryInputCurrencyAmountSelector)]
  },
})

export const parsedZapAmountSelector = selector<CurrencyAmount<Currency>>({
  key: 'parsedZapAmount',
  get: ({ get }) => {
    const value = get(zapInputAtom)
    const currency = get(selectedZapCurrencyAtom)
    return tryParseAmount(value, currency)
  },
})

export const parsedZapSplitAmountsSelector = selector<[CurrencyAmount<Currency>, CurrencyAmount<Currency>]>({
  key: 'parsedZapSlitAmountsSelector',
  get: ({ get }) => {
    const inputAmount = get(parsedZapAmountSelector)
    return [null, null]
  },
})

export const liquidityMintedSelector = selector({
  key: 'liquidityMintedSelector',
  get: ({ get }) => {
    const [currencyAAmount, currencyBAmount] = get(parsedAmountsSelector)
    const [, pool] = get(poolAtom)
    const totalSupply = get(totalSupplyAtom)

    const [tokenAmountA, tokenAmountB] = [currencyAAmount?.wrapped, currencyBAmount?.wrapped]
    if (pool && totalSupply && tokenAmountA && tokenAmountB) {
      try {
        return pool.getLiquidityMinted(totalSupply?.wrapped, tokenAmountA, tokenAmountB)
      } catch (error) {
        console.error(error)
      }
    }

    return undefined
  },
})

export const poolShareSelector = selector({
  key: 'poolShareSelector',
  get: ({ get }) => {
    const liquidityMinted = get(liquidityMintedSelector)
    const totalSupply = get(totalSupplyAtom)

    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.quotient, totalSupply.add(liquidityMinted).quotient)
    }

    return undefined
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

export const priceImpactSelector = selector({
  key: 'priceImpactSelector',
  get: ({ get }) => {
    const [currencyAAmount, currencyBAmount] = get(parsedAmountsSelector)
    const [wrappedAAmount, wrappedBAmount] = [currencyAAmount?.wrapped, currencyBAmount?.wrapped]

    if (!wrappedAAmount || !wrappedBAmount) return undefined
    if (!currencyAAmount.currency.equals(currencyBAmount.currency)) return undefined
    if (JSBI.equal(wrappedAAmount.quotient, JSBI.BigInt(0))) return undefined
    const pct = ONE_HUNDRED_PERCENT.subtract(wrappedBAmount.divide(wrappedAAmount))
    return new Percent(pct.numerator, pct.denominator)
  },
})

export const currentLiquidityValueSelector = selector({
  key: 'currentLiquidityValueSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const poolBalance = get(poolBalanceAtom)
    const totalSupply = get(totalSupplyAtom)

    if (pool && poolBalance && totalSupply) {
      return [
        pool.getLiquidityValue(pool.token0, totalSupply?.wrapped, poolBalance?.wrapped),
        pool.getLiquidityValue(pool.token1, totalSupply?.wrapped, poolBalance?.wrapped),
      ]
    }

    return [undefined, undefined]
  },
})

export const liquidityValueSelector = selector({
  key: 'liquidityValueSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const [currencyAAmount, currencyBAmount] = get(parsedAmountsSelector)

    if (pool && currencyAAmount && currencyBAmount) {
      const [currentAAmount, currentBAmount] = get(currentLiquidityValueSelector)
      return [
        currentAAmount ? currencyAAmount.add(currentAAmount) : currencyAAmount,
        currentBAmount ? currencyBAmount.add(currentBAmount) : currencyBAmount,
      ]
    }

    return [undefined, undefined]
  },
})

export const useClassicAddExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE) // custom from users
  const addTransaction = useTransactionAdder()
  const router = useTridentRouterContract()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const bentoboxContract = useBentoBoxContract()

  const standardModeExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const [, pool] = await snapshot.getPromise(poolAtom)
        const noLiquidity = await snapshot.getPromise(noLiquiditySelector)
        const [parsedAmountA, parsedAmountB] = await snapshot.getPromise(parsedAmountsSelector)
        const native = await snapshot.getPromise(spendFromWalletAtom)

        if (
          !pool ||
          !chainId ||
          !library ||
          !account ||
          !router ||
          !parsedAmountA ||
          !parsedAmountB ||
          !pool?.token0 ||
          !pool?.token1 ||
          !bentoboxContract
        )
          return

        const amountsMin = [
          calculateSlippageAmount(parsedAmountA, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
          calculateSlippageAmount(parsedAmountB, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
        ]

        const liquidityInput = [
          {
            token: parsedAmountA.currency.wrapped.address,
            native,
            amount: await bentoboxContract.toShare(
              parsedAmountA.currency.wrapped.address,
              amountsMin[0].toString(),
              false
            ),
          },
          {
            token: parsedAmountB.currency.wrapped.address,
            native,
            amount: await bentoboxContract.toShare(
              parsedAmountB.currency.wrapped.address,
              amountsMin[1].toString(),
              false
            ),
          },
        ]

        const encoded = ethers.utils.defaultAbiCoder.encode(['address'], [account])
        const estimate = router.estimateGas.addLiquidity
        const method = router.addLiquidity
        const args = [liquidityInput, '0x9a5bb67bba24c6e64c3c05e3a73e89d2e029080a', 1, encoded]
        const value = parsedAmountA.currency.isNative
          ? { value: amountsMin[0].toString() }
          : parsedAmountB.currency.isNative
          ? { value: amountsMin[1].toString() }
          : {}

        try {
          setAttemptingTxn(true)
          const estimatedGasLimit = await estimate(...args, value)
          const tx = await method(...args, {
            ...value,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })

          setShowReview(false)
          await tx.wait()

          addTransaction(tx, {
            summary: i18n._(
              t`Add ${parsedAmountA.toSignificant(3)} ${
                parsedAmountA.currency.symbol
              } and ${parsedAmountB.toSignificant(3)} ${parsedAmountB.currency.symbol} into ${pool.token0.symbol}/${
                pool.token1.symbol
              }`
            ),
          })

          setAttemptingTxn(false)
          setTxHash(tx.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
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
      allowedSlippage,
      bentoboxContract,
      chainId,
      i18n,
      library,
      router,
      setAttemptingTxn,
      setShowReview,
      setTxHash,
    ]
  )

  const zapModeExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const parsedZapAmount = await snapshot.getPromise(parsedZapAmountSelector)
        const [, pool] = await snapshot.getPromise(poolAtom)
        const noLiquidity = await snapshot.getPromise(noLiquiditySelector)
        const native = await snapshot.getPromise(spendFromWalletAtom)

        if (
          !pool ||
          !chainId ||
          !library ||
          !account ||
          !router ||
          !parsedZapAmount ||
          !pool?.token0 ||
          !pool?.token1 ||
          !bentoboxContract
        )
          return

        const amountMin = calculateSlippageAmount(parsedZapAmount, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0]
        const liquidityInput = [
          {
            token: parsedZapAmount.currency.wrapped.address,
            native,
            amount: await bentoboxContract.toShare(
              parsedZapAmount.currency.wrapped.address,
              amountMin.toString(),
              false
            ),
          },
        ]

        const encoded = ethers.utils.defaultAbiCoder.encode(['address'], [account])
        const estimate = router.estimateGas.addLiquidity
        const method = router.addLiquidity
        const args = [liquidityInput, pool.liquidityToken.address, 1, encoded]
        const value = parsedZapAmount.currency.isNative ? { value: amountMin.toString() } : {}

        try {
          setAttemptingTxn(true)
          const estimatedGasLimit = await estimate(...args, value)
          const tx = await method(...args, {
            ...value,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })

          setShowReview(false)
          await tx.wait()

          addTransaction(tx, {
            summary: i18n._(
              t`Zap ${parsedZapAmount.toSignificant(3)} ${parsedZapAmount.currency.symbol} into ${pool.token0.symbol}/${
                pool.token1.symbol
              }`
            ),
          })

          setAttemptingTxn(false)
          setTxHash(tx.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Zap',
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
      allowedSlippage,
      bentoboxContract,
      chainId,
      i18n,
      library,
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
