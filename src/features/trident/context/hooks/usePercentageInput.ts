import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount, Percent, Token, ZERO } from '@sushiswap/core-sdk'
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
  key: 'percentageInputParsedAmountsSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    const totalSupply = get(totalSupplyAtom)
    const parsedSLPAmount = get(parsedSLPAmountSelector)
    const allowedSlippage = get(slippageAtom)

    const amounts = [
      pool && parsedSLPAmount && totalSupply && totalSupply?.greaterThan(ZERO)
        ? pool.getLiquidityValue(pool.token0, totalSupply, parsedSLPAmount)
        : undefined,
      pool && parsedSLPAmount && totalSupply && totalSupply?.greaterThan(ZERO)
        ? pool.getLiquidityValue(pool.token1, totalSupply, parsedSLPAmount)
        : undefined,
    ]

    if (pool && allowedSlippage && amounts[0] && amounts[1]) {
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
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const parsedAmounts = useRecoilValue(parsedAmountsSelector)
  const percentageInput = useRecoilState(percentageAmountAtom)
  const parsedSLPAmount = useRecoilValue(parsedSLPAmountSelector)

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === 3
    ? i18n._(t`Invalid pool`)
    : !parsedSLPAmount
    ? i18n._(t`Enter a percentage`)
    : poolBalance?.lessThan(parsedSLPAmount)
    ? i18n._(t`Insufficient Balance`)
    : poolBalance?.equalTo(ZERO)
    ? i18n._(t`No Balance`)
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
