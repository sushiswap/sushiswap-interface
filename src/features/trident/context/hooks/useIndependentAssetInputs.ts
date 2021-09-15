import { useActiveWeb3React } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { atom, atomFamily, selectorFamily, useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
import { spendFromWalletAtom } from '../atoms'
import { useBentoOrWalletBalance } from '../../../../hooks/useBentoOrWalletBalance'
import { maxAmountSpend, tryParseAmount } from '../../../../functions'
import { useMemo } from 'react'
import { t } from '@lingui/macro'
import { Currency, CurrencyAmount, ZERO } from '@sushiswap/sdk'

export const selectedPoolCurrenciesAtom = atomFamily<Currency[], number>({
  key: 'selectedPoolCurrenciesAtom',
  default: (length) => new Array(length).fill(null),
})

export const numberOfInputsAtom = atom<number>({
  key: 'numberOfInputsAtom',
  default: 2,
})

export const typedInputIndexAtom = atom<number>({
  key: 'typedInputIndexAtom',
  default: 0,
})

export const inputAmountsAtom = atomFamily<string[], number>({
  key: 'inputAmountsAtom',
  default: (length) => new Array(length).fill(null),
})

export const parsedAmountsSelector = selectorFamily<CurrencyAmount<Currency>[], number>({
  key: 'parsedAmountsSelector',
  get:
    (length) =>
    ({ get }) => {
      const spendFromWallet = get(spendFromWalletAtom)
      const inputAmounts = get(inputAmountsAtom(length))
      const selectedPoolCurrencies = get(selectedPoolCurrenciesAtom(length))
      return inputAmounts.map((amount, index) =>
        tryParseAmount(
          amount,
          spendFromWallet ? selectedPoolCurrencies?.[index] : selectedPoolCurrencies?.[index].wrapped
        )
      )
    },
  set:
    (length) =>
    ({ get, set }, newValue: CurrencyAmount<Currency>[]) => {
      set(
        inputAmountsAtom(length),
        newValue.map((el) => el?.toExact())
      )
    },
})

export const formattedAmountsSelector = selectorFamily<string[], number>({
  key: 'formattedAmountsSelector',
  get:
    (length) =>
    ({ get }) => {
      const parsedAmounts = get(parsedAmountsSelector(length))
      const typedInputIndex = get(typedInputIndexAtom)
      const inputAmounts = get(inputAmountsAtom(length))

      return parsedAmounts.map((el, index) => {
        return index === typedInputIndex ? inputAmounts[index] : el?.toSignificant(6) ?? ''
      })
    },
})

export const useIndependentAssetInputs = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const numberOfInputs = useRecoilState(numberOfInputsAtom)
  const currencies = useRecoilState(selectedPoolCurrenciesAtom(numberOfInputs[0]))
  const formattedAmounts = useRecoilValue(formattedAmountsSelector(numberOfInputs[0]))
  const inputs = useRecoilValue(inputAmountsAtom(numberOfInputs[0]))
  const parsedAmounts = useRecoilValue(parsedAmountsSelector(numberOfInputs[0]))
  const spendFromWallet = useRecoilValue(spendFromWalletAtom)
  const balances = useBentoOrWalletBalance(account, currencies[0], spendFromWallet)

  const setInputAtIndex = useRecoilCallback<[string, number], void>(
    ({ snapshot, set }) =>
      async (val, index) => {
        const inputAmounts = [...(await snapshot.getPromise(inputAmountsAtom(numberOfInputs[0])))]
        inputAmounts[index] = val
        set(typedInputIndexAtom, index)
        set(inputAmountsAtom(numberOfInputs[0]), inputAmounts)
      },
    [numberOfInputs]
  )

  const onMax = useRecoilCallback(
    ({ set }) =>
      async () => {
        set(
          parsedAmountsSelector(numberOfInputs[0]),
          balances?.map((balance) => maxAmountSpend(balance))
        )
      },
    [balances, numberOfInputs]
  )

  const isMax = useMemo(() => {
    return parsedAmounts.every((el, index) => el?.equalTo(maxAmountSpend(balances?.[index])))
  }, [balances, parsedAmounts])

  const insufficientBalance = useMemo(() => {
    return parsedAmounts.find((el, index) => {
      return balances && el ? balances[index].lessThan(el) : false
    })
  }, [balances, parsedAmounts])

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : !parsedAmounts.every((el) => el?.greaterThan(ZERO))
    ? i18n._(t`Enter an amount`)
    : insufficientBalance
    ? i18n._(t`Insufficient ${insufficientBalance.currency.symbol} balance`)
    : ''

  return {
    inputs,
    currencies,
    numberOfInputs,
    formattedAmounts,
    parsedAmounts,
    onMax,
    isMax,
    setInputAtIndex,
    error,
  }
}
