import { NETWORK_ICON } from 'app/config/networks'
import { switchToNetwork } from 'app/functions/network'
import usePrevious from 'app/hooks/usePrevious'
import NetworkModel from 'app/modals/NetworkModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useNetworkModalToggle } from 'app/state/application/hooks'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

function Web3Network(): JSX.Element | null {
  const { chainId, library } = useActiveWeb3React()

  const router = useRouter()
  const toggleNetworkModal = useNetworkModalToggle()

  const [switching, setSwitching] = useState(false)

  const prevChainId = usePrevious(chainId)

  const urlChainId = Number(router.query.chainId)

  const handleChainSwitch = useCallback(
    (targetChain: number) => {
      if (!library?.provider) return
      setSwitching(true)
      switchToNetwork({ provider: library.provider, chainId: targetChain })
        .then(() => router.replace({ query: { ...router.query, chainId: targetChain } }))
        .then(() => {
          // setSwitching(false)
        })
        .catch(() => {
          if (chainId) {
            router.replace({ query: { ...router.query, chainId } })
          }
        })
        .finally(() => {
          //
        })
    },
    [library?.provider, router, chainId]
  )

  useEffect(() => {
    if (!chainId || !prevChainId || !urlChainId) return

    // when network change originates from wallet or dropdown selector, just update URL
    if (chainId !== prevChainId) {
      console.debug('network change from wallet or network modal', { urlChainId, chainId })

      router.replace({ query: { ...router.query, chainId } })

      console.debug('after network change from wallet or network modal', { urlChainId: router.query.chainId, chainId })

      // otherwise assume network change originates from URL
    } else if (!switching && urlChainId && urlChainId !== chainId) {
      console.debug('network change from URL', { urlChainId, chainId })
      handleChainSwitch(urlChainId)
    }
  }, [chainId, urlChainId, prevChainId, router, handleChainSwitch, switching])

  // set chainId on initial load if not present
  useEffect(() => {
    if (chainId && !urlChainId) {
      console.debug('Setting chain id on initial load because not present')
      router.replace({ query: { ...router.query, chainId } })
    }
  }, [chainId, urlChainId, router])

  if (!chainId || !library) return null

  return (
    <div
      className="flex items-center text-sm font-bold cursor-pointer pointer-events-auto select-none whitespace-nowrap"
      onClick={() => toggleNetworkModal()}
    >
      <div className="grid items-center grid-flow-col justify-center h-[36px] w-[36px] text-sm rounded pointer-events-auto auto-cols-max text-secondary">
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className="rounded-full" width="24px" height="24px" />
      </div>
      <NetworkModel />
    </div>
  )
}

export default Web3Network
