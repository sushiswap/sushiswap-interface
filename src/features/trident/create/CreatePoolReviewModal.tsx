import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PoolType } from '@sushiswap/tines'
import Button from 'app/components/Button'
import Divider from 'app/components/Divider'
import ListPanel from 'app/components/ListPanel'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { selectTridentCreate, setCreateShowReview, setCreateTxHash } from 'app/features/trident/create/createSlice'
import { PoolCreationSubmittedModalContent } from 'app/features/trident/create/PoolCreationSubmittedModalContent'
import {
  useCreatePoolDerivedCurrencyAmounts,
  useCreatePoolDerivedPrice,
} from 'app/features/trident/create/useCreateDerivedState'
import { useCreatePoolExecute } from 'app/features/trident/create/useCreatePoolExecute'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC, useCallback } from 'react'

export const CreatePoolReviewModal: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { showReview, attemptingTxn, txHash, selectedPoolType, selectedAssets, bentoPermit } =
    useAppSelector(selectTridentCreate)
  const parsedAmounts = useCreatePoolDerivedCurrencyAmounts()
  const price = useCreatePoolDerivedPrice()
  const execute = useCreatePoolExecute()

  const _execute = useCallback(async () => {
    const tx = await execute({ parsedAmounts, bentoPermit })
    if (tx && tx.hash) {
      dispatch(setCreateTxHash(tx.hash))
    }
  }, [execute, parsedAmounts, bentoPermit, dispatch])

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled
      isOpen={showReview}
      onDismiss={() => dispatch(setCreateShowReview(false))}
      afterLeave={() => dispatch(setCreateTxHash(undefined))}
      unmount={false}
      maxWidth="md"
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
                  onClick={() => dispatch(setCreateShowReview(false))}
                >
                  {i18n._(t`Back`)}
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Typography variant="h2" weight={700} className="text-high-emphesis">
                  {i18n._(t`Confirm Pool Creation`)}
                </Typography>
                <Typography variant="sm">
                  {i18n._(
                    t`When creating a pool you are the first liquidity provider. The ratio of tokens you add will set the price of this pool.`
                  )}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 px-5">
              <Typography weight={700} variant="lg">
                {selectedPoolType === PoolType.ConstantProduct && i18n._(t`You are creating a classic pool with:`)}
                {selectedPoolType === PoolType.Weighted && i18n._(t`You are creating a index pool with:`)}
                {selectedPoolType === PoolType.Hybrid && i18n._(t`You are creating a multi-asset pool with:`)}
                {selectedPoolType === PoolType.ConcentratedLiquidity &&
                  i18n._(t`You are creating a concentrated liquidity pool with:`)}
              </Typography>
              <ListPanel
                items={selectedAssets.map((asset, index) => (
                  <ListPanel.CurrencyAmountItem amount={asset.parsedAmount} key={index} />
                ))}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 px-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <Typography variant="sm">{i18n._(t`Rates:`)}</Typography>
                <Typography variant="sm" className="text-right">
                  1 {selectedAssets?.[0].currency?.symbol} = {price?.toSignificant(6)}{' '}
                  {selectedAssets?.[1].currency?.symbol}
                </Typography>
              </div>
              <div className="flex justify-end">
                <Typography variant="sm" className="text-right">
                  1 {selectedAssets?.[1].currency?.symbol} = {price?.invert().toSignificant(6)}{' '}
                  {selectedAssets?.[0].currency?.symbol}
                </Typography>
              </div>
            </div>

            <Divider />

            <div className="flex flex-col gap-1">
              {selectedAssets.map((asset, i) => (
                <div className="flex justify-between" key={i}>
                  <Typography variant="sm" className="text-secondary">
                    {i18n._(t`${asset.currency?.symbol} Deposited:`)}
                  </Typography>
                  <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
                    0.00 → {asset.parsedAmount?.toSignificant(6)} {asset.currency?.symbol}
                  </Typography>
                </div>
              ))}
              <div className="flex justify-between">
                <Typography variant="sm" className="text-secondary">
                  {i18n._(t`Share of Pool`)}
                </Typography>
                <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
                  0.00% → <span className="text-green">100%</span>
                </Typography>
              </div>
            </div>
            <Button
              id="btn-confirm-pool-creation"
              color="gradient"
              size="lg"
              onClick={_execute}
              disabled={attemptingTxn}
            >
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {attemptingTxn ? i18n._(t`Transaction pending`) : i18n._(t`Confirm Pool Creation`)}
              </Typography>
            </Button>
          </div>
        </div>
      ) : (
        <PoolCreationSubmittedModalContent txHash={txHash} onDismiss={() => dispatch(setCreateTxHash(undefined))} />
      )}
    </HeadlessUIModal.Controlled>
  )
}
