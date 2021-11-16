import { ArrowDownIcon, ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { JSBI, Percent } from '@sushiswap/core-sdk'
import { isValidAddress } from '@walletconnect/utils'
import useCurrenciesFromURL from 'app/features/trident/context/hooks/useCurrenciesFromURL'
import { TridentApproveGateBentoPermitAtom } from 'app/features/trident/TridentApproveGate'
import useBentoRebases from 'app/hooks/useBentoRebases'
import Button from 'components/Button'
import CurrencyLogo from 'components/CurrencyLogo'
import Divider from 'components/Divider'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { shortenAddress, toAmountCurrencyAmount, warningSeverity } from 'functions'
import useENS from 'hooks/useENS'
import { SwapCallbackState, useSwapCallback } from 'hooks/useSwapCallback'
import useSwapSlippageTolerance from 'hooks/useSwapSlippageTollerence'
import useTransactionStatus from 'hooks/useTransactionStatus'
import { FC, useCallback, useMemo, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { showReviewAtom, txHashAtom } from '../context/atoms'
import useSwapAssetPanelInputs from '../context/hooks/useSwapAssetPanelInputs'
import RecipientPanel from './RecipientPanel'
import SwapRate from './SwapRate'

const SwapReviewModal: FC = () => {
  const { i18n } = useLingui()
  const { currencies } = useCurrenciesFromURL()
  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const { trade, reset } = useSwapAssetPanelInputs()
  const recipient = useRecoilValue(RecipientPanel.atom)
  const { address } = useENS(recipient)
  const [txHash, setTxHash] = useRecoilState(txHashAtom)
  const allowedSlippage = useSwapSlippageTolerance(trade)
  const tx = useTransactionStatus()
  const bentoPermit = useRecoilValue(TridentApproveGateBentoPermitAtom)
  const [cbError, setCbError] = useState<string>()
  const { rebases } = useBentoRebases(currencies)

  const {
    parsedAmounts: [inputAmount, outputAmount, outputMinAmount],
    spendFromWallet: [fromWallet],
    receiveToWallet: [receiveToWallet],
  } = useSwapAssetPanelInputs()

  const { state, callback, error } = useSwapCallback(trade, allowedSlippage, address, null, {
    bentoPermit,
    receiveToWallet,
    inputAmount,
    outputAmount: outputMinAmount,
    fromWallet,
  })

  const closeModal = useCallback(() => {
    setShowReview(false)
    setCbError(undefined)
  }, [setShowReview])

  const execute = useCallback(async () => {
    if (!callback) return

    try {
      const txHash = await callback()

      // Reset inputs
      reset()

      // Set txHash (this opens SwapSubmittedModal)
      setTxHash(txHash)

      // Close this modal
      closeModal()
    } catch (e) {
      setCbError(e.message)
    }
  }, [callback, closeModal, reset, setTxHash])

  const minimumAmountOutShares = trade ? trade.minimumAmountOut(allowedSlippage) : undefined
  const minimumAmountOut =
    rebases && minimumAmountOutShares && rebases[minimumAmountOutShares.currency.wrapped.address]
      ? toAmountCurrencyAmount(
          rebases[minimumAmountOutShares.currency.wrapped.address],
          minimumAmountOutShares?.wrapped
        )
      : undefined

  const priceImpact = trade
    ? new Percent(
        trade.route.priceImpact.toString().toBigNumber(18).toString(),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
      )
    : undefined

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
    <HeadlessUIModal.Controlled isOpen={showReview} onDismiss={closeModal}>
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
                  t`Output is estimated. You will receive at least ${minimumAmountOut?.toSignificant(4)} ${
                    currencies[1]?.symbol
                  } or the transaction will revert`
                )}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-5">
          <div className="flex gap-3 items-center">
            <CurrencyLogo currency={inputAmount?.currency} size={48} className="rounded-full" />
            <Typography variant="h3" weight={700} className="text-white">
              {inputAmount?.toSignificant(6)}
            </Typography>
            <Typography variant="h3" weight={700} className="text-secondary">
              {inputAmount?.currency.symbol}
            </Typography>
          </div>
          <div className="w-12 flex justify-center text-secondary">
            <ArrowDownIcon width={20} />
          </div>
          <div className="flex gap-3 items-center">
            <CurrencyLogo currency={outputAmount?.currency} size={48} className="rounded-full" />
            <Typography variant="h3" weight={700} className="text-white">
              {outputAmount?.toSignificant(6)}
            </Typography>
            <Typography variant="h3" weight={700} className="text-secondary">
              {currencies[1]?.symbol}
            </Typography>
          </div>
        </div>
        <div className="px-5 flex flex-col gap-3">
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
            disabled={!!tx || state === SwapCallbackState.INVALID}
            color="gradient"
            size="lg"
            onClick={execute}
            className="mb-2 mt-4"
          >
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {error && !txHash ? error : recipient ? i18n._(t`Swap and send to recipient`) : i18n._(t`Swap`)}
            </Typography>
          </Button>
          {!txHash && (error || cbError) && (
            <Typography variant="xs" weight={700} className="text-red text-center">
              {error || cbError}
            </Typography>
          )}
        </div>
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default SwapReviewModal
