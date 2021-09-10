import { atom, selector } from 'recoil'
import { Currency, CurrencyAmount, JSBI, Percent } from '@sushiswap/sdk'
import { LiquidityMode } from '../types'
import { poolAtom } from '../remove/classic/context/atoms'
import { PairState } from '../../../hooks/useV2Pairs'

const ZERO = JSBI.BigInt(0)

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
  default: null,
})

export const totalSupplyAtom = atom<CurrencyAmount<Currency>>({
  key: 'totalSupplyAtom',
  default: null,
})

export const poolBalanceAtom = atom<CurrencyAmount<Currency>>({
  key: 'poolBalanceAtom',
  default: null,
})

export const fixedRatioAtom = atom<boolean>({
  key: 'fixedRatioAtom',
  default: true,
})

export const liquidityModeAtom = atom<LiquidityMode>({
  key: 'liquidityMode',
  default: LiquidityMode.STANDARD,
})

export const spendFromWalletAtom = atom<boolean>({
  key: 'spendFromWalletAtom',
  default: true,
})

export const currentPoolShareSelector = selector({
  key: 'currentPoolShareSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const totalSupply = get(totalSupplyAtom)
    const userPoolBalance = get(poolBalanceAtom)
    if (pool && totalSupply && userPoolBalance) {
      return new Percent(userPoolBalance.quotient, totalSupply.quotient)
    }

    return undefined
  },
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
