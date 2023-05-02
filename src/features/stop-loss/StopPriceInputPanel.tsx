import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Price, Trade, TradeType } from '@sushiswap/core-sdk'
import Input from 'app/components/Input'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import { useAppDispatch } from 'app/state/hooks'
import { LimitPrice, setStopLossInvertState, setStopPrice } from 'app/state/limit-order/actions'
import useLimitOrderDerivedCurrencies, { useLimitOrderState } from 'app/state/limit-order/hooks'
import React, { FC } from 'react'

interface StopPriceInputPanel {
  trade?: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
  stopPrice?: Price<Currency, Currency>
}

const StopPriceInputPanel: FC<StopPriceInputPanel> = ({ trade, stopPrice }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { stopPrice: stopPriceString, invertStopRate } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const disabled = !inputCurrency || !outputCurrency

  return (
    <div className="flex flex-col gap-1">
      <Typography variant="sm" className="px-2 flex items-center">
        {i18n._(t`Stop Rate`)}
        <QuestionHelper
          text={i18n._(
            t`Rate required to trigger limit rate. The difference between the output token at the stop and minimum rates is used to pay the execution (gas) fee, therefore it needs to be sufficiently large to be $1 assuming the worst case.`
          )}
        />
      </Typography>
      <div className="flex justify-between items-baseline bg-dark-900 rounded px-4 py-1.5 border border-dark-700 hover:border-dark-600">
        <Typography weight={700} variant="lg" className="relative flex items-baseline flex-grow gap-3 overflow-hidden">
          <Input.Numeric
            disabled={disabled}
            className="leading-[32px] focus:placeholder:text-low-emphesis flex-grow w-full text-left bg-transparent text-inherit disabled:cursor-not-allowed"
            placeholder={trade ? trade.executionPrice.toSignificant(6) : '0.0'}
            id="limit-price-input"
            value={
              (stopPriceString === LimitPrice.CURRENT ? trade?.executionPrice.toSignificant(6) : stopPriceString) || ''
            }
            onUserInput={(value: string) => dispatch(setStopPrice(value))}
          />
        </Typography>
        <Typography
          variant="sm"
          onClick={() =>
            dispatch(
              setStopLossInvertState({
                invertStopRate: !invertStopRate,
                stopPrice: stopPrice
                  ? !invertStopRate
                    ? stopPrice?.invert().toSignificant(6)
                    : stopPrice?.toSignificant(6)
                  : '',
              })
            )
          }
        >
          {invertStopRate ? inputCurrency?.symbol : outputCurrency?.symbol}
        </Typography>
      </div>
    </div>
  )
}

export default StopPriceInputPanel
