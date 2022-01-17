import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Price } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { useDerivedTridentSwapContext } from 'app/features/trident/swap/DerivedTradeContext'
import React, { FC, useState } from 'react'

import useCurrenciesFromURL from '../useCurrenciesFromURL'

interface SwapRateProps {
  className?: string
}

const SwapRate: FC<SwapRateProps> = ({ className = 'text-low-emphesis' }) => {
  const { i18n } = useLingui()
  const { currencies } = useCurrenciesFromURL()
  const [invert, setInvert] = useState(false)
  const { parsedAmounts } = useDerivedTridentSwapContext()
  const outputSymbol = <span className="text-secondary">{currencies[1]?.symbol}</span>
  const inputSymbol = <span className="text-secondary">{parsedAmounts?.[0]?.currency.symbol}</span>
  const price =
    parsedAmounts?.[0] &&
    parsedAmounts?.[1] &&
    new Price(
      parsedAmounts?.[0].currency,
      parsedAmounts?.[1].currency,
      parsedAmounts?.[0].quotient,
      parsedAmounts?.[1].quotient
    )

  return (
    <div className="flex justify-between">
      <Typography variant="sm" className={className}>
        {i18n._(t`Exchange Rate`)}
      </Typography>
      <div id="btn-exchange-rate" className="flex items-center gap-2 cursor-pointer" onClick={() => setInvert(!invert)}>
        <Typography variant="sm" className="text-high-emphesis" weight={700}>
          {invert ? (
            <>
              1 {outputSymbol} = {price?.invert().toSignificant(6)} {inputSymbol}
            </>
          ) : (
            <>
              1 {inputSymbol} = {price?.toSignificant(6)} {outputSymbol}
            </>
          )}
        </Typography>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 5.25L15 5.25M15 5.25L12 2.25M15 5.25L12 8.25M12 12.75L3 12.75M3 12.75L6 15.75M3 12.75L6 9.75"
            stroke="url(#paint0_linear_1505:8092)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1505:8092"
              x1="15"
              y1="1.21154"
              x2="10.4441"
              y2="17.7951"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0993EC" />
              <stop offset="1" stopColor="#F338C3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}

export default SwapRate
