import React, { FC, useCallback, useState } from 'react'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { Field, setLimitPrice } from '../../state/limit-order/actions'
import { useDerivedLimitOrderInfo, useLimitOrderState } from '../../state/limit-order/hooks'

interface LimitPriceInputPanelProps {
  onBlur: (value: string) => void
}

const LimitPriceInputPanel: FC<LimitPriceInputPanelProps> = ({ onBlur }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { limitPrice } = useLimitOrderState()
  const { currencies, currentPrice } = useDerivedLimitOrderInfo()
  const { i18n } = useLingui()
  const [price, setPrice] = useState<string>()
  const [inverted, setInverted] = useState(false)

  const handleInput = useCallback(
    (value) => {
      setPrice(value)

      // Make sure to always send in normal form
      dispatch(setLimitPrice(inverted ? `${1 / +value}` : value))
      onBlur(value)
    },
    [dispatch, inverted, onBlur]
  )

  const handleInvert = useCallback(() => {
    setPrice((prevState) => `${1 / +prevState}`)
    setInverted((prevState) => !prevState)
  }, [])

  const disabled = !currencies[Field.INPUT] || !currencies[Field.OUTPUT]

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
          onClick={() => handleInput(currentPrice?.toSignificant(6))}
        >
          {i18n._(t`Current`)}
        </span>
      </div>
      <div className="flex bg-dark-900 pl-4 pr-5 w-full h-full border-2 border-dark-800 rounded md:rounded-r items-center gap-3">
        <NumericalInput
          disabled={disabled}
          className="w-full bg-transparent font-medium text-2xl"
          placeholder={
            currentPrice ? (inverted ? currentPrice.invert().toSignificant(6) : currentPrice.toSignificant(6)) : '0.0'
          }
          id="limit-price-input"
          value={price || ''}
          onUserInput={handleInput}
          onBlur={() => onBlur(limitPrice)}
        />
        <div
          className="text-xs whitespace-nowrap cursor-pointer rounded-full border border-dark-800 px-3 py-0.5"
          onClick={handleInvert}
        >
          {inverted ? currencies.INPUT?.symbol : currencies.OUTPUT?.symbol} per{' '}
          {inverted ? currencies.OUTPUT?.symbol : currencies.INPUT?.symbol}
        </div>
      </div>
    </div>
  )
}

export default LimitPriceInputPanel
