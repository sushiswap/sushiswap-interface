import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'animation/loading-circle.json'
import swapArrows from 'animation/swap-arrows.json'
import { useActiveWeb3React } from 'app/services/web3'
import { transactionStateSelector } from 'app/state/global/transactions'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { getExplorerLink } from 'functions/explorer'
import Lottie from 'lottie-react'
import React, { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { txHashAtom } from '../context/atoms'

const SwapSubmittedModal: FC = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [txHash, setTxHash] = useRecoilState(txHashAtom)
  const { pending, success, cancelled, failed } = useRecoilValue(transactionStateSelector(txHash))

  return (
    <HeadlessUiModal.Controlled isOpen={!!txHash} onDismiss={() => setTxHash('')}>
      <div className="flex flex-col items-center justify-center px-8 lg:p-12 bg-dark-800/90 h-full gap-3">
        <div className="w-[102px] h-[102px] bg-dark-900 rounded-full">
          <Lottie animationData={swapArrows} autoplay loop />
        </div>
        <Typography variant="h3" weight={700} className="text-high-emphesis">
          {i18n._(t`Swap Submitted!`)}
        </Typography>
        <div className="flex flex-col gap-1 rounded py-2 px-3">
          <div className="flex gap-2 items-center justify-center">
            <Typography variant="sm" weight={700} className="text-blue">
              <a target="_blank" rel="noreferrer" href={getExplorerLink(chainId, txHash, 'transaction')}>
                {i18n._(t`View on Explorer`)}
              </a>
            </Typography>
          </div>
          <div className="flex flex-row items-center gap-2 justify-center">
            {pending ? (
              <div className="w-4 h-4">
                <Lottie animationData={loadingCircle} autoplay loop />
              </div>
            ) : success ? (
              <CheckCircleIcon className="w-4 h-4 text-green" />
            ) : cancelled || failed ? (
              <XCircleIcon className="w-4 h-4 text-high-emphesis" />
            ) : (
              ''
            )}
            <Typography variant="sm" weight={700} className="italic">
              {pending
                ? i18n._(t`Processing`)
                : success
                ? i18n._(t`Success`)
                : cancelled
                ? i18n._(t`Cancelled`)
                : failed
                ? i18n._(t`Failed`)
                : ''}
            </Typography>
          </div>
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default SwapSubmittedModal
