import { useEffect, useState } from 'react'

import { BigNumber } from 'ethers'
import { XSUSHI } from '../constants'
import { useBentoBoxContract } from './useContract'

export default function useMeowshiPerXSushi() {
  const bentoboxContract = useBentoBoxContract()
  const [state, setState] = useState<[BigNumber, BigNumber]>([BigNumber.from('0'), BigNumber.from('0')])

  useEffect(() => {
    if (!bentoboxContract) return
    ;(async () => {
      const toShare = await bentoboxContract.toShare(XSUSHI.address, '1'.toBigNumber(XSUSHI.decimals), false)
      const toAmount = await bentoboxContract.toAmount(XSUSHI.address, '1'.toBigNumber(XSUSHI.decimals), false)
      setState([toShare, toAmount])
    })()
  }, [bentoboxContract])

  return state
}
