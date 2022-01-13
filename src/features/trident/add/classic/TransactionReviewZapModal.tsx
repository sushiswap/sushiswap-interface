import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Divider from 'app/components/Divider'
import ListPanel from 'app/components/ListPanel'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { attemptingTxnAtom, DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE, showReviewAtom } from '../../context/atoms'
import { usePoolDetailsMint } from '../../context/hooks/usePoolDetails'
import { useZapAssetInput } from '../../context/hooks/useZapAssetInput'

const TransactionReviewZapModal: FC = () => {
  const { i18n } = useLingui()
  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  const { parsedAmount, parsedSplitAmounts } = useZapAssetInput()
  const { poolShareBefore, poolShareAfter, liquidityMinted } = usePoolDetailsMint(
    parsedSplitAmounts,
    DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE
  )

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled isOpen={showReview} onDismiss={() => setShowReview(false)}>
      <div className="flex flex-col gap-8 h-full pb-4 lg:max-w-lg">
        <div className="relative">
          <div className="pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
          <div className="px-5 pt-5 pb-8 flex flex-col gap-4">
            <div className="flex flex-row justify-between">
              <Button
                color="blue"
                variant="outlined"
                size="sm"
                className="!rounded-full"
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
            <ListPanel items={[<ListPanel.CurrencyAmountItem amount={parsedAmount} key={0} />]} />
          </div>
          <div className="flex flex-col gap-3 px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`Which will be converted to:`)}
            </Typography>
            <ListPanel
              items={parsedSplitAmounts.map((amount, index) => (
                <ListPanel.CurrencyAmountItem amount={amount} key={index} />
              ))}
            />
          </div>
          <div className="flex flex-row justify-between px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`You'll receive:`)}
            </Typography>
            <Typography weight={700} variant="lg" className="text-high-emphesis">
              {liquidityMinted?.toSignificant(6)} SLP
            </Typography>
          </div>
        </div>
        <div className="flex flex-col px-5 gap-5">
          <Divider />
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Share of Pool`)}
              </Typography>
              <Typography variant="sm" weight={700} className="text-high-emphesis text-right">
                {poolShareBefore?.greaterThan(0) ? poolShareBefore?.toSignificant(6) : '0.000'}% →{' '}
                {poolShareAfter?.toSignificant(6) || '0.000'}%
              </Typography>
            </div>
          </div>
          <Button disabled={attemptingTxn} color="gradient" size="lg" onClick={() => {}}>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {i18n._(t`Confirm Deposit`)}
            </Typography>
          </Button>
        </div>
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default TransactionReviewZapModal
