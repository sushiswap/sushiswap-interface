import { atom, selector } from 'recoil'
import { PoolType } from '../types'
import { Currency, CurrencyAmount, JSBI } from '../../../../../sushiswap-sdk'
import { tryParseAmount } from '../../../functions'

export const selectedPoolTypeAtom = atom<PoolType>({
  key: 'selectedPoolTypeAtom',
  default: PoolType.CLASSIC,
})

export const pageAtom = atom<number>({
  key: 'pageAtom',
  default: 0,
})

export const selectedPoolCurrenciesAtom = atom<Currency[]>({
  key: 'selectedPoolCurrenciesAtom',
  default: [],
})

export const feeTierAtom = atom<string>({
  key: 'feeTierAtom',
  default: null,
})

export const inputAmountsAtom = atom<string[]>({
  key: 'inputAmountsAtom',
  default: [],
})

export const parsedInputAmountsSelector = selector<CurrencyAmount<Currency>[]>({
  key: 'parsedInputAmounts',
  get: ({ get }) => {
    const inputAmounts = get(inputAmountsAtom)
    const selectedPoolCurrencies = get(selectedPoolCurrenciesAtom)
    return inputAmounts.map((amount, index) => tryParseAmount(amount, selectedPoolCurrencies[index]?.wrapped))
  },
})
