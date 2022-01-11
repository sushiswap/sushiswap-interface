import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { poolAtom } from 'app/features/trident/context/atoms'
import { tryParseAmount } from 'app/functions/parse'
import { atom, selector } from 'recoil'

export const poolTokensSelector = selector<Record<string, Token>>({
  key: 'poolTokensSelector',
  get: ({ get }) => {
    const { pool } = get(poolAtom)
    const tokens = [pool?.token0, pool?.token1]
    return tokens.reduce((acc, cur) => {
      acc[cur?.address] = cur
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
