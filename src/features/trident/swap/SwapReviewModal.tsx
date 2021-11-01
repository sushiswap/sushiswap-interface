import { ArrowDownIcon, ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { isValidAddress } from '@walletconnect/utils'
import Button from 'components/Button'
import CurrencyLogo from 'components/CurrencyLogo'
import Divider from 'components/Divider'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { shortenAddress } from 'functions'
import useENS from 'hooks/useENS'
import { SwapCallbackState, useSwapCallback } from 'hooks/useSwapCallback'
import useSwapSlippageTolerance from 'hooks/useSwapSlippageTollerence'
import useTransactionStatus from 'hooks/useTransactionStatus'
import { FC, useCallback } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { showReviewAtom, txHashAtom } from '../context/atoms'
import useSwapAssetPanelInputs from '../context/hooks/useSwapAssetPanelInputs'
import RecipientPanel from './RecipientPanel'
import SwapRate from './SwapRate'

const SwapReviewModal: FC = () => {
  const { i18n } = useLingui()
  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const { trade, reset } = useSwapAssetPanelInputs()
  const recipient = useRecoilValue(RecipientPanel.atom)
  const { address } = useENS(recipient)
  const setTxHash = useSetRecoilState(txHashAtom)
  const allowedSlippage = useSwapSlippageTolerance(trade)
  const tx = useTransactionStatus()

  // TODO allow with Permit
  const { state, callback, error } = useSwapCallback(trade, allowedSlippage, address, null)

  const execute = useCallback(async () => {
    if (!callback) return

    try {
      const txHash = await callback()

      // Reset inputs
      reset()

      // Set txHash (this opens SwapSubmittedModal)
      setTxHash(txHash)

      // Close this modal
      setShowReview(false)
    } catch (e) {
      console.log(e)
    }
  }, [callback, reset, setShowReview, setTxHash])

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled isOpen={showReview} onDismiss={() => setShowReview(false)}>
      <div className="flex flex-col gap-5 h-full pb-4 lg:max-w-md">
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
                {i18n._(t`Confirm Swap`)}
              </Typography>
              <Typography variant="sm" weight={700}>
                {i18n._(
                  t`Output is estimated. You will receive at least ${trade
                    ?.minimumAmountOut(allowedSlippage)
                    .toSignificant(4)} ${trade?.outputAmount.wrapped.currency.symbol} or the transaction will revert`
                )}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-5">
          <div className="flex gap-3 items-center">
            <CurrencyLogo currency={trade?.inputAmount.currency} size={48} className="rounded-full" />
            <Typography variant="h3" weight={700} className="text-white">
              {trade?.inputAmount.toSignificant(6)}
            </Typography>
            <Typography variant="h3" weight={700} className="text-secondary">
              {trade?.inputAmount.currency.symbol}
            </Typography>
          </div>
          <div className="w-12 flex justify-center text-secondary">
            <ArrowDownIcon width={20} />
          </div>
          <div className="flex gap-3 items-center">
            <CurrencyLogo currency={trade?.outputAmount.currency} size={48} className="rounded-full" />
            <Typography variant="h3" weight={700} className="text-white">
              {trade?.outputAmount.toSignificant(4)}
            </Typography>
            <Typography variant="h3" weight={700} className="text-secondary">
              {trade?.outputAmount.currency.symbol}
            </Typography>
          </div>
        </div>
        <div className="px-5 flex flex-col gap-3">
          <Divider className="border-dark-800" />

          {/*TODO ramin*/}
          {/*<div className="flex justify-between">*/}
          {/*  <Typography variant="sm" className="text-secondary">*/}
          {/*    {i18n._(t`Route`)}*/}
          {/*  </Typography>*/}
          {/*  <Typography variant="sm" className="text-high-emphesis" weight={700}>*/}
          {/*  </Typography>*/}
          {/*</div>*/}
          <div className="flex justify-between">
            <Typography variant="sm" className="text-secondary">
              {i18n._(t`Minimum received`)}
            </Typography>
            <Typography variant="sm" className="text-high-emphesis" weight={700}>
              {trade?.minimumAmountOut(allowedSlippage).toSignificant(4)}{' '}
              <span className="text-low-emphesis">{trade?.outputAmount.wrapped.currency.symbol}</span>
            </Typography>
          </div>
          <div className="flex justify-between">
            <Typography variant="sm" className="text-secondary">
              {i18n._(t`Price impact`)}
            </Typography>
            <Typography variant="sm" className="text-high-emphesis" weight={700}>
              {trade?.priceImpact.toSignificant(2)}%
            </Typography>
          </div>
          <div className="flex justify-between">
            <Typography variant="sm" className="text-secondary">
              {i18n._(t`Slippage tolerance`)}
            </Typography>
            <Typography variant="sm" className="text-high-emphesis" weight={700}>
              {allowedSlippage?.toSignificant(2)}%
            </Typography>
          </div>
          <SwapRate className="text-secondary" />
          {address && isValidAddress(address) && (
            <div className="flex justify-between">
              <Typography variant="sm" className="text-yellow">
                {i18n._(t`Recipient`)}
              </Typography>
              <Typography variant="sm" className="text-yellow" weight={700}>
                {shortenAddress(address)}
              </Typography>
            </div>
          )}
          <Button
            disabled={!!tx || state === SwapCallbackState.INVALID}
            color="gradient"
            size="lg"
            onClick={execute}
            className="mb-2 mt-4"
          >
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {error ? error : recipient ? i18n._(t`Swap and send to recipient`) : i18n._(t`Swap`)}
            </Typography>
          </Button>
        </div>
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default SwapReviewModal
