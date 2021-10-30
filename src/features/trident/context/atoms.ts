import { Currency, CurrencyAmount, JSBI, Percent, Rebase, Token, ZERO } from '@sushiswap/core-sdk'
import { toAmountCurrencyAmount } from 'app/functions'
import { atom, selector, selectorFamily } from 'recoil'

import { LiquidityMode, PoolAtomType } from '../types'

export const DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)
export const DEFAULT_REMOVE_V2_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

export const poolAtom = atom<PoolAtomType | [undefined, undefined]>({
  key: 'poolAtom',
  default: [undefined, undefined],
})

export const showReviewAtom = atom<boolean>({
  key: 'showReviewAtom',
  default: false,
})

export const attemptingTxnAtom = atom<boolean>({
  key: 'attemptingTxnAtom',
  default: false,
})

export const txHashAtom = atom<string>({
  key: 'txHashAtom',
  default: '',
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

export const fixedRatioAtom = atom<boolean>({
  key: 'fixedRatioAtom',
  default: false,
})

export const liquidityModeAtom = atom<LiquidityMode>({
  key: 'liquidityMode',
  default: LiquidityMode.STANDARD,
})

export const spendFromWalletAtom = atom<Record<string, boolean> | undefined>({
  key: 'spendFromWalletAtom',
  default: {},
})

export const spendFromWalletSelector = selectorFamily<boolean, string | undefined>({
  key: 'spendFromWalletSelector',
  get:
    (address) =>
    ({ get }) => {
      if (address) {
        const spendFromWallet = get(spendFromWalletAtom)?.[address]
        if (typeof spendFromWallet !== 'undefined') {
          return spendFromWallet
        }
      }

      // true by default
      return true
    },
  set:
    (address) =>
    ({ get, set }, newValue: boolean) => {
      const spendFromWallet = { ...get(spendFromWalletAtom) }
      if (address) {
        spendFromWallet[address] = newValue
        set(spendFromWalletAtom, spendFromWallet)
      }
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
    const [poolState, pool] = get(poolAtom)
    const totalSupply = get(totalSupplyAtom)

    if (pool) {
      return (
        poolState === 1 ||
        Boolean(totalSupply && JSBI.equal(totalSupply.quotient, ZERO)) ||
        Boolean(
          poolState === 2 &&
            pool &&
            JSBI.equal(pool.reserve0.quotient, ZERO) &&
            JSBI.equal(pool.reserve1.quotient, ZERO)
        )
      )
    }

    return undefined
  },
})

export const currentPoolShareSelector = selector({
  key: 'currentPoolShareSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
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
    const [, pool] = get(poolAtom)
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
