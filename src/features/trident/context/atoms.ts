import { Currency, CurrencyAmount, JSBI, Percent, Rebase, Token, ZERO } from '@sushiswap/core-sdk'
import { toAmountCurrencyAmount } from 'app/functions'
import { atom, selector, selectorFamily } from 'recoil'

import { LiquidityMode, PoolAtomType } from '../types'

export const DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)
export const DEFAULT_REMOVE_V2_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

export const poolAtom = atom<PoolAtomType>({
  key: 'poolAtom',
  default: {},
})

export const showReviewAtom = atom<boolean>({
  key: 'showReviewAtom',
  default: false,
})

export const attemptingTxnAtom = atom<boolean>({
  key: 'attemptingTxnAtom',
  default: false,
})

export const totalSupplyAtom = atom<CurrencyAmount<Token> | undefined>({
  key: 'totalSupplyAtom',
  default: undefined,
})

export const poolBalanceAtom = atom<CurrencyAmount<Token> | undefined>({
  key: 'poolBalanceAtom',
  default: undefined,
})

export const currenciesAtom = atom<Currency[]>({
  key: 'currenciesAtom',
  default: [],
})

export const bentoboxRebasesAtom = atom<Record<string, Rebase>>({
  key: 'bentoboxRebasesAtom',
  default: {},
})

export const liquidityModeAtom = atom<LiquidityMode>({
  key: 'liquidityMode',
  default: LiquidityMode.STANDARD,
})

export const spendFromWalletAtom = atom<boolean[]>({
  key: 'spendFromWalletAtom',
  default: [true, true],
})

export const spendFromWalletSelector = selectorFamily<boolean, number>({
  key: 'spendFromWalletSelector',
  get:
    (index) =>
    ({ get }) => {
      const spendFromWallet = get(spendFromWalletAtom)?.[index]
      if (typeof spendFromWallet !== 'undefined') {
        return spendFromWallet
      }

      // true by default
      return true
    },
  set:
    (index) =>
    ({ get, set }, newValue: boolean) => {
      const spendFromWallet = [...get(spendFromWalletAtom)]
      spendFromWallet[index] = newValue
      set(spendFromWalletAtom, spendFromWallet)
    },
})

export const outputToWalletAtom = atom<boolean>({
  key: 'outputToWalletAtom',
  default: true,
})

export const poolCreationPageAtom = atom<number>({
  key: 'poolCreationPageAtom',
  default: 0,
})

export const minPriceAtom = atom<string>({
  key: 'minPriceAtom',
  default: '',
})

export const maxPriceAtom = atom<string>({
  key: 'maxPriceAtom',
  default: '',
})

export const noLiquiditySelector = selector<boolean | undefined>({
  key: 'noLiquiditySelector',
  get: ({ get }) => {
    const { state, pool } = get(poolAtom)
    const totalSupply = get(totalSupplyAtom)

    if (pool) {
      return (
        state === 1 || // NOT_EXISTS
        Boolean(totalSupply && JSBI.equal(totalSupply.quotient, ZERO)) ||
        Boolean(
          state === 2 && pool && JSBI.equal(pool.reserve0.quotient, ZERO) && JSBI.equal(pool.reserve1.quotient, ZERO) // EXISTS
        )
      )
    }

    return undefined
  },
})

export const currentPoolShareSelector = selector({
  key: 'currentPoolShareSelector',
  get: ({ get }) => {
    const { pool } = get(poolAtom)
    const totalSupply = get(totalSupplyAtom)
    const poolBalance = get(poolBalanceAtom)
    if (pool && totalSupply && poolBalance && totalSupply?.greaterThan(ZERO)) {
      return new Percent(poolBalance.quotient, totalSupply.quotient)
    }

    return undefined
  },
})

// Returns the currency liquidity value expressed in underlying tokens not taking into account input values
export const currentLiquidityValueSelector = selector({
  key: 'currentLiquidityValueSelector',
  get: ({ get }) => {
    const { pool } = get(poolAtom)
    const poolBalance = get(poolBalanceAtom)
    const totalSupply = get(totalSupplyAtom)
    const rebases = get(bentoboxRebasesAtom)

    if (
      pool &&
      poolBalance &&
      totalSupply &&
      totalSupply?.greaterThan(ZERO) &&
      rebases[pool.token0.wrapped.address] &&
      rebases[pool.token1.wrapped.address]
    ) {
      // Convert from shares to amount
      return [
        toAmountCurrencyAmount(
          rebases[pool.token0.wrapped.address],
          pool.getLiquidityValue(pool.token0, totalSupply.wrapped, poolBalance.wrapped)
        ),
        toAmountCurrencyAmount(
          rebases[pool.token1.wrapped.address],
          pool.getLiquidityValue(pool.token1, totalSupply.wrapped, poolBalance.wrapped)
        ),
      ]
    }

    return [undefined, undefined]
  },
})
