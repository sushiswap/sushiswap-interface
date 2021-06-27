import { Currency } from '@sushiswap/sdk'
import CurrencyLogo from '../CurrencyLogo'
import React from 'react'

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
}

export default function DoubleCurrencyLogo({ currency0, currency1, size = 16 }: DoubleCurrencyLogoProps) {
  return (
    <div className="flex items-center space-x-2">
      <CurrencyLogo currency={currency0} size={size.toString() + 'px'} />
      <CurrencyLogo currency={currency1} size={size.toString() + 'px'} />
    </div>
  )
}
