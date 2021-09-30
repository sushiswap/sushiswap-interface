import { Currency, CurrencyAmount, JSBI, Percent, Rebase, Token, ZERO } from '@sushiswap/core-sdk'
import { LiquidityMode, PoolAtomType } from '../types'
import { atom, selector, selectorFamily } from 'recoil'
import { toAmountJSBI } from '../../../functions'

export const DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

export const poolAtom = atom<PoolAtomType>({
  key: 'poolAtom',
  default: [null, null],
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
  default: null,
})

export const totalSupplyAtom = atom<CurrencyAmount<Token>>({
  key: 'totalSupplyAtom',
  default: null,
})

export const poolBalanceAtom = atom<CurrencyAmount<Token>>({
  key: 'poolBalanceAtom',
  default: null,
})

export const currenciesAtom = atom<Currency[]>({
  key: 'currenciesAtom',
  default: [],
})

export const bentoboxRebasesAtom = atom<Rebase[]>({
  key: 'bentoboxRebasesAtom',
  default: [],
})

export const fixedRatioAtom = atom<boolean>({
  key: 'fixedRatioAtom',
  default: true,
})

export const liquidityModeAtom = atom<LiquidityMode>({
  key: 'liquidityMode',
  default: LiquidityMode.STANDARD,
})

export const spendFromWalletAtom = atom<Record<string, boolean>>({
  key: 'spendFromWalletAtom',
  default: selector({
    key: 'spendFromWalletAtom/Default',
    get: ({ get }) => {
      const [, pool] = get(poolAtom)

      // TODO ramin: adjust for hybrid
      return {
        [pool?.token0.address]: true,
        [pool?.token1.address]: true,
      }
    },
  }),
})

export const spendFromWalletSelector = selectorFamily<boolean, string>({
  key: 'spendFromWalletSelector',
  get:
    (address) =>
    ({ get }) =>
      get(spendFromWalletAtom)[address],
  set:
    (address) =>
    ({ get, set }, newValue: boolean) => {
      const spendFromWallet = { ...get(spendFromWalletAtom) }
      spendFromWallet[address] = newValue
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
  default: null,
})

export const maxPriceAtom = atom<string>({
  key: 'maxPriceAtom',
  default: null,
})

export const slippageAtom = atom<Percent>({
  key: 'slippageAtom',
  default: null,
})

export const noLiquiditySelector = selector<boolean>({
  key: 'noLiquiditySelector',
  get: ({ get }) => {
    const [poolState, pool] = get<PoolAtomType>(poolAtom)
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
    const bentoboxRebases = get(bentoboxRebasesAtom)

    if (
      pool &&
      poolBalance &&
      totalSupply &&
      totalSupply?.greaterThan(ZERO) &&
      bentoboxRebases[0] &&
      bentoboxRebases[1]
    ) {
      // Convert from shares to amount
      return [
        CurrencyAmount.fromRawAmount(
          pool.token0,
          toAmountJSBI(
            bentoboxRebases[0],
            pool.getLiquidityValue(pool.token0, totalSupply.wrapped, poolBalance.wrapped).quotient
          )
        ),
        CurrencyAmount.fromRawAmount(
          pool.token1,
          toAmountJSBI(
            bentoboxRebases[1],
            pool.getLiquidityValue(pool.token1, totalSupply.wrapped, poolBalance.wrapped).quotient
          )
        ),
      ]
    }

    return [undefined, undefined]
  },
})
