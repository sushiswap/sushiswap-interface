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

  const toggleNetworkModal = useNetworkModalToggle()

  const [switchedFromUrl, setSwitchedFromUrl] = useState(false)

  const router = useRouter()

  const prevChainId = usePrevious(chainId)

  const queryChainId = Number(router.query.chainId)

  const handleChainSwitch = useCallback(
    (targetChain: number) => {
      if (!library?.provider) return
      setSwitchedFromUrl(true)
      switchToNetwork({ provider: library.provider, chainId: targetChain })
        .then(() => {
          return router.replace({ query: { ...router.query, chainId: targetChain } })
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
    if (!chainId || !prevChainId) return

    // when network change originates from wallet or dropdown selector, just update URL
    if (chainId !== prevChainId) {
      console.debug('network change from wallet or network modal')
      router.replace({ query: { ...router.query, chainId } })
    }
  }, [chainId, prevChainId, router])

  useEffect(() => {
    // assume network change originates from URL
    if (chainId && queryChainId && !switchedFromUrl && chainId !== queryChainId) {
      console.debug('network change from query chainId', { queryChainId, chainId })
      handleChainSwitch(queryChainId)
    }
  }, [chainId, handleChainSwitch, switchedFromUrl, queryChainId])

  // set chainId on initial load if not present
  useEffect(() => {
    if (chainId && !queryChainId) {
      console.debug('Setting chain id on initial load because not present')
      console.log({ router })
      router.replace({ query: { ...router.query, chainId } })
    }
  }, [chainId, queryChainId, router])

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
