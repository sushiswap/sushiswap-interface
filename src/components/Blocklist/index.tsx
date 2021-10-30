import { useActiveWeb3React } from 'app/services/web3'
import React, { ReactNode, useMemo } from 'react'

import { BLOCKED_ADDRESSES } from '../../constants'

export default function Blocklist({ children }: { children: ReactNode }) {
  const { account } = useActiveWeb3React()
  const blocked: boolean = useMemo(() => Boolean(account && BLOCKED_ADDRESSES.indexOf(account) !== -1), [account])
  if (blocked) {
    return <div>Blocked address</div>
  }
  return <>{children}</>
}
