import { NETWORK_ICON } from 'app/config/networks'
import { switchToNetwork } from 'app/functions/network'
import useIsWindowVisible from 'app/hooks/useIsWindowVisible'
import usePrevious from 'app/hooks/usePrevious'
import NetworkModel from 'app/modals/NetworkModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useModalOpen, useNetworkModalToggle } from 'app/state/application/hooks'
import { ApplicationModal } from 'app/state/application/reducer'
import Cookies from 'js-cookie'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

function Web3Network(): JSX.Element | null {
  const { chainId, library } = useActiveWeb3React()

  const toggleNetworkModal = useNetworkModalToggle()

  const [attemptingSwitchFromUrl, setAttemptingSwitchFromUrl] = useState(false)

  const [switchedFromUrl, setSwitchedFromUrl] = useState(false)

  const router = useRouter()

  const isWindowVisible = useIsWindowVisible()

  const prevChainId = usePrevious(chainId)

  const queryChainId = Number(router.query.chainId)

  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)

  const handleChainSwitch = useCallback(
    (targetChain: number) => {
      if (!library || !library?.provider) {
        setAttemptingSwitchFromUrl(false)
        return
      }

      switchToNetwork({ provider: library.provider, chainId: targetChain })
        .then(() => {
          return router.replace(
            {
              pathname: router.pathname,
              query: { ...router.query, chainId: targetChain },
            },
            undefined
          )
        })
        .finally(() => {
          if (networkModalOpen) {
            toggleNetworkModal()
          }
        })
    },
    [library, router, toggleNetworkModal, networkModalOpen]
  )

  useEffect(() => {
    if (!chainId || !prevChainId) return

    // when network change originates from wallet or dropdown selector, just update URL
    if (chainId !== prevChainId) {
      console.debug('network change from wallet or network modal')
      router.replace({ pathname: router.pathname, query: { ...router.query, chainId } }, undefined)
    }
  }, [chainId, prevChainId, router])

  useEffect(() => {
    // assume network change originates from URL
    const cookieChainId = Cookies.get('chain-id')
    const defaultChainId = Number(cookieChainId)
    if (
      !chainId ||
      !isWindowVisible ||
      attemptingSwitchFromUrl ||
      switchedFromUrl ||
      (Number.isNaN(defaultChainId) && Number.isNaN(queryChainId)) ||
      chainId === queryChainId ||
      chainId === defaultChainId
    )
      return

    console.debug('network change from query chainId', { queryChainId, defaultChainId, chainId })
    setAttemptingSwitchFromUrl(true)
    setSwitchedFromUrl(true)
    if (switchedFromUrl) return

    handleChainSwitch(defaultChainId ? defaultChainId : queryChainId)
  }, [chainId, handleChainSwitch, switchedFromUrl, queryChainId, isWindowVisible, attemptingSwitchFromUrl])

  // set chainId on initial load if not present
  useEffect(() => {
    if (chainId && !queryChainId) {
      router.replace({ pathname: router.pathname, query: { ...router.query, chainId } }, undefined)
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
      <NetworkModel
        switchNetwork={(targetChain: number) => {
          handleChainSwitch(targetChain)
        }}
      />
    </div>
  )
}

export default Web3Network
