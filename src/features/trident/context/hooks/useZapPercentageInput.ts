import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount, Percent, Token, ZERO } from '@sushiswap/core-sdk'
import { calculateSlippageAmount, tryParseAmount } from '../../../../functions'
import { currentLiquidityValueSelector, poolAtom, poolBalanceAtom, slippageAtom } from '../atoms'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { useMemo } from 'react'

export const percentageZapCurrencyAtom = atom<Currency | undefined>({
  key: 'percentageZapCurrencyAtom',
  default: undefined,
})

export const percentageAmountAtom = atom<string>({
  key: 'percentageAmountAtom',
  default: '',
})

export const parsedSLPAmountSelector = selector<CurrencyAmount<Token> | undefined>({
  key: 'parsedInputAmount',
  get: ({ get }) => {
    const poolBalance = get(poolBalanceAtom)
    const percentageAmount = get(percentageAmountAtom)
    const percentage = new Percent(percentageAmount, '100')
    return poolBalance?.multiply(percentage)
  },
})

export const parsedZapAmountSelector = selector<CurrencyAmount<Currency> | undefined>({
  key: 'parsedZapAmountSelector',
  get: ({ get }) => {
    const poolBalance = get(poolBalanceAtom)
    const percentageAmount = get(percentageAmountAtom)
    const percentage = new Percent(percentageAmount, '100')
    const currency = get(percentageZapCurrencyAtom)

    // TODO calculate output amount
    if (currency) {
      return tryParseAmount('1', currency)
    }

    return undefined
  },
})

export const parsedAmountsSelector = selector<(CurrencyAmount<Currency> | undefined)[]>({
  key: 'parsedAmountsSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const percentageAmount = get(percentageAmountAtom)
    const currentLiquidityValue = get(currentLiquidityValueSelector)
    const percentage = new Percent(percentageAmount, '100')
    const allowedSlippage = get(slippageAtom)

    if (pool) {
      const tokens = [pool.token0, pool.token1]
      const amounts = tokens.map((el, index) => {
        const element = currentLiquidityValue[index]
        return pool && percentageAmount && percentage.greaterThan('0') && element
          ? CurrencyAmount.fromRawAmount(el, percentage.multiply(element?.quotient).quotient)
          : undefined
      })

      if (allowedSlippage && amounts[0] && amounts[1]) {
        const amountsMin = amounts.map((el) => (el ? calculateSlippageAmount(el, allowedSlippage)[0] : undefined))
        return amountsMin.map((el, index) =>
          el ? CurrencyAmount.fromRawAmount(tokens[index], el.toString()) : undefined
        )
      }
    }

    return [undefined, undefined]
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
  const parsedSLPAmount = useRecoilValue(parsedSLPAmountSelector)

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
      parsedSLPAmount,
      percentageInput,
      error,
    }),
    [error, parsedAmounts, parsedOutputAmount, parsedSLPAmount, percentageInput, zapCurrency]
  )
}

export default useZapPercentageInput
