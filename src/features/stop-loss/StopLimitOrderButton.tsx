import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Trade, TradeType } from '@sushiswap/core-sdk'
import { STOP_LIMIT_ORDER_ADDRESS } from '@sushiswap/limit-order-sdk'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { STOP_LIMIT_ORDER_WRAPPER_ADDRESSES, STOP_LIMIT_ORDER_WRAPPER_FEE_MINIMUM } from 'app/constants/autonomy'
import useLimitOrderExecute, { DepositPayload } from 'app/features/legacy/limit-order/useLimitOrderExecute'
import { useEstimateEquivalentEthAmount } from 'app/features/stop-loss/useStopLossExecute'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { useBentoBoxContract } from 'app/hooks'
import useENS from 'app/hooks/useENS'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
import { useAppDispatch } from 'app/state/hooks'
import { setFromBentoBalance, setLimitOrderBentoPermit, setLimitOrderShowReview } from 'app/state/limit-order/actions'
import {
  useLimitOrderDerivedInputError,
  useLimitOrderDerivedLimitPrice,
  useLimitOrderState,
  useStopLossDerivedLimitPrice,
} from 'app/state/limit-order/hooks'
import { useMemo } from 'react'
import React, { FC, useCallback, useState } from 'react'

interface StopLimitOrderButton {
  trade?: Trade<Currency, Currency, TradeType>
  parsedAmounts: {
    inputAmount?: CurrencyAmount<Currency>
    outputAmount?: CurrencyAmount<Currency>
  }
}

const StopLimitOrderButton: FC<StopLimitOrderButton> = ({ trade, parsedAmounts }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { fromBentoBalance, bentoPermit, attemptingTxn, recipient } = useLimitOrderState()
  const { address } = useENS(recipient)
  const addPopup = useAddPopup()
  const rate = useLimitOrderDerivedLimitPrice()
  const stopRate = useStopLossDerivedLimitPrice()

  const error = useLimitOrderDerivedInputError({ trade, isStopLossOrder: true })
  const { deposit } = useLimitOrderExecute()
  const bentoboxContract = useBentoBoxContract()
  const masterContractAddress = chainId ? STOP_LIMIT_ORDER_ADDRESS[chainId] : undefined
  const [permitError, setPermitError] = useState(false)

  // check if difference between stopRate and minimum rate is enough to cover autonomy fee
  const diffOfStopAndMinRate = useMemo(() => {
    if (!stopRate || !rate || !parsedAmounts.inputAmount || stopRate.equalTo(rate) || stopRate.lessThan(rate))
      return undefined
    return stopRate?.quote(parsedAmounts.inputAmount).subtract(rate?.quote(parsedAmounts.inputAmount))
  }, [rate, stopRate, parsedAmounts])
  const diffValueOfEth = useEstimateEquivalentEthAmount(diffOfStopAndMinRate)
  const tooNarrowMarginOfRates = useMemo(
    () => chainId && parseFloat(diffValueOfEth) < parseFloat(STOP_LIMIT_ORDER_WRAPPER_FEE_MINIMUM[chainId]),
    [diffValueOfEth]
  )

  const _deposit = useCallback(
    async (payload: DepositPayload) => {
      const tx = await deposit(payload)
      if (tx?.hash) {
        dispatch(setFromBentoBalance(true))
      }
    },
    [deposit, dispatch]
  )

  const handler = useCallback(async () => {
    if (!parsedAmounts?.inputAmount) return

    if (chainId && !STOP_LIMIT_ORDER_WRAPPER_ADDRESSES[chainId]) {
      addPopup({
        txn: { hash: '', summary: 'Autonomy unsupported!', success: false },
      })
      return
    }

    if (fromBentoBalance) {
      dispatch(setLimitOrderShowReview(true))
    } else {
      await _deposit({
        inputAmount: parsedAmounts?.inputAmount,
        bentoPermit,
        fromBentoBalance,
      })
    }
  }, [_deposit, bentoPermit, dispatch, fromBentoBalance, parsedAmounts?.inputAmount])

  return (
    <>
      {permitError && (
        <Typography variant="sm" className="p-4 text-center border rounded border-yellow/40 text-yellow">
          {i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click 'Approve BentoBox' again for approving using the fallback method`
          )}
        </Typography>
      )}
      <TridentApproveGate
        inputAmounts={[trade?.inputAmount]}
        tokenApproveOn={bentoboxContract?.address}
        masterContractAddress={masterContractAddress}
        {...(fromBentoBalance
          ? { withPermit: false }
          : {
              withPermit: true,
              permit: bentoPermit,
              onPermit: (permit) => dispatch(setLimitOrderBentoPermit(permit)),
              onPermitError: () => setPermitError(true),
            })}
      >
        {({ approved, loading }) => {
          const disabled =
            !!error ||
            !!tooNarrowMarginOfRates ||
            !approved ||
            loading ||
            attemptingTxn ||
            Boolean(recipient && !address && error)
          return (
            <Button
              loading={loading || attemptingTxn}
              color="gradient"
              disabled={disabled}
              onClick={handler}
              className="rounded-2xl md:rounded"
            >
              {error
                ? error
                : tooNarrowMarginOfRates
                ? 'Too narrow margin of rates'
                : fromBentoBalance
                ? i18n._(t`Review Stop Limit Order`)
                : i18n._(t`Confirm Deposit`)}
            </Button>
          )
        }}
      </TridentApproveGate>
    </>
  )
}

export default StopLimitOrderButton
