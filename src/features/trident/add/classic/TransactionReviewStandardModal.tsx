import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Divider from 'app/components/Divider'
import ListPanel from 'app/components/ListPanel'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import DepositSubmittedModalContent from 'app/features/trident/DepositSubmittedModalContent'
import { FC, ReactNode, useCallback, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { attemptingTxnAtom, DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE, showReviewAtom } from '../../context/atoms'
import { useClassicStandardAddExecute } from '../../context/hooks/useClassicStandardAddExecute'
import { useDependentAssetInputs } from '../../context/hooks/useDependentAssetInputs'
import { usePoolDetailsMint } from '../../context/hooks/usePoolDetails'

const TransactionReviewStandardModal: FC = () => {
  const { i18n } = useLingui()
  const [txHash, setTxHash] = useState<string>()
  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  const { parsedAmounts } = useDependentAssetInputs()
  const _execute = useClassicStandardAddExecute()
  const { liquidityMinted, poolShareAfter, poolShareBefore } = usePoolDetailsMint(
    parsedAmounts,
    DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE
  )

  const execute = useCallback(async () => {
    const tx = await _execute()
    if (tx.hash) {
      setTxHash(tx.hash)
    }
  }, [_execute])

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled
      isOpen={showReview}
      onDismiss={() => setShowReview(false)}
      afterLeave={() => setTxHash(undefined)}
    >
      {!txHash ? (
        <div className="flex flex-col h-full gap-8 pb-4 lg:max-w-lg">
          <div className="relative">
            <div className="absolute w-full h-full pointer-events-none bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
            <div className="flex flex-col gap-4 px-5 pt-5 pb-8">
              <div className="flex flex-row justify-between">
                <Button
                  color="blue"
                  variant="outlined"
                  size="sm"
                  className="py-1 pl-2 rounded-full cursor-pointer"
                  startIcon={<ChevronLeftIcon width={24} height={24} />}
                  onClick={() => setShowReview(false)}
                >
                  {i18n._(t`Back`)}
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Typography variant="h2" weight={700} className="text-high-emphesis">
                  {i18n._(t`Confirm Add Liquidity`)}
                </Typography>
                <Typography variant="sm">
                  {i18n._(t`Output is estimated. If the price changes by more than 0.5% your transaction will revert.`)}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 px-5">
              <Typography weight={700} variant="lg">
                {i18n._(t`You are depositing:`)}
              </Typography>
              <ListPanel
                items={parsedAmounts.reduce<ReactNode[]>((acc, cur, index) => {
                  if (cur?.greaterThan(ZERO)) acc.push(<ListPanel.CurrencyAmountItem amount={cur} key={index} />)
                  return acc
                }, [])}
              />
            </div>
            <div className="flex flex-row justify-between px-5">
              <Typography weight={700} variant="lg">
                {i18n._(t`You'll receive (at least):`)}
              </Typography>
              <Typography weight={700} variant="lg" className="text-high-emphesis">
                {liquidityMinted?.toSignificant(6)} SLP
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-5 px-5">
            <Divider />
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <Typography variant="sm" className="text-secondary">
                  {i18n._(t`Share of Pool`)}
                </Typography>
                <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
                  {poolShareBefore?.greaterThan(0) ? poolShareBefore?.toSignificant(6) : '0.000'}% →{' '}
                  {poolShareAfter?.toSignificant(6) || '0.000'}%
                </Typography>
              </div>
            </div>
            <Button
              id={`btn-modal-confirm-deposit`}
              disabled={attemptingTxn}
              color="gradient"
              size="lg"
              onClick={execute}
            >
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {i18n._(t`Confirm Deposit`)}
              </Typography>
            </Button>
          </div>
        </div>
      ) : (
        <DepositSubmittedModalContent txHash={txHash} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default TransactionReviewStandardModal
