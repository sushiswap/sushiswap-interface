import React, { FC } from 'react'
import HeadlessUIModal from '../../../components/Modal/HeadlessUIModal'
import Button from '../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { showReviewAtom, spendFromWalletAtom } from '../context/atoms'
import ListPanel from '../../../components/ListPanel'
import Divider from '../../../components/Divider'
import { PoolType } from '@sushiswap/sdk'
import { useIndependentAssetInputs } from '../context/hooks/useIndependentAssetInputs'
import { usePoolDetails } from '../context/hooks/usePoolDetails'
import { usePoolCreateExecute } from '../context/hooks/usePoolCreateExecute'
import { useSetupPoolProperties } from '../context/hooks/useSetupPoolProperties'

const AddTransactionReviewModal: FC = () => {
  const { i18n } = useLingui()
  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const spendFromWallet = useRecoilValue(spendFromWalletAtom)
  const {
    parsedAmounts,
    currencies: [selectedPoolCurrencies],
  } = useIndependentAssetInputs()
  const { price } = usePoolDetails(parsedAmounts)
  const { classicExecute, weightedExecute, concentratedExecute, hybridExecute } = usePoolCreateExecute()
  const {
    poolType: [selectedPoolType],
  } = useSetupPoolProperties()

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled isOpen={showReview} onDismiss={() => setShowReview(false)}>
      <div className="flex flex-col gap-8 h-full">
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
                {i18n._(t`Confirm Pool Creation`)}
              </Typography>
              <Typography variant="sm">
                {i18n._(t`Output is estimated. If the price changes by more than 0.5% your transaction will revert.`)}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-row justify-between px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`You are creating a:`)}
            </Typography>
            <Typography weight={700} variant="lg" className="text-high-emphesis">
              {selectedPoolType === PoolType.ConstantProduct && i18n._(t`Classic Pool`)}
              {selectedPoolType === PoolType.Weighted && i18n._(t`Weighted Pool`)}
              {selectedPoolType === PoolType.Hybrid && i18n._(t`Multi-Asset Pool`)}
              {selectedPoolType === PoolType.ConcentratedLiquidity && i18n._(t`Concentrated Pool`)}
            </Typography>
          </div>
          <div className="flex flex-row justify-between px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`using funds from your:`)}
            </Typography>
            <Typography weight={700} variant="lg" className="text-high-emphesis">
              {spendFromWallet ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)}
            </Typography>
          </div>
          <div className="flex flex-col gap-3 px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`You are depositing:`)}
            </Typography>
            <ListPanel
              items={parsedAmounts.map((amount, index) => (
                <ListPanel.CurrencyAmountItem amount={amount} key={index} />
              ))}
            />
          </div>
        </div>
        <div className="flex flex-col px-5 gap-5">
          {price && (
            <>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <Typography variant="sm">{i18n._(t`Rates:`)}</Typography>
                  <Typography variant="sm" className="text-right">
                    1 {selectedPoolCurrencies[0]?.symbol} = {price?.toSignificant(6)}{' '}
                    {selectedPoolCurrencies[1]?.symbol}
                  </Typography>
                </div>
                <div className="flex justify-end">
                  <Typography variant="sm" className="text-right">
                    1 {selectedPoolCurrencies[1]?.symbol} = {price?.invert().toSignificant(6)}{' '}
                    {selectedPoolCurrencies[0]?.symbol}
                  </Typography>
                </div>
              </div>
              <Divider />
            </>
          )}
          <Button
            color="gradient"
            size="lg"
            onClick={
              selectedPoolType === PoolType.ConstantProduct
                ? classicExecute
                : selectedPoolType === PoolType.Weighted
                ? weightedExecute
                : selectedPoolType === PoolType.Hybrid
                ? hybridExecute
                : concentratedExecute
            }
          >
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {i18n._(t`Confirm Pool Creation`)}
            </Typography>
          </Button>
        </div>
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default AddTransactionReviewModal
