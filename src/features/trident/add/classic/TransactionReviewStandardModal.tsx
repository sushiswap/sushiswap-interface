import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
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
      maxWidth="md"
    >
      {!txHash ? (
        <div className="flex flex-col gap-4">
          <HeadlessUIModal.Header header={i18n._(t`Confirm add liquidity`)} onClose={() => setShowReview(false)} />
          <Typography variant="sm">
            {i18n._(t`Output is estimated. If the price changes by more than 0.5% your transaction will revert.`)}
          </Typography>
          <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
            <Typography weight={700} variant="sm" className="text-secondary">
              {i18n._(t`You are depositing:`)}
            </Typography>
            <ListPanel
              items={parsedAmounts.reduce<ReactNode[]>((acc, cur, index) => {
                if (cur?.greaterThan(ZERO)) acc.push(<ListPanel.CurrencyAmountItem amount={cur} key={index} />)
                return acc
              }, [])}
            />
          </HeadlessUIModal.BorderedContent>
          <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
            <Typography weight={700} variant="sm" className="text-secondary">
              {i18n._(t`You'll receive (at least):`)}
            </Typography>
            <Typography weight={700} variant="lg" className="text-high-emphesis">
              {liquidityMinted?.toSignificant(6)} SLP
            </Typography>
          </HeadlessUIModal.BorderedContent>
          <div className="flex justify-between px-2 py-1">
            <Typography variant="sm" className="text-secondary">
              {i18n._(t`Share of Pool`)}
            </Typography>
            <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
              {poolShareBefore?.greaterThan(0) ? poolShareBefore?.toSignificant(6) : '0.000'}% →{' '}
              {poolShareAfter?.toSignificant(6) || '0.000'}%
            </Typography>
          </div>
          <Button id={`btn-modal-confirm-deposit`} disabled={attemptingTxn} color="blue" onClick={execute}>
            {i18n._(t`Confirm Deposit`)}
          </Button>
        </div>
      ) : (
        <DepositSubmittedModalContent txHash={txHash} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default TransactionReviewStandardModal
