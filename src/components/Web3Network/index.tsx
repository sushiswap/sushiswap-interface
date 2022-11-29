import { NETWORK_ICON } from 'app/config/networks'
import { switchToNetwork } from 'app/functions/network'
import useIsWindowVisible from 'app/hooks/useIsWindowVisible'
import usePrevious from 'app/hooks/usePrevious'
import { useNativeCurrencyBalances } from 'app/lib/hooks/useCurrencyBalance'
import NetworkModal from 'app/modals/NetworkModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useModalOpen, useNetworkModalToggle } from 'app/state/application/hooks'
import { ApplicationModal } from 'app/state/application/reducer'
import Cookies from 'js-cookie'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { NATIVE } from 'sdk'

import Dots from '../Dots'
import Typography from '../Typography'

function Web3Network(): JSX.Element | null {
  const { chainId, library, account } = useActiveWeb3React()
  console.log('chainId', chainId)

  const toggleNetworkModal = useNetworkModalToggle()

  const [attemptingSwitchFromUrl, setAttemptingSwitchFromUrl] = useState(false)

  const [switchedFromUrl, setSwitchedFromUrl] = useState(false)

  const router = useRouter()

  const isWindowVisible = useIsWindowVisible()

  const prevChainId = usePrevious(chainId)

  const queryChainId = Number(router.query.chainId)

  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)

  const userFilBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']

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
            undefined,
            { shallow: true }
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
      router.replace({ pathname: router.pathname, query: { ...router.query, chainId } }, undefined, { shallow: true })
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
    console.log('New ChainId: ', chainId)
    console.log('New Library: ', library)
    if (chainId && !queryChainId) {
      router.replace({ pathname: router.pathname, query: { ...router.query, chainId } }, undefined, { shallow: true })
    }
  }, [chainId, queryChainId, router, library])

  if (!chainId || !library) {
    return null
  }

  return (
    <div
      // className="flex items-center text-sm font-bold cursor-pointer pointer-events-auto select-none whitespace-nowrap"
      className="flex p-2 rounded-lg hover:bg-[#2E2E2E] hover:text-white"
      onClick={() => toggleNetworkModal()}
    >
      <div className="grid items-center grid-flow-col justify-center h-[36px] w-[36px] text-sm rounded pointer-events-auto auto-cols-max text-secondary">
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className="rounded-full" width="24px" height="24px" />
      </div>
      {/* <div className="relative flex items-center gap-2 cursor-pointer pointer-events-auto">

        <Typography
          weight={700}
          variant="sm"
          className="font-mono px-1 uppercase tracking-tighter font-medium rounded-full text-xl"
        >
          {userFilBalance ? `${userFilBalance?.toSignificant(4)} ${NATIVE[chainId].symbol}` : <Dots>BALANCE</Dots>}
        </Typography>
      </div> */}
      
      <div className="flex items-center gap-2 justify-center flex-grow w-auto text-sm font-bold cursor-pointer pointer-events-auto select-none whitespace-nowrap hover:bg-[#2E2E2E] hover:text-white p-2 rounded-lg p-0.5">
        <Typography
          weight={700}
          variant="sm"
          className="font-mono px-1 font-medium tracking-tighter text-xl rounded-full"
        >
          {userFilBalance ? `${userFilBalance?.toSignificant(4)} ${NATIVE[chainId].symbol}` : <Dots>BALANCE</Dots>}
        </Typography>
      </div>
      <NetworkModal
        switchNetwork={(targetChain: number) => {
          handleChainSwitch(targetChain)
        }}
      />
    </div>
  )
}

export default Web3Network
