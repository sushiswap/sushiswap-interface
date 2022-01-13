import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import { Currency, Price } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { FC, useCallback } from 'react'

interface TradePriceProps {
  price?: Price<Currency, Currency>
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
  className?: string
}

const TradePrice: FC<TradePriceProps> = ({ price, showInverted, setShowInverted, className }) => {
  let formattedPrice

  try {
    formattedPrice = showInverted ? price?.toSignificant(4) : price?.invert()?.toSignificant(4)
  } catch (error) {
    formattedPrice = '0'
  }

  const label = showInverted ? `${price?.quoteCurrency?.symbol}` : `${price?.baseCurrency?.symbol} `
  const labelInverted = showInverted ? `${price?.baseCurrency?.symbol} ` : `${price?.quoteCurrency?.symbol}`
  const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted])
  const text = `${'1 ' + labelInverted + ' = ' + formattedPrice ?? '-'} ${label}`

  return (
    <div
      onClick={flipPrice}
      title={text}
      className={classNames(
        'flex justify-center w-full gap-1 cursor-pointer text-high-emphesis hover:text-white',
        className
      )}
    >
      <Typography variant="sm" weight={700} className=" tracking-[0.04em]">
        {text}
      </Typography>
      <div className="flex items-center gap-4">
        <SwitchHorizontalIcon width={16} />
      </div>
    </div>
  )
}

export default TradePrice
