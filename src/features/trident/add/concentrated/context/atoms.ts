import { atom, selector } from 'recoil'
import { ConstantProductPoolState } from '../../../../../hooks/useTridentClassicPools'
import { ConstantProductPool, Currency, CurrencyAmount } from '@sushiswap/sdk'
import { noLiquiditySelector } from '../../../context/atoms'
import { tryParseAmount } from '../../../../../functions'
import { TypedField } from '../../classic/context/atoms'

export const poolAtom = atom<[ConstantProductPoolState, ConstantProductPool | null]>({
  key: 'poolAtom',
  default: [null, null],
})

export const minPriceAtom = atom<string>({
  key: 'minPriceAtom',
  default: null,
})

export const maxPriceAtom = atom<string>({
  key: 'maxPriceAtom',
  default: null,
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
