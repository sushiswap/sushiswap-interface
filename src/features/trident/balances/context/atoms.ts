import { Currency } from '@sushiswap/core-sdk'
import { ActiveModal } from 'app/features/trident/balances/context/types'
import { atom } from 'recoil'

export const SelectedCurrencyAtom = atom<Currency | undefined>({
  key: 'balances:SelectedCurrencyAtom',
  default: undefined,
})

export const ActiveModalAtom = atom<ActiveModal | undefined>({
  key: 'balances:ActiveModalAtom',
  default: undefined,
})
