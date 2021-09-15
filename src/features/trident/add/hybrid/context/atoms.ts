import { atom, selector } from 'recoil'
import { ConstantProductPool, Currency, CurrencyAmount, Token } from '@sushiswap/sdk'
import { ConstantProductPoolState } from '../../../../../hooks/useTridentClassicPools'
import { tryParseAmount } from '../../../../../functions'

// TODO ramin: remove
interface HybridPool extends ConstantProductPool {
  tokens: Token[]
}

// TODO ramin: import HybridPool from SDK
export const poolAtom = atom<[ConstantProductPoolState, HybridPool | null]>({
  key: 'poolAtom',
  default: [null, null],
})

export const selectedZapCurrencyAtom = atom<Currency>({
  key: 'selectedZapCurrencyAtom',
  default: null,
})

export const zapInputAtom = atom<string>({
  key: 'zapInputAtom',
  default: '',
})

export const poolTokensSelector = selector<Record<string, Token>>({
  key: 'poolTokensSelector',
  get: ({ get }) => {
    const [, pool] = get(poolAtom)
    return pool?.tokens.reduce((acc, cur) => {
      acc[cur.address] = cur
      return acc
    }, {})
  },
})

export const amountsSelector = atom<Record<string, string>>({
  key: 'amountsSelector',
  default: {},
})

export const parsedAmountsSelector = selector<Record<string, CurrencyAmount<Token>>>({
  key: 'parsedAmountsSelector',
  get: ({ get }) => {
    const amounts = get(amountsSelector)
    const poolTokens = get(poolTokensSelector)
    return Object.entries(poolTokens).reduce((acc, [k, v]) => {
      acc[k] = tryParseAmount(amounts[k], v)
      return acc
    }, {})
  },
  set: ({ set, get }, newValue) => {
    set(
      amountsSelector,
      Object.entries(newValue).reduce((acc, [k, v]) => {
        acc[k] = v?.toExact()
        return acc
      }, {})
    )
  },
})

export const parsedZapSplitAmountsSelector = selector<[CurrencyAmount<Currency>, CurrencyAmount<Currency>]>({
  key: 'parsedZapSlitAmountsSelector',
  get: ({ get }) => {
    const inputAmount = get(parsedZapAmountSelector)
    return [null, null]
  },
})

export const parsedZapAmountSelector = selector<CurrencyAmount<Currency>>({
  key: 'parsedZapAmountSelector',
  get: ({ get }) => {
    const value = get(zapInputAtom)
    const currency = get(selectedZapCurrencyAtom)
    return tryParseAmount(value, currency)
  },
})
