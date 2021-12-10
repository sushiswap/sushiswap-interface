import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import usePrevious from './usePrevious'

export default function useBackOnChainChange() {
  const { back } = useRouter()

  const { chainId } = useActiveWeb3React()
  const previousChainId = usePrevious(chainId)

  console.log(chainId, previousChainId, chainId !== previousChainId)
  useEffect(() => !!previousChainId && chainId !== previousChainId && back(), [back, chainId, previousChainId])
}
