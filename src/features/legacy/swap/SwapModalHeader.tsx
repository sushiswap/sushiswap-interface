import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Percent, TradeType } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import useCurrenciesFromURL from 'app/features/trident/context/hooks/useCurrenciesFromURL'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { TradeUnion } from 'app/types'
import React, { FC, useState } from 'react'
import { ArrowDown } from 'react-feather'

import AdvancedSwapDetails from './AdvancedSwapDetails'
import TradePrice from './TradePrice'

interface SwapModalHeader {
  trade?: TradeUnion
  allowedSlippage: Percent
  recipient?: string
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}

const SwapModalHeader: FC<SwapModalHeader> = ({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}) => {
  const { i18n } = useLingui()
  const { currencies } = useCurrenciesFromURL()
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // Use a default CurrencyAmount of 1 so that the price loads in the background hence making the inputs faster
  const fiatValueInput = useUSDCValue(
    trade?.inputAmount || (currencies?.[0] ? CurrencyAmount.fromRawAmount(currencies[0], '1') : undefined)
  )

  // Use a default CurrencyAmount of 1 so that the price loads in the background hence making the inputs faster
  const fiatValueOutput = useUSDCValue(
    trade?.outputAmount || (currencies?.[1] ? CurrencyAmount.fromRawAmount(currencies[1], '1') : undefined)
  )

  const change =
    ((Number(fiatValueOutput?.toExact()) - Number(fiatValueInput?.toExact())) / Number(fiatValueInput?.toExact())) * 100

  return (
    <div className="grid gap-4">
      <div className="flex flex-col">
        <HeadlessUiModal.BorderedContent className="bg-dark-1000/40 border !border-dark-800 rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {trade?.inputAmount.toSignificant(6)}{' '}
                </Typography>
                <Typography className="text-secondary">${fiatValueInput?.toFixed(2)}</Typography>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CurrencyLogo
                currency={trade?.inputAmount.currency}
                size={18}
                className="!rounded-full overflow-hidden"
              />
              <Typography variant="lg" weight={700} className="text-high-emphesis">
                {trade?.inputAmount.currency.symbol}
              </Typography>
            </div>
          </div>
        </HeadlessUiModal.BorderedContent>
        <div className="flex justify-center -mt-3 -mb-3">
          <div className="border-2 border-dark-800 shadow-md rounded-full p-1 backdrop-blur-[20px] z-10">
            <ArrowDown size={18} />
          </div>
        </div>
        <HeadlessUiModal.BorderedContent className="bg-dark-1000/40 border !border-dark-800 rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {trade?.outputAmount.toSignificant(6)}{' '}
                </Typography>
                <Typography className="text-secondary">
                  ${fiatValueOutput?.toFixed(2)}{' '}
                  <Typography variant="xs" component="span">
                    ({change.toFixed(2)}%)
                  </Typography>
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CurrencyLogo
                currency={trade?.outputAmount.currency}
                size={18}
                className="!rounded-full overflow-hidden"
              />
              <Typography variant="lg" weight={700} className="text-high-emphesis">
                {trade?.outputAmount.currency.symbol}
              </Typography>
            </div>
          </div>
        </HeadlessUiModal.BorderedContent>
      </div>
      <TradePrice price={trade?.executionPrice} showInverted={showInverted} setShowInverted={setShowInverted} />
      <AdvancedSwapDetails trade={trade} allowedSlippage={allowedSlippage} recipient={recipient} />

      {showAcceptChanges && (
        <HeadlessUiModal.BorderedContent className="bg-dark-1000/40 border !border-dark-800 rounded-2xl">
          <div className="flex justify-between items-center">
            <Typography variant="sm" weight={700}>
              {i18n._(t`Price Updated`)}
            </Typography>
            <Button variant="outlined" size="xs" color="blue" onClick={onAcceptChanges}>
              {i18n._(t`Accept`)}
            </Button>
          </div>
        </HeadlessUiModal.BorderedContent>
      )}
      <div className="justify-start text-sm text-secondary text-center">
        {trade?.tradeType === TradeType.EXACT_INPUT ? (
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Output is estimated. You will receive at least`)}{' '}
            <Typography variant="xs" className="text-high-emphesis" weight={700} component="span">
              {trade.minimumAmountOut(allowedSlippage).toSignificant(6)} {trade.outputAmount.currency.symbol}
            </Typography>{' '}
            {i18n._(t`or the transaction will revert.`)}
          </Typography>
        ) : (
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Input is estimated. You will sell at most`)}{' '}
            <Typography variant="xs" className="text-high-emphesis" weight={700} component="span">
              {trade?.maximumAmountIn(allowedSlippage).toSignificant(6)} {trade?.inputAmount.currency.symbol}
            </Typography>{' '}
            {i18n._(t`or the transaction will revert.`)}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default SwapModalHeader
