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

  const urlChainId = router.query.chainId

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
    } else if (!switching && urlChainId && Number(urlChainId) !== chainId) {
      console.debug('network change from URL', { urlChainId, chainId })
      handleChainSwitch(Number(urlChainId))
    }
  }, [chainId, urlChainId, prevChainId, router, handleChainSwitch, switching])

  // set chainId on initial load if not present
  useEffect(() => {
    if (chainId && !urlChainId) {
      console.debug('Setting chain id on initial load because not present')
      router.replace({ query: { ...router.query, chainId } })
    }
  }, [chainId, urlChainId, router])

  if (!chainId) return null

  // const prevChainId = usePrevious(chainId)

  // const urlChainId = useMemo(
  //   () => (router.query.chainId ? Number(router.query.chainId) : undefined),
  //   [router.query.chainId]
  // )

  // const handleChainSwitch = useCallback(
  //   (targetChain: number) => {
  //     if (!library?.provider) return
  //     switchToNetwork({ provider: library.provider, chainId: targetChain })
  //       .then(() => {
  //         router.replace({ query: { ...router.query, chainId: targetChain } }, undefined, { shallow: true })
  //       })
  //       .catch(() => {
  //         if (chainId) {
  //           router.replace({ query: { ...router.query, chainId } }, undefined, { shallow: true })
  //         }
  //       })
  //   },
  //   [library?.provider, router, chainId]
  // )

  // useEffect(() => {
  //   if (!chainId || !prevChainId || !urlChainId) return

  //   // when network change originates from wallet or dropdown selector, just update URL
  //   if (chainId !== prevChainId) {
  //     console.log('network change from wallet or network modal', { urlChainId, chainId })

  //     router.replace({ query: { ...router.query, chainId } }, undefined, { shallow: true })

  //     // console.debug('after network change from wallet or network modal', { urlChainId: router.query.chainId, chainId })

  //     // otherwise assume network change originates from URL
  //   } else if (urlChainId && chainId && urlChainId !== chainId) {
  //     console.log('network change from URL', { urlChainId, chainId })
  //     // handleChainSwitch(urlChainId)
  //     if (!library?.provider) return
  //     switchToNetwork({ provider: library.provider, chainId: urlChainId })
  //       .then(() => {
  //         router.replace({ query: { ...router.query, chainId: urlChainId } }, undefined, { shallow: true })
  //       })
  //       .catch(() => {
  //         if (chainId) {
  //           router.replace({ query: { ...router.query, chainId } }, undefined, { shallow: true })
  //         }
  //       })
  //   }
  // }, [chainId, urlChainId, prevChainId, router, library])

  // // set chainId on initial load if not present
  // useEffect(() => {
  //   if (chainId && !urlChainId) {
  //     console.log('Setting chain id on initial load because not present')
  //     router.replace({ query: { ...router.query, chainId } }, undefined, { shallow: true })
  //   }
  // }, [chainId, urlChainId, router])

  if (!chainId || !library) return null

  console.log('BEFORE RENDER', { prevChainId, chainId, urlChainId })

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

Web3Network.whyDidYouRender = true

export default Web3Network
