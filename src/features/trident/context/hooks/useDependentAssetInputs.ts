import { atom, selector, useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
import { fixedRatioAtom, noLiquiditySelector, poolAtom, spendFromWalletAtom } from '../atoms'
import { ChainId, Currency, CurrencyAmount, WNATIVE, ZERO } from '@sushiswap/core-sdk'
import { useMemo } from 'react'
import { maxAmountSpend, tryParseAmount } from '../../../../functions'
import { useActiveWeb3React } from '../../../../hooks'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useBentoOrWalletBalance } from '../../../../hooks/useBentoOrWalletBalance'

export enum TypedField {
  A,
  B,
}

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
    const mainInputCurrencyAmount = get(mainInputCurrencyAmountSelector)
    const noLiquidity = get(noLiquiditySelector)
    const fixedRatio = get(fixedRatioAtom)

    // If we have liquidity, when a user tries to 'get' this value (by setting mainInput), calculate amount in terms of mainInput amount
    if (!noLiquidity && fixedRatio) {
      const [, pool] = get(poolAtom)
      const [tokenA, tokenB] = [pool?.token0?.wrapped, pool?.token1?.wrapped]

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
    const noLiquidity = get(noLiquiditySelector)
    const typedField = get(typedFieldAtom)
    const fixedRatio = get(fixedRatioAtom)

    // If we have liquidity, when a user tries to 'set' this value, calculate mainInput amount in terms of this amount
    if (!noLiquidity && fixedRatio) {
      const [, pool] = get(poolAtom)
      const [tokenA, tokenB] = [pool?.token0?.wrapped, pool?.token1?.wrapped]
      const newValueCA = tryParseAmount(newValue, pool?.token1)

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

// When adding liquidity, poolAtom is defined and provides us with the tokens
export const useDependentAssetInputs = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [poolState, pool] = useRecoilValue(poolAtom)
  const mainInput = useRecoilState(mainInputAtom)
  const secondaryInput = useRecoilState(secondaryInputSelector)
  const formattedAmounts = useRecoilValue(formattedAmountsSelector)
  const parsedAmounts = useRecoilValue(parsedAmountsSelector)
  const typedField = useRecoilState(typedFieldAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const fixedRatio = useRecoilValue(fixedRatioAtom)
  const spendFromWallet = useRecoilValue(spendFromWalletAtom)
  const currencies = useMemo(() => [pool?.token0, pool?.token1], [pool])
  const balances = useBentoOrWalletBalance(account, currencies, spendFromWallet)
  const usdcA = useUSDCValue(balances?.[0])
  const usdcB = useUSDCValue(balances?.[1])

  const onMax = useRecoilCallback(
    ({ set }) =>
      async () => {
        if (!balances || !usdcA || !usdcB) return
        if (!noLiquidity && fixedRatio) {
          usdcA?.lessThan(usdcB)
            ? set(mainInputAtom, maxAmountSpend(balances[0])?.toExact())
            : set(secondaryInputSelector, maxAmountSpend(balances[1])?.toExact())
        } else {
          set(mainInputAtom, maxAmountSpend(balances[0])?.toExact())
          set(secondaryInputSelector, maxAmountSpend(balances[1])?.toExact())
        }
      },
    [balances, fixedRatio, noLiquidity, usdcA, usdcB]
  )

  const isMax = useMemo(() => {
    if (!balances || !usdcA || !usdcB) return false

    if (!noLiquidity && fixedRatio) {
      return usdcA?.lessThan(usdcB)
        ? parsedAmounts[0]?.equalTo(maxAmountSpend(balances[0]))
        : parsedAmounts[1]?.equalTo(maxAmountSpend(balances[1]))
    } else {
      return (
        parsedAmounts[0]?.equalTo(maxAmountSpend(balances[0])) && parsedAmounts[1]?.equalTo(maxAmountSpend(balances[1]))
      )
    }
  }, [balances, fixedRatio, noLiquidity, parsedAmounts, usdcA, usdcB])

  const insufficientBalance = useMemo(() => {
    return parsedAmounts.find((el, index) => {
      return balances && el ? balances?.[index]?.lessThan(el) : false
    })
  }, [balances, parsedAmounts])

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === 3
    ? i18n._(t`Invalid pool`)
    : !parsedAmounts[0]?.greaterThan(ZERO) || !parsedAmounts[1]?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : insufficientBalance
    ? i18n._(t`Insufficient ${insufficientBalance.currency.symbol} balance`)
    : ''

  return useMemo(
    () => ({
      inputs: [mainInput[0], secondaryInput[0]],
      mainInput,
      secondaryInput,
      formattedAmounts,
      parsedAmounts,
      typedField,
      onMax,
      isMax,
      error,
    }),
    [error, formattedAmounts, isMax, mainInput, onMax, parsedAmounts, secondaryInput, typedField]
  )
}
