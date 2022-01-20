import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'

import { injected } from '../config/wallets'

function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true)
          // .then(() => window.ethereum.removeAllListeners(['networkChanged']))
          .catch(() => {
            setTried(true)
          })
        // @ts-ignore TYPE NEEDS FIXING
        window.ethereum.removeAllListeners(['networkChanged'])
      } else {
        if (isMobile && window.ethereum) {
          activate(injected, undefined, true)
            // .then(() => window.ethereum.removeAllListeners(['networkChanged']))
            .catch(() => {
              setTried(true)
            })
          // @ts-ignore TYPE NEEDS FIXING
          window.ethereum.removeAllListeners(['networkChanged'])
        } else {
          setTried(true)
        }
      }
    })
  }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

export default useEagerConnect
