import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Input from 'app/components/Input'
import { useAppDispatch } from 'app/state/hooks'
import { setLimitPrice } from 'app/state/limit-order/actions'
import useLimitOrderDerivedCurrencies, {
  useLimitOrderDerivedTrade,
  useLimitOrderState,
} from 'app/state/limit-order/hooks'
import React, { FC } from 'react'

const LimitPriceInputPanel: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { limitPrice } = useLimitOrderState()
  const trade = useLimitOrderDerivedTrade()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()

  const disabled = !inputCurrency || !outputCurrency

  return (
    <div
      className={`flex-col md:flex-row flex bg-dark-800 w-full rounded overflow-hidden h-[110px] md:h-[68px] ${
        disabled ? 'opacity-40 cursor-default' : ''
      }`}
    >
      <div className="flex w-full md:w-[220px] p-4 gap-4 items-center">
        <span className="font-bold text-secondary">{i18n._(t`Rate`)}:</span>
        <span
          className={`uppercase border border-blue bg-blue text-blue bg-opacity-30 border-opacity-50 py-0.5 px-1.5 text-xs rounded-3xl flex items-center justify-center ${
            !disabled ? 'cursor-pointer hover:border-opacity-100' : ''
          }`}
          onClick={() => dispatch(setLimitPrice(trade?.executionPrice.toFixed()))}
        >
          {i18n._(t`Current`)}
        </span>
      </div>
      <div className="flex items-center w-full h-full gap-3 pl-4 pr-5 border-2 rounded bg-dark-900 border-dark-800 md:rounded-r">
        <Input.Numeric
          disabled={disabled}
          className="w-full text-2xl font-medium bg-transparent"
          placeholder={trade ? trade.executionPrice.toSignificant(6) : '0.0'}
          id="limit-price-input"
          value={limitPrice || ''}
          onUserInput={(val) => dispatch(setLimitPrice(val))}
        />
        <div className="text-xs text-secondary whitespace-nowrap">
          {outputCurrency?.symbol} per {inputCurrency?.symbol}
        </div>
      </div>
    </div>
  )
}

export default LimitPriceInputPanel
