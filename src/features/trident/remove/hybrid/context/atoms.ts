import { atom, selector } from 'recoil'
import { ConstantProductPoolState } from '../../../../../hooks/useTridentClassicPools'
import { ConstantProductPool, Currency, CurrencyAmount, JSBI, Percent } from '@sushiswap/core-sdk'
import { poolBalanceAtom, totalSupplyAtom } from '../../../context/atoms'
import { calculateSlippageAmount } from '../../../../../functions'

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
