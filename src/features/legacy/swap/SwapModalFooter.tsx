import { Currency, TradeType, Trade as V2Trade } from '@sushiswap/core-sdk'
import React, { ReactNode } from 'react'
import { ButtonError } from '../../../components/Button'
import { SwapCallbackError } from './SwapCallbackError'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function SwapModalFooter({
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: V2Trade<Currency, Currency, TradeType>
  onConfirm: () => void
  swapErrorMessage: ReactNode | undefined
  disabledConfirm: boolean
}) {
  const { i18n } = useLingui()
  return (
    <div className="p-6 mt-0 -m-6 rounded bg-dark-800">
      <ButtonError
        onClick={onConfirm}
        disabled={disabledConfirm}
        id="confirm-swap-or-send"
        className="text-xl font-semibold"
      >
        {i18n._(t`Confirm Swap`)}
      </ButtonError>

      {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
    </div>
  )
}
