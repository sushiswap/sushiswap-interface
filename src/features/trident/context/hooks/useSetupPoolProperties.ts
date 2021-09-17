import { atom, useRecoilState } from 'recoil'
import { PoolType } from '@sushiswap/trident-sdk'
import { useMemo } from 'react'

export const selectedPoolTypeAtom = atom<PoolType>({
  key: 'selectedPoolTypeAtom',
  default: PoolType.ConstantProduct,
})

export const twapAtom = atom<boolean>({
  key: 'twapAtom',
  default: true,
})

export const feeTierAtom = atom<number>({
  key: 'feeTierAtom',
  default: null,
})

export const useSetupPoolProperties = () => {
  const poolType = useRecoilState(selectedPoolTypeAtom)
  const twap = useRecoilState(twapAtom)
  const feeTier = useRecoilState(feeTierAtom)

  return useMemo(
    () => ({
      poolType,
      twap,
      feeTier,
    }),
    [feeTier, poolType, twap]
  )
}
