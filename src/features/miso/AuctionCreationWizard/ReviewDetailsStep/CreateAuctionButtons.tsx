import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CHAIN_KEY, NATIVE, Percent } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import LoadingCircle from 'app/animation/loading-circle.json'
import Button from 'app/components/Button'
import { formatCreationFormData } from 'app/features/miso/AuctionCreationWizard/utils'
import useAuctionCreate from 'app/features/miso/context/hooks/useAuctionCreate'
import { useStore } from 'app/features/miso/context/store'
import { useAuctionedToken } from 'app/features/miso/context/store/createTokenDetailsSlice'
import { TokenSetup } from 'app/features/miso/context/types'
import { ApprovalState, useApproveCallback, useContract } from 'app/hooks'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const CreateAuctionButtons = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const state = useStore((state) => state)
  const auctionToken = useAuctionedToken()
  const paymentToken = useToken(state.paymentCurrencyAddress) ?? NATIVE[chainId || 1]
  const router = useRouter()
  const [txHash, setTxHash] = useState<string>()
  const [pending, setPending] = useState<boolean>(false)
  const [auctionAddress, setAuctionAddress] = useState<string>()
  const [error, setError] = useState<string>()
  const { initWizard, subscribe, unsubscribe } = useAuctionCreate()
  const recipeContract = useContract(
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.AuctionCreation.address : undefined,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.AuctionCreation.abi : undefined
  )

  const data = paymentToken && auctionToken ? formatCreationFormData(state, paymentToken, auctionToken) : undefined
  const approveAmount = useMemo(
    () => (data ? data.tokenAmount.add(data.tokenAmount.multiply(new Percent(data.liqPercentage, 10000))) : undefined),
    [data]
  )

  const [approvalState, approve] = useApproveCallback(approveAmount, recipeContract?.address)

  const reset = useCallback(() => {
    if (!pending) {
      setAuctionAddress(undefined)
      setTxHash(undefined)
      setError(undefined)
    }
  }, [pending])

  const execute = useCallback(
    async (data) => {
      if (!data) return

      setPending(true)

      try {
        const tx = await initWizard(data)

        if (tx?.hash) {
          setTxHash(tx.hash)
          await tx.wait()
        }
      } catch (e) {
        console.log(e)
        // @ts-ignore TYPE NEEDS FIXING
        setError(e.error?.message)
      } finally {
        setPending(false)
      }
    },
    [initWizard]
  )

  // Subscribe to creation event to get created token ID
  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    subscribe('MarketCreated', (owner, address, marketTemplate, { transactionHash }) => {
      if (transactionHash?.toLowerCase() === txHash?.toLowerCase()) {
        setAuctionAddress(address)
        router.push(`/miso/${address}`)
      }
    })

    return () => {
      unsubscribe('MarketCreated', () => console.log('unsubscribed'))
    }
  }, [router, subscribe, txHash, unsubscribe])

  return (
    <>
      {approvalState !== ApprovalState.APPROVED && data.tokenSetupType === TokenSetup.PROVIDE && (
        <Button
          size="sm"
          color="blue"
          type="button"
          disabled={approvalState === ApprovalState.PENDING || pending}
          {...((approvalState === ApprovalState.PENDING || pending) && {
            startIcon: (
              <div className="w-4 h-4 mr-1">
                <Lottie animationData={LoadingCircle} autoplay loop />
              </div>
            ),
          })}
          onClick={approve}
        >
          {i18n._(t`Approve`)}
        </Button>
      )}
      <Button
        size="sm"
        color="blue"
        type="button"
        disabled={(data.tokenSetupType === TokenSetup.PROVIDE && approvalState !== ApprovalState.APPROVED) || pending}
        {...(pending && {
          startIcon: (
            <div className="w-4 h-4 mr-1">
              <Lottie animationData={LoadingCircle} autoplay loop />
            </div>
          ),
        })}
        onClick={() => execute(data)}
      >
        {i18n._(t`Create auction`)}
      </Button>
    </>
  )
}

export default CreateAuctionButtons
