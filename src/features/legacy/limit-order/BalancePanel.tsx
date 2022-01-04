import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { maxAmountSpend } from 'app/functions'
import { AppDispatch } from 'app/state'
import { setFromBentoBalance } from 'app/state/limit-order/actions'
import { useDerivedLimitOrderInfo, useLimitOrderActionHandlers } from 'app/state/limit-order/hooks'
import { Field } from 'app/state/swap/actions'
import React, { FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'

const BalancePanel: FC = () => {
  const { i18n } = useLingui()
  const { walletBalances, bentoboxBalances, currencies } = useDerivedLimitOrderInfo()
  const { onUserInput } = useLimitOrderActionHandlers()
  const maxAmountInput = maxAmountSpend(walletBalances[Field.INPUT])
  const dispatch = useDispatch<AppDispatch>()

  const handleMaxInput = useCallback(
    (bento) => {
      if (bento) {
        onUserInput(Field.INPUT, bentoboxBalances[Field.INPUT].toExact())
        dispatch(setFromBentoBalance(true))
      } else {
        maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
        dispatch(setFromBentoBalance(false))
      }
    },
    [bentoboxBalances, dispatch, maxAmountInput, onUserInput]
  )

  return (
    <div className="grid grid-cols-2 px-5 py-1 rounded-b bg-dark-700">
      <div className="flex gap-2">
        <Typography variant="sm" weight={700}>
          {i18n._(t`In Bento:`)}
        </Typography>
        <Typography variant="sm" className="text-secondary" onClick={() => handleMaxInput(true)}>
          {bentoboxBalances[Field.INPUT]?.toSignificant(6, { groupSeparator: ',' })} {currencies[Field.INPUT]?.symbol}
        </Typography>
      </div>
      <div className="flex gap-2">
        <Typography variant="sm" weight={700}>
          {i18n._(t`In Wallet:`)}
        </Typography>
        <Typography variant="sm" className="text-secondary" onClick={() => handleMaxInput(false)}>
          {walletBalances[Field.INPUT]?.toSignificant(6, { groupSeparator: ',' })} {currencies[Field.INPUT]?.symbol}
        </Typography>
      </div>
    </div>
  )
}

export default BalancePanel
