import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import { useClassicSingleRemoveExecute } from 'app/features/trident/context/hooks/useClassicSingleRemoveExecute'
import useRemovePercentageInput from 'app/features/trident/context/hooks/useRemovePercentageInput'
import Button from 'components/Button'
import Divider from 'components/Divider'
import ListPanel from 'components/ListPanel'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import React, { FC, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { attemptingTxnAtom, DEFAULT_REMOVE_V2_SLIPPAGE_TOLERANCE, showReviewAtom } from '../../context/atoms'
import { usePoolDetailsBurn } from '../../context/hooks/usePoolDetails'

interface RemoveTransactionReviewSingleModal {}

const RemoveTransactionReviewZapModal: FC<RemoveTransactionReviewSingleModal> = () => {
  const { i18n } = useLingui()
  const execute = useClassicSingleRemoveExecute()
  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  const {
    parsedAmounts,
    parsedSLPAmount,
    zapCurrency: [zapCurrency],
    outputToWallet,
  } = useRemovePercentageInput()
  const { poolShareAfter, poolShareBefore, minLiquidityOutputSingleToken } = usePoolDetailsBurn(
    parsedSLPAmount,
    DEFAULT_REMOVE_V2_SLIPPAGE_TOLERANCE
  )
  const minOutputAmount = useMemo(() => {
    const amount = minLiquidityOutputSingleToken(zapCurrency)
    if (zapCurrency?.isNative && outputToWallet) {
      return CurrencyAmount.fromRawAmount(zapCurrency, amount.quotient.toString())
    }

    return amount
  }, [minLiquidityOutputSingleToken, outputToWallet, zapCurrency])

  return (
    <HeadlessUIModal.Controlled isOpen={showReview} onDismiss={() => setShowReview(false)}>
      <div className="flex flex-col gap-8 h-full lg:max-w-md">
        <div className="relative">
          <div className="pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
          <div className="px-5 pt-5 pb-8 flex flex-col gap-4">
            <div className="flex flex-row justify-between">
              <Button
                color="blue"
                variant="outlined"
                size="sm"
                className="rounded-full py-1 pl-2 cursor-pointer"
                startIcon={<ChevronLeftIcon width={24} height={24} />}
                onClick={() => setShowReview(false)}
              >
                {i18n._(t`Back`)}
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="h2" weight={700} className="text-high-emphesis">
                {i18n._(t`Confirm Withdrawal`)}
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
              {i18n._(t`You are removing:`)}
            </Typography>
            <ListPanel
              items={parsedAmounts.map((parsedInputAmount, index) => (
                <ListPanel.CurrencyAmountItem amount={parsedInputAmount} key={index} />
              ))}
            />
          </div>
          <div className="flex flex-col gap-3 px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`Which will be converted to...`)}
            </Typography>
            <ListPanel items={[<ListPanel.CurrencyAmountItem amount={minOutputAmount} key={0} />]} />
          </div>
          <div className="flex flex-row justify-between px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`...and deposited to your:`)}
            </Typography>
            <Typography weight={700} variant="lg" className="text-high-emphesis">
              {outputToWallet ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)}
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
              <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
                {poolShareBefore?.greaterThan(0) ? poolShareBefore?.toSignificant(6) : '0.000'}% →{' '}
                <span className="text-green">{poolShareAfter?.toSignificant(6) || '0.000'}%</span>
              </Typography>
            </div>
          </div>
          <Button disabled={attemptingTxn} color="gradient" size="lg" onClick={execute}>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {i18n._(t`Confirm Withdrawal`)}
            </Typography>
          </Button>

          {/*spacer*/}
          <span />
        </div>
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default RemoveTransactionReviewZapModal
