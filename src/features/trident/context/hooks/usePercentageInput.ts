import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount, Percent, Token, ZERO } from '@sushiswap/core-sdk'
import { bentoboxRebasesAtom, poolAtom, poolBalanceAtom, totalSupplyAtom } from '../atoms'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { useMemo } from 'react'
import { toAmountCurrencyAmount } from '../../../../functions'

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
    const rebases = get(bentoboxRebasesAtom)

    return [
      pool && parsedSLPAmount && totalSupply && totalSupply?.greaterThan(ZERO)
        ? toAmountCurrencyAmount(
            rebases[pool.token0.wrapped.address],
            pool.getLiquidityValue(pool.token0, totalSupply, parsedSLPAmount)
          )
        : undefined,
      pool && parsedSLPAmount && totalSupply && totalSupply?.greaterThan(ZERO)
        ? toAmountCurrencyAmount(
            rebases[pool.token1.wrapped.address],
            pool.getLiquidityValue(pool.token1, totalSupply, parsedSLPAmount)
          )
        : undefined,
    ]
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
