import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Trade as V2Trade, TradeType } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import React, { ReactNode } from 'react'

import SwapCallbackError from './SwapCallbackError'

export default function SwapModalFooter({
  trade,
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
    <div className="flex flex-col gap-4">
      <Button onClick={onConfirm} disabled={disabledConfirm} id="confirm-swap-or-send" color="blue">
        {i18n._(t`Confirm Swap`)}
      </Button>

      {swapErrorMessage && <SwapCallbackError error={swapErrorMessage} />}
    </div>
  )
}
