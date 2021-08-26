import { atom, selector } from 'recoil'
import { ConstantProductPoolState } from '../../../../../hooks/useTridentClassicPools'
import { ConstantProductPool, Currency, CurrencyAmount, JSBI, Pair } from '../../../../../../../sushiswap-sdk'
import { LiquidityMode } from '../../../types'
import { tryParseAmount } from '../../../../../functions'
import { PairState } from '../../../../../hooks/useV2Pairs'
import { Field } from '../../../../../state/trident/add/classic'

const ZERO = JSBI.BigInt(0)

export const poolAtom = atom<[PairState, Pair | null]>({
  key: 'poolAtom',
  default: [null, null],
})

export const currenciesAtom = atom<Currency[]>({
  key: 'currencies',
  default: [],
})

export const liquidityModeAtom = atom<LiquidityMode>({
  key: 'liquidityMode',
  default: LiquidityMode.STANDARD,
})

export const spendFromWalletAtom = atom<boolean>({
  key: 'spendFromWalletAtom',
  default: true,
})

export const totalSupplyAtom = atom<CurrencyAmount<Currency>>({
  key: 'totalSupplyAtom',
  default: null,
})

export const noLiquiditySelector = selector<boolean>({
  key: 'noLiquiditySelector',
  get: ({ get }) => {
    const [poolState, pool] = get(poolAtom)
    const totalSupply = get(totalSupplyAtom)

    return (
      poolState === PairState.NOT_EXISTS ||
      Boolean(totalSupply && JSBI.equal(totalSupply.quotient, ZERO)) ||
      Boolean(
        poolState === PairState.EXISTS &&
          pool &&
          JSBI.equal(pool.reserve0.quotient, ZERO) &&
          JSBI.equal(pool.reserve1.quotient, ZERO)
      )
    )
  },
})

export const inputFieldAtom = atom<Field>({
  key: 'inputFieldAtom',
  default: Field.CURRENCY_A,
})

export const formattedAmountsSelector = selector<[string, string]>({
  key: 'formattedAmountsSelector',
  get: ({ get }) => {
    const inputField = get(inputFieldAtom)
    return [
      inputField === Field.CURRENCY_A ? get(mainInputAtom) : get(mainInputCurrencyAmountSelector)?.toSignificant(6),
      inputField === Field.CURRENCY_B
        ? get(secondaryInputAtom)
        : get(secondaryInputCurrencyAmountSelector)?.toSignificant(6),
    ]
  },
})

export const parsedAmountsSelector = selector<[CurrencyAmount<Currency>, CurrencyAmount<Currency>]>({
  key: 'parsedAmountsSelector',
  get: ({ get }) => {
    return [get(mainInputCurrencyAmountSelector), get(secondaryInputCurrencyAmountSelector)]
  },
})

export const mainInputAtom = atom<string>({
  key: 'mainInputAtom',
  default: '',
})

export const mainInputCurrencyAmountSelector = selector<CurrencyAmount<Currency>>({
  key: 'mainInputCurrencyAmountSelector',
  get: ({ get }) => {
    const value = get(mainInputAtom)
    const currencies = get(currenciesAtom)
    return tryParseAmount(value, currencies[0]?.wrapped)
  },
})

export const secondaryInputAtom = atom<string>({
  key: 'secondaryInputAtom',
  default: '',
})

export const secondaryInputSelector = selector<string>({
  key: 'secondaryInputSelector',
  get: ({ get }) => {
    return get(secondaryInputCurrencyAmountSelector)?.toExact()
  },
  set: ({ get, set }, newValue: string) => {
    const currencies = get(currenciesAtom)
    const tokenAmount = tryParseAmount(newValue, currencies[1]?.wrapped)
    set(secondaryInputCurrencyAmountSelector, tokenAmount)
    set(secondaryInputAtom, newValue)
  },
})

export const secondaryInputCurrencyAmountSelector = selector<CurrencyAmount<Currency>>({
  key: 'secondaryInputCurrencyAmountSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const mainInputCurrencyAmount = get(mainInputCurrencyAmountSelector)
    const noLiquidity = get(noLiquiditySelector)

    // we wrap the currencies just to get the price in terms of the other token
    if (!noLiquidity) {
      const [tokenA, tokenB] = [pool?.token0?.wrapped, pool?.token1?.wrapped]
      if (tokenA && tokenB && mainInputCurrencyAmount?.wrapped && pool) {
        const dependentTokenAmount = pool.priceOf(tokenA).quote(mainInputCurrencyAmount?.wrapped)
        return pool?.token1?.isNative
          ? CurrencyAmount.fromRawAmount(pool?.token1, dependentTokenAmount.quotient)
          : dependentTokenAmount
      }
    }

    return undefined
  },
  set: ({ set, get }, newValue: CurrencyAmount<Currency>) => {
    const [, pool] = get(poolAtom)
    const noLiquidity = get(noLiquiditySelector)

    if (!noLiquidity) {
      const [tokenA, tokenB] = [pool?.token0?.wrapped, pool?.token1?.wrapped]
      if (tokenA && tokenB && newValue?.wrapped && pool) {
        const dependentTokenAmount = pool.priceOf(tokenB).quote(newValue?.wrapped)
        set(mainInputAtom, dependentTokenAmount?.toExact())
      }
    }

    return undefined
  },
})
