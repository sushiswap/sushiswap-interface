import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount, Percent, Token, ZERO } from '@sushiswap/core-sdk'
import { currentLiquidityValueSelector, poolAtom, poolBalanceAtom } from '../atoms'
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

export const parsedAmountsSelector = selector<(CurrencyAmount<Currency> | undefined)[]>({
  key: 'parsedAmountsSelector',
  get: ({ get }) => {
    const { pool } = get(poolAtom)
    const percentageAmount = get(percentageAmountAtom)
    const currentLiquidityValue = get(currentLiquidityValueSelector)
    const percentage = new Percent(percentageAmount, '100')

    if (pool) {
      const tokens = [pool.token0, pool.token1]
      return tokens.map((el, index) => {
        const element = currentLiquidityValue[index]
        return pool && percentageAmount && percentage.greaterThan('0') && element
          ? CurrencyAmount.fromRawAmount(el, percentage.multiply(element?.quotient).quotient)
          : undefined
      })
    }

    return [undefined, undefined]
  },
})

const useZapPercentageInput = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { state: poolState } = useRecoilValue(poolAtom)
  const zapCurrency = useRecoilState(percentageZapCurrencyAtom)
  const parsedAmounts = useRecoilValue(parsedAmountsSelector)
  const percentageInput = useRecoilState(percentageAmountAtom)
  const parsedSLPAmount = useRecoilValue(parsedSLPAmountSelector)

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === 3
    ? i18n._(t`Invalid pool`)
    : !parsedSLPAmount?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : ''

  return useMemo(
    () => ({
      zapCurrency,
      parsedAmounts,
      parsedSLPAmount,
      percentageInput,
      error,
    }),
    [error, parsedAmounts, parsedSLPAmount, percentageInput, zapCurrency]
  )
}

export default useZapPercentageInput
