import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { attemptingTxnAtom, showReviewAtom } from 'app/features/trident/context/atoms'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { useBentoBoxContract, useTridentRouterContract } from 'app/hooks'
import { useConstantProductPool } from 'app/hooks/useConstantProductPools'
import { ConstantProductPoolState } from 'app/hooks/useConstantProductPools'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import React, { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import LoadingCircle from '../../../../animation/loading-circle.json'
import {
  createAnOracleSelectionAtom,
  getAllParsedAmountsSelector,
  getAllSelectedAssetsSelector,
  selectedFeeTierAtom,
} from '../context/atoms'

export const SelectionContinueButton: FC = () => {
  const { i18n } = useLingui()
  const bentoBox = useBentoBoxContract()
  const router = useTridentRouterContract()
  const { account } = useActiveWeb3React()

  const selectedFeeTier = useRecoilValue(selectedFeeTierAtom)
  const createOracle = useRecoilValue(createAnOracleSelectionAtom)
  const assets = useRecoilValue(getAllSelectedAssetsSelector)
  const parsedAmounts = useRecoilValue(getAllParsedAmountsSelector)
  const [, setShowReview] = useRecoilState(showReviewAtom)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  const { state } = useConstantProductPool(assets[0]?.currency, assets[1]?.currency, selectedFeeTier, createOracle)

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !assets[0]?.currency || !assets[1]?.currency
    ? i18n._(t`Select tokens`)
    : !assets[0].amount || !assets[1].amount
    ? i18n._(t`No amount selected`)
    : assets[0].error || assets[1].error
    ? i18n._(t`Error in asset selection`)
    : !selectedFeeTier
    ? i18n._(t`Select fee tier`)
    : state === ConstantProductPoolState.EXISTS
    ? i18n._(t`Pool already exists`)
    : undefined

  return (
    <div className="w-72">
      <TridentApproveGate
        inputAmounts={parsedAmounts}
        tokenApproveOn={bentoBox?.address}
        masterContractAddress={router?.address}
        withPermit={true}
      >
        {({ loading, approved }) => (
          <Button
            id="btn-review-confirm"
            disabled={Boolean(error) || loading || !approved}
            color="gradient"
            variant="filled"
            onClick={() => !error && setShowReview(true)}
            {...(loading && {
              startIcon: (
                <div className="w-4 h-4 mr-1">
                  <Lottie animationData={LoadingCircle} autoplay loop />
                </div>
              ),
            })}
          >
            {error
              ? error
              : attemptingTxn
              ? i18n._(t`Transaction pending`)
              : loading
              ? i18n._(t`Loading`)
              : !approved
              ? i18n._(t`Approve to continue`)
              : i18n._(t`Review & Confirm`)}
          </Button>
        )}
      </TridentApproveGate>
    </div>
  )
}
