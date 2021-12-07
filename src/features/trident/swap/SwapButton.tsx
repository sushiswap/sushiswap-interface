import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'animation/loading-circle.json'
import Button from 'components/Button'
import Dots from 'components/Dots'
import Typography from 'components/Typography'
import { useBentoBoxContract, useTridentRouterContract } from 'hooks'
import Lottie from 'lottie-react'
import React, { FC } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { attemptingTxnAtom, showReviewAtom } from '../context/atoms'
import useSwapAssetPanelInputs from '../context/hooks/useSwapAssetPanelInputs'
import TridentApproveGate from '../TridentApproveGate'

const SwapButton: FC = () => {
  const { i18n } = useLingui()
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const router = useTridentRouterContract()
  const bentoBox = useBentoBoxContract()

  const { parsedAmounts, error } = useSwapAssetPanelInputs()

  return (
    <TridentApproveGate
      inputAmounts={[parsedAmounts[0]]}
      tokenApproveOn={bentoBox?.address}
      masterContractAddress={router?.address}
      withPermit={true}
    >
      {({ approved, loading }) => {
        const disabled = !!error || !approved || loading || attemptingTxn
        const buttonText = attemptingTxn ? (
          <Dots>{i18n._(t`Swapping`)}</Dots>
        ) : loading ? (
          ''
        ) : error ? (
          error
        ) : (
          i18n._(t`Swap`)
        )

        return (
          <div className="flex">
            <Button
              id="swap-button"
              className="h-[48px]"
              {...(loading && {
                startIcon: (
                  <div className="w-4 h-4 mr-1">
                    <Lottie animationData={loadingCircle} autoplay loop />
                  </div>
                ),
              })}
              color="gradient"
              disabled={disabled}
              onClick={() => setShowReview(true)}
            >
              <Typography variant="sm" weight={700} className={!error ? 'text-high-emphesis' : 'text-low-emphasis'}>
                {buttonText}
              </Typography>
            </Button>
          </div>
        )
      }}
    </TridentApproveGate>
  )
}

export default SwapButton
