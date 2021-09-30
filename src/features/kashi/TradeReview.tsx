import { Currency, TradeType, Trade as V2Trade } from '@sushiswap/sdk'
import React, { useMemo } from 'react'

import FormattedPriceImpact from '../exchange-v1/swap/FormattedPriceImpact'
import QuestionHelper from '../../components/QuestionHelper'
import SwapRoute from '../exchange-v1/swap/SwapRoute'
import { computeRealizedLPFeePercent } from '../../functions/prices'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

function TradeReview({
  trade,
  allowedSlippage,
}: {
  trade: V2Trade<Currency, Currency, TradeType> | undefined
  allowedSlippage: any
}) {
  const { i18n } = useLingui()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent)
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent)
    return { priceImpact, realizedLPFee }
  }, [trade])

  return (
    <>
      <div className="text-xl text-high-emphesis">Swap Review</div>
      {trade ? (
        <div className="py-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-lg text-secondary">
              {i18n._(t`Minimum received`)}
              <QuestionHelper
                text={i18n._(
                  t`Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.`
                )}
              />
            </div>
            <div className="text-lg">
              {`${trade.minimumAmountOut(allowedSlippage)?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-'}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-lg text-secondary">
              {i18n._(t`Price Impact`)}
              <QuestionHelper
                text={i18n._(t`The difference between the market price and estimated price due to trade size.`)}
              />
            </div>
            <div className="text-lg">
              <FormattedPriceImpact priceImpact={priceImpact} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-lg text-secondary">
              Liquidity Provider Fee
              <QuestionHelper
                text={i18n._(t`A portion of each trade (0.25%) goes to liquidity providers as a protocol incentive.`)}
              />
            </div>
            <div className="text-lg">
              {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
            </div>
          </div>
          {showRoute && (
            <div className="flex items-center justify-between">
              <div className="text-lg text-secondary">
                {i18n._(t`Route`)}
                <QuestionHelper
                  text={i18n._(t`Routing through these tokens resulted in the best price for your trade.`)}
                />
              </div>
              <div className="text-lg">
                <SwapRoute trade={trade} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4 text-lg text-secondary">{i18n._(t`No liquidity found to do swap`)}</div>
      )}
    </>
  )
}

export default TradeReview
