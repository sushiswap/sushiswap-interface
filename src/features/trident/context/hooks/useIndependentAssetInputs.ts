import { useActiveWeb3React } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { atom, atomFamily, selectorFamily, useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
import { spendFromWalletAtom } from '../atoms'
import { useBentoOrWalletBalances } from '../../../../hooks/useBentoOrWalletBalance'
import { maxAmountSpend, tryParseAmount } from '../../../../functions'
import { useCallback, useMemo } from 'react'
import { t } from '@lingui/macro'
import { Currency, CurrencyAmount, ZERO } from '@sushiswap/core-sdk'

export const selectedPoolCurrenciesAtom = atomFamily<(Currency | undefined)[], number>({
  key: 'selectedPoolCurrenciesAtom',
  default: (length) => new Array(length).fill(undefined),
})

export const numberOfInputsAtom = atom<number>({
  key: 'numberOfInputsAtom',
  default: 2,
})

export const typedInputIndexAtom = atom<number>({
  key: 'typedInputIndexAtom',
  default: 0,
})

export const inputAmountsAtom = atomFamily<(string | undefined)[], number>({
  key: 'inputAmountsAtom',
  default: (length) => new Array(length).fill(undefined),
})

export const parsedAmountsSelector = selectorFamily<(CurrencyAmount<Currency> | undefined)[], number>({
  key: 'parsedAmountsSelector',
  get:
    (length) =>
    ({ get }) => {
      const inputAmounts = get(inputAmountsAtom(length))
      const selectedPoolCurrencies = get(selectedPoolCurrenciesAtom(length))
      return inputAmounts.map((amount, index) => {
        const currency = selectedPoolCurrencies[index]
        if (currency) {
          return tryParseAmount(amount, currency ? currency : undefined)
        }

        return undefined
      })
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

export const formattedAmountsSelector = selectorFamily<(string | undefined)[], number>({
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
  const [parsedAmounts, setParsedAmounts] = useRecoilState(parsedAmountsSelector(numberOfInputs[0]))
  const spendFromWallet = useRecoilValue(spendFromWalletAtom)
  const balances = useBentoOrWalletBalances(account ?? undefined, currencies[0], spendFromWallet)

  const setInputAtIndex = useRecoilCallback<[string | undefined, number], void>(
    ({ snapshot, set }) =>
      async (val, index) => {
        const inputAmounts = [...(await snapshot.getPromise(inputAmountsAtom(numberOfInputs[0])))]
        inputAmounts[index] = val
        set(typedInputIndexAtom, index)
        set(inputAmountsAtom(numberOfInputs[0]), inputAmounts)
      },
    [numberOfInputs]
  )

  const onMax = useCallback(async () => {
    setParsedAmounts(balances?.map((balance) => maxAmountSpend(balance)))
  }, [balances, setParsedAmounts])

  const isMax = useMemo(() => {
    return parsedAmounts.every((el, index) => {
      const maxSpend = maxAmountSpend(balances?.[index])
      if (el && maxSpend) {
        return el.equalTo(maxSpend)
      }

      return false
    })
  }, [balances, parsedAmounts])

  const insufficientBalance = useMemo(() => {
    return parsedAmounts.find((el, index) => {
      return balances && balances[index] && el ? balances[index]?.lessThan(el) : false
    })
  }, [balances, parsedAmounts])

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : !parsedAmounts.every((el) => el?.greaterThan(ZERO))
    ? i18n._(t`Enter an amount`)
    : insufficientBalance
    ? i18n._(t`Insufficient ${insufficientBalance.currency.symbol} balance`)
    : ''

  return useMemo(
    () => ({
      inputs,
      currencies,
      numberOfInputs,
      formattedAmounts,
      parsedAmounts,
      onMax,
      isMax,
      setInputAtIndex,
      error,
    }),
    [currencies, error, formattedAmounts, inputs, isMax, numberOfInputs, onMax, parsedAmounts, setInputAtIndex]
  )
}
