import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount, Percent, ZERO } from '@sushiswap/core-sdk'
import { calculateSlippageAmount } from '../../../../functions'
import { poolAtom, poolBalanceAtom, slippageAtom, totalSupplyAtom } from '../atoms'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { useMemo } from 'react'

export const percentageAmountAtom = atom<string>({
  key: 'percentageAmountAtom',
  default: '',
})

export const parsedSLPAmountSelector = selector<CurrencyAmount<Currency>>({
  key: 'parsedInputAmount',
  get: ({ get }) => {
    const poolBalance = get(poolBalanceAtom)
    const percentageAmount = get(percentageAmountAtom)
    const percentage = new Percent(percentageAmount, '100')
    return poolBalance?.multiply(percentage)
  },
})

export const parsedAmountsSelector = selector<CurrencyAmount<Currency>[]>({
  key: 'percentageInputParsedAmountsSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const totalSupply = get(totalSupplyAtom)
    const parsedSLPAmount = get(parsedSLPAmountSelector)
    const allowedSlippage = get(slippageAtom)

    const amounts = [
      pool && parsedSLPAmount && totalSupply && totalSupply?.greaterThan(ZERO)
        ? pool.getLiquidityValue(pool.token0, totalSupply?.wrapped, parsedSLPAmount?.wrapped)
        : undefined,
      pool && parsedSLPAmount && totalSupply && totalSupply?.greaterThan(ZERO)
        ? pool.getLiquidityValue(pool.token1, totalSupply?.wrapped, parsedSLPAmount?.wrapped)
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

    if (pool) return [CurrencyAmount.fromRawAmount(pool.token0, '0'), CurrencyAmount.fromRawAmount(pool.token1, '0')]
    return [undefined, undefined]
  },
})

const usePercentageInput = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [poolState] = useRecoilValue(poolAtom)
  const parsedAmounts = useRecoilValue(parsedAmountsSelector)
  const percentageInput = useRecoilState(percentageAmountAtom)
  const parsedSLPAmount = useRecoilValue(parsedSLPAmountSelector)

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
      parsedSLPAmount,
      percentageInput,
      error,
    }),
    [error, parsedAmounts, parsedSLPAmount, percentageInput]
  )
}

export default usePercentageInput
