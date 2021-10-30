import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'animation/loading-circle.json'
import Button from 'components/Button'
import Dots from 'components/Dots'
import Typography from 'components/Typography'
import { useTridentRouterContract } from 'hooks'
import Lottie from 'lottie-react'
import React, { FC } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { attemptingTxnAtom, showReviewAtom } from '../context/atoms'
import useSwapAssetPanelInputs, { TypedField } from '../context/hooks/useSwapAssetPanelInputs'
import TridentApproveGate from '../TridentApproveGate'

const SwapButton: FC = () => {
  const { i18n } = useLingui()
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const tridentRouterContract = useTridentRouterContract()
  const {
    typedField: [typedField],
    parsedAmounts,
    error,
  } = useSwapAssetPanelInputs()

  return (
    <TridentApproveGate
      inputAmounts={[typedField === TypedField.A ? parsedAmounts[0] : parsedAmounts[1]]}
      tokenApproveOn={tridentRouterContract?.address}
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
