import { atom, selector } from 'recoil'
import { ConstantProductPool, Currency, CurrencyAmount, Percent } from '@sushiswap/sdk'
import { ConstantProductPoolState } from '../../../../../hooks/useTridentClassicPools'
import { poolBalanceAtom } from '../../../context/atoms'
import { calculateSlippageAmount } from '../../../../../functions'
import { currentLiquidityValueSelector, slippageAtom } from '../../classic/context/atoms'

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
