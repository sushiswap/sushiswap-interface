import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount, Percent, ZERO } from '@sushiswap/core-sdk'
import { calculateSlippageAmount } from '../../../../functions'
import { currentLiquidityValueSelector, poolAtom, slippageAtom } from '../atoms'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { useMemo } from 'react'

export const percentageAmountAtom = atom<string>({
  key: 'percentageAmountAtom',
  default: '',
})

export const parsedAmountsSelector = selector<CurrencyAmount<Currency>[]>({
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

const usePercentageInput = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [poolState] = useRecoilValue(poolAtom)
  const parsedAmounts = useRecoilValue(parsedAmountsSelector)
  const percentageInput = useRecoilState(percentageAmountAtom)

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === 3
    ? i18n._(t`Invalid pool`)
    : !parsedAmounts.every((el) => el?.greaterThan(ZERO))
    ? i18n._(t`Enter an amount`)
    : ''

  return useMemo(
    () => ({
      parsedAmounts,
      percentageInput,
      error,
    }),
    [error, parsedAmounts, percentageInput]
  )
}

export default usePercentageInput
