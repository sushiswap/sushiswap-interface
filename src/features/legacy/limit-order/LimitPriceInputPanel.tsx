import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Price, Trade, TradeType } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Input from 'app/components/Input'
import Typography from 'app/components/Typography'
import { useAppDispatch } from 'app/state/hooks'
import { LimitPrice, setLimitOrderInvertState, setLimitPrice } from 'app/state/limit-order/actions'
import useLimitOrderDerivedCurrencies, { useLimitOrderState } from 'app/state/limit-order/hooks'
import React, { FC } from 'react'

interface LimitPriceInputPanel {
  trade?: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
  limitPrice?: Price<Currency, Currency>
}

const LimitPriceInputPanel: FC<LimitPriceInputPanel> = ({ trade, limitPrice }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { limitPrice: limitPriceString, invertRate } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()

  const disabled = !inputCurrency || !outputCurrency
  const placeholder = trade
    ? (invertRate ? trade.executionPrice.invert() : trade.executionPrice).toSignificant(6)
    : '0.0'

  return (
    <div
      className={`flex-col md:flex-row flex bg-dark-800 w-full rounded overflow-hidden h-[110px] md:h-[68px] ${
        disabled ? 'opacity-40 cursor-default' : ''
      }`}
    >
      <div className="flex w-full md:w-[220px] p-4 gap-4 items-center">
        <Typography weight={700} className="text-high-emphesis">
          {i18n._(t`Rate`)}
        </Typography>
        <Button
          size="xs"
          variant="outlined"
          color="gray"
          disabled={disabled}
          onClick={() => dispatch(setLimitPrice(LimitPrice.CURRENT))}
        >
          {i18n._(t`Current`)}
        </Button>
      </div>
      <div className="flex items-center w-full h-full gap-3 pl-4 pr-5 border-2 rounded bg-dark-900 border-dark-800 md:rounded-r">
        <Input.Numeric
          disabled={disabled}
          className="w-full text-2xl font-bold bg-transparent placeholder:text-low-emphesis focus:placeholder:text-low-emphesis"
          placeholder={placeholder}
          id="limit-price-input"
          value={
            (limitPriceString === LimitPrice.CURRENT ? trade?.executionPrice.toSignificant(6) : limitPriceString) || ''
          }
          onUserInput={(value) => dispatch(setLimitPrice(value))}
        />
        <Button
          size="xs"
          variant="outlined"
          color="gray"
          className="whitespace-nowrap"
          onClick={() =>
            dispatch(
              setLimitOrderInvertState({
                invertRate: !invertRate,
                limitPrice: limitPrice
                  ? !invertRate
                    ? limitPrice?.invert().toSignificant(6)
                    : limitPrice?.toSignificant(6)
                  : '',
              })
            )
          }
        >
          {invertRate ? inputCurrency?.symbol : outputCurrency?.symbol} per{' '}
          {invertRate ? outputCurrency?.symbol : inputCurrency?.symbol}
        </Button>
      </div>
    </div>
  )
}

export default LimitPriceInputPanel
