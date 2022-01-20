import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Trade, TradeType } from '@sushiswap/core-sdk'
import { STOP_LIMIT_ORDER_ADDRESS } from '@sushiswap/limit-order-sdk'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import useLimitOrderExecute, { DepositPayload } from 'app/features/legacy/limit-order/useLimitOrderExecute'
import { setRemoveBentoPermit } from 'app/features/trident/remove/removeSlice'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { useBentoBoxContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { setFromBentoBalance, setLimitOrderShowReview } from 'app/state/limit-order/actions'
import { useLimitOrderDerivedInputError, useLimitOrderState } from 'app/state/limit-order/hooks'
import React, { FC, useCallback, useState } from 'react'

interface LimitOrderButton {
  trade?: Trade<Currency, Currency, TradeType>
}

const LimitOrderButton: FC<LimitOrderButton> = ({ trade }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { fromBentoBalance, bentoPermit, attemptingTxn } = useLimitOrderState()
  const error = useLimitOrderDerivedInputError()
  const { deposit } = useLimitOrderExecute()
  const bentoboxContract = useBentoBoxContract()
  const masterContractAddress = chainId && STOP_LIMIT_ORDER_ADDRESS[chainId]
  const [permitError, setPermitError] = useState(false)

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
    if (!trade) return

    if (fromBentoBalance) {
      dispatch(setLimitOrderShowReview(true))
    } else {
      await _deposit({
        inputAmount: trade.inputAmount,
        bentoPermit,
        fromBentoBalance,
      })
    }
  }, [_deposit, bentoPermit, dispatch, fromBentoBalance, trade])

  return (
    <>
      {permitError && (
        <Typography variant="sm" className="border border-yellow/40 text-yellow p-4 rounded text-center">
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
              onPermit: (permit) => dispatch(setRemoveBentoPermit(permit)),
              onPermitError: () => setPermitError(true),
            })}
      >
        {({ approved, loading }) => {
          const disabled = !!error || !approved || loading || attemptingTxn
          return (
            <Button loading={loading || attemptingTxn} color="gradient" disabled={disabled} onClick={handler}>
              {error ? error : fromBentoBalance ? i18n._(t`Review Limit Order`) : i18n._(t`Confirm Deposit`)}
            </Button>
          )
        }}
      </TridentApproveGate>
    </>
  )
}

export default LimitOrderButton
