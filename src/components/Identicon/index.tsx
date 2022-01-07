import jazzicon from '@metamask/jazzicon'
import useENSAvatar from '../../hooks/useENSAvatar'
import { useState } from 'react'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import Image from '../Image'

export default function Identicon() {
  const { account } = useActiveWeb3React()
  const { avatar } = useENSAvatar(account ?? undefined)
  const [fetchable, setFetchable] = useState(true)
  return (
    <div className="w-4 h-4 rounded">
      {avatar && fetchable ? (
        <Image width="inherit" height="inherit" alt="avatar" src={avatar} onError={() => setFetchable(false)} />
      ) : (
        <Image src="/chef.svg" alt="SushiChef" width={16} height={16} />
      )}
    </div>
  )
}
