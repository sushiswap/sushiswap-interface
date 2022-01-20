import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { maxAmountSpend } from 'app/functions'
import { useBentoOrWalletBalances } from 'app/hooks/useBentoOrWalletBalance'
import { useActiveWeb3React } from 'app/services/web3'
import { AppDispatch } from 'app/state'
import { setFromBentoBalance } from 'app/state/limit-order/actions'
import useLimitOrderDerivedCurrencies, { useLimitOrderActionHandlers } from 'app/state/limit-order/hooks'
import { Field } from 'app/state/swap/actions'
import React, { FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'

const BalancePanel: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { inputCurrency } = useLimitOrderDerivedCurrencies()
  const { onUserInput } = useLimitOrderActionHandlers()
  const [walletBalance, bentoBalance] = useBentoOrWalletBalances(
    account ?? undefined,
    [inputCurrency, inputCurrency],
    [true, false]
  )
  const maxAmountInput = maxAmountSpend(walletBalance)
  const dispatch = useDispatch<AppDispatch>()

  const handleMaxInput = useCallback(
    (bento) => {
      if (bento) {
        bentoBalance && onUserInput(Field.INPUT, bentoBalance.toExact())
        dispatch(setFromBentoBalance(true))
      } else {
        maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
        dispatch(setFromBentoBalance(false))
      }
    },
    [bentoBalance, dispatch, maxAmountInput, onUserInput]
  )

  return (
    <div className="grid grid-cols-2 px-5 py-1 rounded-b bg-dark-700">
      <div className="flex gap-2">
        <Typography variant="sm" weight={700}>
          {i18n._(t`In Bento:`)}
        </Typography>
        <Typography variant="sm" className="text-secondary" onClick={() => handleMaxInput(true)}>
          {bentoBalance?.toSignificant(6, { groupSeparator: ',' })} {bentoBalance?.currency.symbol}
        </Typography>
      </div>
      <div className="flex gap-2">
        <Typography variant="sm" weight={700}>
          {i18n._(t`In Wallet:`)}
        </Typography>
        <Typography variant="sm" className="text-secondary" onClick={() => handleMaxInput(false)}>
          {walletBalance?.toSignificant(6, { groupSeparator: ',' })} {walletBalance?.currency.symbol}
        </Typography>
      </div>
    </div>
  )
}

export default BalancePanel
