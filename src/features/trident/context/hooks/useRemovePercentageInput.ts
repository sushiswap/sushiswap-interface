import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Percent, Token, ZERO } from '@sushiswap/core-sdk'
import { ConstantProductPool } from '@sushiswap/trident-sdk'
import { toAmountCurrencyAmount } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'

import { bentoboxRebasesAtom, outputToWalletAtom, poolAtom, poolBalanceAtom, totalSupplyAtom } from '../atoms'

export const receiveNativeAtom = atom<boolean>({
  key: 'useRemovePercentageInput:receiveNativeAtom',
  default: false,
})

export const percentageZapCurrencyAtom = atom<Currency | undefined>({
  key: 'useRemovePercentageInput:percentageZapCurrencyAtom',
  default: undefined,
})

export const percentageAmountAtom = atom<string>({
  key: 'useRemovePercentageInput:percentageAmountAtom',
  default: '',
})

export const parsedSLPAmountSelector = selector<CurrencyAmount<Token> | undefined>({
  key: 'useRemovePercentageInput:parsedInputAmount',
  get: ({ get }) => {
    const poolBalance = get(poolBalanceAtom)
    const percentageAmount = get(percentageAmountAtom)
    const percentage = new Percent(percentageAmount, '100')
    return poolBalance?.multiply(percentage)
  },
})

export const parsedAmountsSelector = selector<(CurrencyAmount<Currency> | undefined)[]>({
  key: 'useRemovePercentageInput:percentageInputParsedAmountsSelector',
  get: ({ get }) => {
    const { pool } = get(poolAtom)
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

export const parsedAmountSingleTokenSelector = selector<CurrencyAmount<Currency> | undefined>({
  key: 'useRemovePercentageInput:parsedAmountSingleTokenSelector',
  get: ({ get }) => {
    const { pool } = get(poolAtom)
    const totalSupply = get(totalSupplyAtom)
    const parsedSLPAmount = get(parsedSLPAmountSelector)
    const rebases = get(bentoboxRebasesAtom)
    const currency = get(percentageZapCurrencyAtom)

    return pool &&
      // TODO ramin: hack until other sdk entities have getLiquidityValueSingleToken
      pool instanceof ConstantProductPool &&
      parsedSLPAmount &&
      totalSupply &&
      totalSupply?.greaterThan(ZERO) &&
      currency
      ? toAmountCurrencyAmount(
          rebases[currency?.wrapped.address],
          pool.getLiquidityValueSingleToken(
            currency?.wrapped,
            totalSupply.add(parsedSLPAmount),
            parsedSLPAmount.add(parsedSLPAmount)
          )
        )
      : undefined
  },
})

const useRemovePercentageInput = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { state: poolState } = useRecoilValue(poolAtom)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const parsedAmounts = useRecoilValue(parsedAmountsSelector)
  const parsedAmountSingleToken = useRecoilValue(parsedAmountSingleTokenSelector)
  const percentageInput = useRecoilState(percentageAmountAtom)
  const parsedSLPAmount = useRecoilValue(parsedSLPAmountSelector)
  const outputToWallet = useRecoilValue(outputToWalletAtom)
  const zapCurrency = useRecoilState(percentageZapCurrencyAtom)
  const receiveNative = useRecoilState(receiveNativeAtom)

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === 3
    ? i18n._(t`Invalid pool`)
    : !parsedSLPAmount?.greaterThan(ZERO)
    ? i18n._(t`Enter a percentage`)
    : poolBalance?.lessThan(parsedSLPAmount)
    ? i18n._(t`Insufficient Balance`)
    : poolBalance?.equalTo(ZERO)
    ? i18n._(t`No Balance`)
    : ''

  return useMemo(
    () => ({
      parsedAmounts,
      parsedAmountSingleToken,
      parsedSLPAmount,
      percentageInput,
      outputToWallet,
      receiveNative,
      zapCurrency,
      error,
    }),
    [
      error,
      outputToWallet,
      parsedAmountSingleToken,
      parsedAmounts,
      parsedSLPAmount,
      percentageInput,
      receiveNative,
      zapCurrency,
    ]
  )
}

export default useRemovePercentageInput
