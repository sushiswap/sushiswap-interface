import React, { useCallback } from 'react'

import { Currency, Price } from '@sushiswap/sdk'
import Typography from '../../components/Typography'
import { classNames } from '../../functions'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

interface TradePriceProps {
  price: Price<Currency, Currency>
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
  className?: string
}

export default function TradePrice({ price, showInverted, setShowInverted, className }: TradePriceProps) {
  const { i18n } = useLingui()

  let formattedPrice: string

  try {
    formattedPrice = showInverted ? price.toSignificant(4) : price.invert()?.toSignificant(4)
  } catch (error) {
    formattedPrice = '0'
  }

  const label = showInverted ? `${price.quoteCurrency?.symbol}` : `${price.baseCurrency?.symbol} `

  const labelInverted = showInverted ? `${price.baseCurrency?.symbol} ` : `${price.quoteCurrency?.symbol}`

  const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted])

  const text = `${'1 ' + labelInverted + ' = ' + formattedPrice ?? '-'} ${label}`

  return (
    <div
      onClick={flipPrice}
      title={text}
      className={classNames(
        'flex justify-between w-full px-5 py-1 cursor-pointer rounded-b-md text-secondary hover:text-primary',
        className
      )}
    >
      <Typography variant="sm" className="select-none">
        {i18n._(t`Exchange Rate`)}
      </Typography>
      <div className="flex items-center space-x-4">
        <Typography variant="sm" className="select-none">
          {text}
        </Typography>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      </div>
    </div>
  )
}
