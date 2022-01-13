import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Percent, Trade as V2Trade, TradeType } from '@sushiswap/core-sdk'
import FormattedPriceImpact from 'app/components/FormattedPriceImpact'
import { HeadlessUiModal } from 'app/components/Modal'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import { computeRealizedLPFeePercent } from 'app/functions/prices'
import React, { FC, useMemo } from 'react'

export interface AdvancedSwapDetailsProps {
  trade?: V2Trade<Currency, Currency, TradeType>
  allowedSlippage: Percent
}

const AdvancedSwapDetails: FC<AdvancedSwapDetailsProps> = ({ trade, allowedSlippage }) => {
  const { i18n } = useLingui()

  const { priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent)

    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent)

    return { priceImpact, realizedLPFee }
  }, [trade])

  return !trade ? undefined : (
    <HeadlessUiModal.BorderedContent className="flex flex-col px-4 gap-1 bg-dark-1000/40 border !border-dark-800 rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <Typography variant="sm">{i18n._(t`Price Impact`)}</Typography>
          <QuestionHelper
            text={i18n._(t`The difference between the market price and estimated price due to trade size.`)}
          />
        </div>
        <FormattedPriceImpact priceImpact={priceImpact} />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <Typography variant="sm">{i18n._(t`Slippage tolerance`)}</Typography>
        </div>
        <Typography variant="sm">{allowedSlippage.toFixed(2)}%</Typography>
      </div>
    </HeadlessUiModal.BorderedContent>
  )
}

export default AdvancedSwapDetails
