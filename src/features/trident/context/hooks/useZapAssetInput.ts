import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount } from '@sushiswap/sdk'
import { tryParseAmount } from '../../../../functions'

export const selectedZapCurrencyAtom = atom<Currency>({
  key: 'selectedZapCurrencyAtom',
  default: null,
})

export const zapInputAmountAtom = atom<string>({
  key: 'zapInputAmountAtom',
  default: '',
})

export const parsedZapAmountSelector = selector<CurrencyAmount<Currency>>({
  key: 'parsedZapAmountSelector',
  get: ({ get }) => {
    const value = get(zapInputAmountAtom)
    const currency = get(selectedZapCurrencyAtom)
    return tryParseAmount(value, currency)
  },
})

export const parsedZapSplitAmountsSelector = selector<[CurrencyAmount<Currency>, CurrencyAmount<Currency>]>({
  key: 'parsedZapSplitAmountsSelector',
  get: ({ get }) => {
    const inputAmount = get(parsedZapAmountSelector)
    return [null, null]
  },
})

export const useZapAssetInput = () => {
  const zapCurrency = useRecoilState(selectedZapCurrencyAtom)
  const zapInputAmount = useRecoilState(zapInputAmountAtom)
  const parsedAmount = useRecoilValue(parsedZapAmountSelector)
  const parsedSplitAmounts = useRecoilValue(parsedZapSplitAmountsSelector)

  return {
    zapCurrency,
    zapInputAmount,
    parsedAmount,
    parsedSplitAmounts,
  }
}
