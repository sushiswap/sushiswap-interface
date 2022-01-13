import { ArrowDownIcon, ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { TradeVersion } from '@sushiswap/core-sdk'
import { isValidAddress } from '@walletconnect/utils'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Divider from 'app/components/Divider'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import useCurrenciesFromURL from 'app/features/trident/context/hooks/useCurrenciesFromURL'
import { useDerivedTridentSwapContext } from 'app/features/trident/swap/DerivedTradeContext'
import { selectTridentSwap, setShowReview, setTridentSwapState, TypedField } from 'app/features/trident/swap/swapSlice'
import SwapSubmittedModalContent from 'app/features/trident/swap/SwapSubmittedModalContent'
import { shortenAddress, toAmountCurrencyAmount, warningSeverity } from 'app/functions'
import { getTradeVersion } from 'app/functions/getTradeVersion'
import useBentoRebases from 'app/hooks/useBentoRebases'
import useENS from 'app/hooks/useENS'
import { SwapCallbackState, useSwapCallback } from 'app/hooks/useSwapCallback'
import useSwapSlippageTolerance from 'app/hooks/useSwapSlippageTollerence'
import useTransactionStatus from 'app/hooks/useTransactionStatus'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { FC, useCallback, useMemo, useState } from 'react'

import SwapRate from './SwapRate'

const SwapReviewModal: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { currencies } = useCurrenciesFromURL()
  const { recipient, showReview, spendFromWallet, receiveToWallet } = useAppSelector(selectTridentSwap)
  const { address } = useENS(recipient)
  const { rebases } = useBentoRebases(currencies)
  const tx = useTransactionStatus()
  const [cbError, setCbError] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const { trade, parsedAmounts, priceImpact } = useDerivedTridentSwapContext()

  const allowedSlippage = useSwapSlippageTolerance(trade)

  const { state, callback, error } = useSwapCallback(trade, allowedSlippage, address, null, {
    receiveToWallet,
    fromWallet: spendFromWallet,
    parsedAmounts,
  })

  const execute = useCallback(async () => {
    if (!callback) return

    try {
      const txHash = await callback()
      setTxHash(txHash)

      // Reset inputs
      dispatch(setTridentSwapState({ value: '', typedField: TypedField.A }))
    } catch (e) {
      setCbError(e.message)
    }
  }, [callback, dispatch])

  const minimumAmountOutLegacy = trade ? trade.minimumAmountOut(allowedSlippage) : undefined
  const minimumAmountOutTrident =
    rebases && minimumAmountOutLegacy && rebases[minimumAmountOutLegacy.currency.wrapped.address]
      ? toAmountCurrencyAmount(
          rebases[minimumAmountOutLegacy.currency.wrapped.address],
          minimumAmountOutLegacy?.wrapped
        )
      : undefined
  const minimumAmountOut =
    getTradeVersion(trade) === TradeVersion.V3TRADE ? minimumAmountOutTrident : minimumAmountOutLegacy

  const priceImpactClassName = useMemo(() => {
    if (!priceImpact) return undefined
    if (priceImpact.lessThan('0')) return 'text-green'
    const severity = warningSeverity(priceImpact)
    if (severity < 1) return 'text-green'
    if (severity < 2) return 'text-yellow'
    if (severity < 3) return 'text-red'
    return 'text-red'
  }, [priceImpact])

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled
      isOpen={showReview}
      onDismiss={() => dispatch(setShowReview(false))}
      afterLeave={() => setTxHash(undefined)}
    >
      {!txHash ? (
        <div className="flex flex-col h-full gap-5 pb-4 lg:w-full">
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
                  {i18n._(t`Confirm Swap`)}
                </Typography>
                <Typography variant="sm" weight={700}>
                  {i18n._(
                    t`Output is estimated. You will receive at least ${minimumAmountOut?.toSignificant(4)} ${
                      currencies[1]?.symbol
                    } or the transaction will revert`
                  )}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-5">
            <div className="flex items-center gap-3">
              <CurrencyLogo currency={parsedAmounts?.[0]?.currency} size={48} className="rounded-full" />
              <Typography variant="h3" weight={700} className="text-white">
                {parsedAmounts?.[0]?.toSignificant(6)}
              </Typography>
              <Typography variant="h3" weight={700} className="text-secondary">
                {parsedAmounts?.[0]?.currency.symbol}
              </Typography>
            </div>
            <div className="flex justify-center w-12 text-secondary">
              <ArrowDownIcon width={20} />
            </div>
            <div className="flex items-center gap-3">
              <CurrencyLogo currency={parsedAmounts?.[1]?.currency} size={48} className="rounded-full" />
              <Typography variant="h3" weight={700} className="text-white">
                {parsedAmounts?.[1]?.toSignificant(6)}
              </Typography>
              <Typography variant="h3" weight={700} className="text-secondary">
                {currencies[1]?.symbol}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-5">
            <Divider className="border-dark-800" />
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Minimum received`)}
              </Typography>
              <Typography variant="sm" className="text-high-emphesis" weight={700}>
                {minimumAmountOut?.toSignificant(4)} <span className="text-low-emphesis">{currencies[1]?.symbol}</span>
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Price impact`)}
              </Typography>
              <Typography variant="sm" className={priceImpactClassName} weight={700}>
                {priceImpact?.toSignificant(3)}%
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Slippage tolerance`)}
              </Typography>
              <Typography variant="sm" className="text-high-emphesis" weight={700}>
                {allowedSlippage?.toSignificant(3)}%
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
              id="review-swap-button"
              disabled={!!tx || state === SwapCallbackState.INVALID}
              color="gradient"
              size="lg"
              onClick={execute}
              className="mt-4 mb-2"
            >
              {error && !txHash ? error : recipient ? i18n._(t`Swap and send to recipient`) : i18n._(t`Swap`)}
            </Button>
            {!txHash && (error || cbError) && (
              <Typography variant="xs" weight={700} className="text-center text-red">
                {error || cbError}
              </Typography>
            )}
          </div>
        </div>
      ) : (
        <SwapSubmittedModalContent txHash={txHash} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default SwapReviewModal
