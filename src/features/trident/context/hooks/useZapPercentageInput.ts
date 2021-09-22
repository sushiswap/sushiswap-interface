import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount, Percent, ZERO } from '@sushiswap/core-sdk'
import { calculateSlippageAmount, tryParseAmount } from '../../../../functions'
import { currentLiquidityValueSelector, poolAtom, poolBalanceAtom, slippageAtom } from '../atoms'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { useMemo } from 'react'

export const percentageZapCurrencyAtom = atom<Currency>({
  key: 'percentageZapCurrencyAtom',
  default: null,
})

export const percentageAmountAtom = atom<string>({
  key: 'percentageAmountAtom',
  default: '',
})

export const parsedZapAmountSelector = selector<CurrencyAmount<Currency>>({
  key: 'parsedZapAmountSelector',
  get: ({ get }) => {
    const poolBalance = get(poolBalanceAtom)
    const percentageAmount = get(percentageAmountAtom)
    const percentage = new Percent(percentageAmount, '100')
    const currency = get(percentageZapCurrencyAtom)

    // TODO calculate output amount
    return tryParseAmount('1', currency)
  },
})

export const parsedAmountsSelector = selector<CurrencyAmount<Currency>[]>({
  key: 'parsedAmountsSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const percentageAmount = get(percentageAmountAtom)
    const currentLiquidityValue = get(currentLiquidityValueSelector)
    const percentage = new Percent(percentageAmount, '100')
    const allowedSlippage = get(slippageAtom)

    const tokens = [pool?.token0, pool?.token1]
    const amounts = tokens.map((el, index) =>
      pool && percentageAmount && percentage.greaterThan('0') && currentLiquidityValue[index]
        ? CurrencyAmount.fromRawAmount(el, percentage.multiply(currentLiquidityValue[index].quotient).quotient)
        : undefined
    )

    if (allowedSlippage && amounts[0] && amounts[1]) {
      const amountsMin = amounts.map((el, index) => calculateSlippageAmount(el, allowedSlippage)[0])
      return amountsMin.map((el, index) => CurrencyAmount.fromRawAmount(tokens[index], el.toString()))
    }

    return new Array(tokens.length).fill(undefined)
  },
})

const useZapPercentageInput = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [poolState] = useRecoilValue(poolAtom)
  const zapCurrency = useRecoilState(percentageZapCurrencyAtom)
  const parsedAmounts = useRecoilValue(parsedAmountsSelector)
  const parsedOutputAmount = useRecoilValue(parsedZapAmountSelector)
  const percentageInput = useRecoilState(percentageAmountAtom)

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === 3
    ? i18n._(t`Invalid pool`)
    : !parsedOutputAmount?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : ''

  return useMemo(
    () => ({
      zapCurrency,
      parsedAmounts,
      parsedOutputAmount,
      percentageInput,
      error,
    }),
    [error, parsedAmounts, parsedOutputAmount, percentageInput, zapCurrency]
  )
}

export default useZapPercentageInput
