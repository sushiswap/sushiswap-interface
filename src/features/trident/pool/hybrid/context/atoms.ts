import { atom } from 'recoil'
import { ConstantProductPoolState } from '../../../../../hooks/useTridentClassicPools'
import { ConstantProductPool } from '@sushiswap/core-sdk'

// TODO ramin typescript
export const poolAtom = atom<[ConstantProductPoolState, ConstantProductPool | null]>({
  key: 'poolAtom',
  default: [null, null],
})
