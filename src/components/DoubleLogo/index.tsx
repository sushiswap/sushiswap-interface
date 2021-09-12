import { Currency } from '@sushiswap/sdk'
import CurrencyLogo from '../CurrencyLogo'
import React from 'react'
import { classNames } from '../../functions'

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
  className?: string
  logoClassName?: string
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  className = '',
  logoClassName = '',
  size = 16,
}: DoubleCurrencyLogoProps) {
  return (
    <div className={classNames('flex items-center space-x-2', className)}>
      <CurrencyLogo className={logoClassName} currency={currency0} size={size.toString() + 'px'} />
      <CurrencyLogo className={logoClassName} currency={currency1} size={size.toString() + 'px'} />
    </div>
  )
}
