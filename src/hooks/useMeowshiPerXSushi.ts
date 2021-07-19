import { useBentoBoxContract } from './useContract'
import { useEffect, useState } from 'react'
import { XSUSHI } from '../constants'

export default function useMeowshiPerXSushi() {
  const bentoboxContract = useBentoBoxContract()
  const [state, setState] = useState(0)

  useEffect(() => {
    if (!bentoboxContract) return
    ;(async () => {
      const ratio = await bentoboxContract.toShare(XSUSHI.address, '1'.toBigNumber(XSUSHI.decimals), false)
      setState(parseFloat(ratio))
    })()
  }, [bentoboxContract])

  return state
}
